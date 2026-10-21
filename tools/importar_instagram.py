#!/usr/bin/env python3
"""
Importa as fotos do Instagram da ótica para o catálogo do site.

Usa o EXPORT OFICIAL do Instagram ("Exportar suas informações"), que o dono da
conta pede no próprio app. Não acessa o Instagram, não precisa de senha e não
usa nenhuma API: só lê o arquivo .zip (ou a pasta) que você baixou.

Uso (dentro da pasta do projeto):

    python3 tools/importar_instagram.py CAMINHO/instagram-export.zip --substituir

  --substituir      apaga o catálogo atual (inclusive os exemplos) e recomeça.
                    Sem isso, só ADICIONA posts novos e ignora os já importados.
  --carrossel MODO  como tratar posts com várias fotos:
                      galeria  (padrão) um modelo por post, com todas as fotos na galeria
                      primeira só a primeira foto de cada post
                      todas    cada foto vira um modelo separado
  --max N           importa no máximo N posts (os mais recentes)
  --destaques N     quantos modelos novos aparecem na página inicial (padrão 8)
  --categoria X     força uma categoria em todos (grau, sol, clipon, lentes, acessorios)
  --tamanho PX      lado maior das fotos (padrão 960)
  --dry-run         só mostra o que faria, sem escrever nada

Precisa do Pillow:  pip install pillow
Para fotos .heic (iPhone):  pip install pillow-heif
"""
import argparse, hashlib, json, re, sys, tempfile, unicodedata, zipfile
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Falta o Pillow. Instale com:  pip install pillow")

try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    HEIF = True
except ImportError:
    HEIF = False

EXT = {".jpg", ".jpeg", ".png", ".webp", ".heic"}
POSTS_JSON = re.compile(r"^posts(_\d+)?\.json$", re.I)   # NÃO inclui reposts.json, stories.json, etc.

# palavras da legenda -> categoria (a primeira regra que bater vale)
REGRAS = [
    ("lentes", ["lente de contato", "lentes de contato", "contato colorid"]),
    ("clipon", ["clipon", "clip-on", "clip on", "clips "]),
    ("sol", ["solar", "oculos de sol", "óculos de sol", "polarizad", "uv400", "sunglass", "espelhad"]),
    ("acessorios", ["estojo", "cordao", "cordão", "flanela", "acessorio", "acessório", "corrente"]),
    ("grau", ["grau", "armacao", "armação", "receita", "acetato", "eyeglass"]),
]
EMOJI = re.compile("[\U0001F000-\U0001FFFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u200d]")


def sem_acento(s):
    return unicodedata.normalize("NFD", s.lower()).encode("ascii", "ignore").decode()


def corrigir_texto(s):
    """O export do Instagram grava UTF-8 como se fosse latin-1 ('Ã§' em vez de 'ç')."""
    if not isinstance(s, str):
        return ""
    try:
        return s.encode("latin-1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return s


def extrair_post(item):
    """Lê um post nos dois formatos do export (antigo: 'media'+'title'; novo: 'label_values')."""
    fotos, legendas = [], []

    def andar(o):
        if isinstance(o, dict):
            if isinstance(o.get("uri"), str):
                fotos.append(o["uri"].replace("\\", "/"))
                t = corrigir_texto(o.get("title", ""))
                if t.strip():
                    legendas.append(t)
            rotulo = corrigir_texto(o["label"]).strip().lower() if isinstance(o.get("label"), str) else ""
            if rotulo in ("legenda", "caption") and isinstance(o.get("value"), str) and o["value"].strip():
                legendas.insert(0, corrigir_texto(o["value"]))
            for v in o.values():
                andar(v)
        elif isinstance(o, list):
            for v in o:
                andar(v)

    andar(item)
    titulo = corrigir_texto(item.get("title", "")) if isinstance(item.get("title"), str) else ""
    legenda = titulo.strip() or (legendas[0].strip() if legendas else "")
    vistos, unicas = set(), []
    for f in fotos:
        if f.lower() not in vistos:
            vistos.add(f.lower())
            unicas.append(f)
    ts = item.get("creation_timestamp") or item.get("timestamp") or 0
    return unicas, legenda, ts


def ler_posts(raiz: Path):
    """Junta posts_1.json (formato antigo) e posts.json (novo) sem duplicar o mesmo post.
    Dois itens são o mesmo post se dividem ao menos uma foto. O arquivo posts_N.json vem
    primeiro porque traz as fotos do carrossel na ordem certa."""
    posts, indice = [], {}
    arquivos = sorted((j for j in raiz.rglob("*.json") if POSTS_JSON.match(j.name)),
                      key=lambda j: (0 if "_" in j.name else 1, j.name))
    for jf in arquivos:
        try:
            dados = json.loads(jf.read_text(encoding="utf-8"))
        except Exception:
            continue
        lista = dados if isinstance(dados, list) else next((v for v in dados.values() if isinstance(v, list)), [])
        for item in lista:
            if not isinstance(item, dict):
                continue
            fotos, legenda, ts = extrair_post(item)
            if not fotos:
                continue
            alvo = next((indice[f.lower()] for f in fotos if f.lower() in indice), None)
            if alvo is None:
                posts.append({"fotos": list(fotos), "legenda": legenda, "ts": ts})
                alvo = len(posts) - 1
            else:
                p = posts[alvo]
                p["legenda"] = p["legenda"] or legenda
                p["ts"] = p["ts"] or ts
                tem = {x.lower() for x in p["fotos"]}
                p["fotos"] += [f for f in fotos if f.lower() not in tem]
            for f in fotos:
                indice[f.lower()] = alvo
    return sorted(posts, key=lambda p: p["ts"], reverse=True)   # mais recentes primeiro


def resolver(raiz: Path, uri: str):
    f = raiz / uri
    if f.is_file():
        return f
    achados = list(raiz.rglob(Path(uri).name))
    return achados[0] if achados else None


def posts_por_pasta(raiz: Path):
    """Plano B: sem os JSON, usa as fotos de media/posts uma a uma."""
    imgs = [p for p in raiz.rglob("*") if p.is_file() and p.suffix.lower() in EXT and "media/posts" in p.as_posix().lower()]
    imgs.sort(key=lambda p: (p.stat().st_mtime, p.name), reverse=True)
    return [{"fotos": [p.relative_to(raiz).as_posix()], "legenda": "", "ts": 0} for p in imgs]


def categoria_da_legenda(legenda):
    t = sem_acento(legenda)
    for cat, palavras in REGRAS:
        if any(sem_acento(p) in t for p in palavras):
            return cat
    return ""


def nome_e_descricao(legenda, numero):
    legenda = EMOJI.sub("", legenda)
    linhas = [re.sub(r"#\w+", "", l).strip() for l in legenda.replace("\r", "").split("\n")]
    linhas = [re.sub(r"\s{2,}", " ", l) for l in linhas if l]
    if not linhas:
        return f"Modelo {numero}", ""
    primeira = linhas[0]
    nome = re.split(r"[.!?\n]", primeira)[0].strip(" -–—:,") or primeira
    if len(nome) > 60:
        nome = nome[:57].rstrip() + "…"
    resto = " ".join(linhas[1:]) if len(linhas) > 1 else (primeira if nome != primeira else "")
    return nome, resto[:300]


def ler_catalogo(arquivo: Path):
    texto = arquivo.read_text(encoding="utf-8")
    m_cat = re.search(r"window\.OTICA_CATEGORIAS\s*=\s*(\[.*?\]);", texto, re.S)
    m_prod = re.search(r"window\.OTICA_CATALOGO\s*=\s*(\[.*\]);", texto, re.S)
    if not (m_cat and m_prod):
        sys.exit("Não consegui ler js/catalogo.js (mantenha as linhas 'window.OTICA_CATEGORIAS = [...]' e 'window.OTICA_CATALOGO = [...]').")
    return texto[: texto.index("window.OTICA_CATEGORIAS")], json.loads(m_cat.group(1)), json.loads(m_prod.group(1))


def escrever_catalogo(arquivo: Path, cabecalho, categorias, produtos):
    corpo = ("window.OTICA_CATEGORIAS = " + json.dumps(categorias, ensure_ascii=False, indent=2) + ";\n\n"
             "window.OTICA_CATALOGO = " + json.dumps(produtos, ensure_ascii=False, indent=2) + ";\n")
    arquivo.write_text(cabecalho + corpo, encoding="utf-8")


def abrir_foto(caminho: Path, tamanho):
    im = ImageOps.exif_transpose(Image.open(caminho)).convert("RGB")
    im.thumbnail((tamanho, tamanho), Image.LANCZOS)
    return im


def main():
    ap = argparse.ArgumentParser(description="Importa as fotos do export do Instagram para o catálogo.")
    ap.add_argument("origem", help="arquivo .zip ou pasta do export do Instagram")
    ap.add_argument("--projeto", default=str(Path(__file__).resolve().parent.parent), help="pasta do site (padrão: a pasta acima de tools/)")
    ap.add_argument("--substituir", action="store_true", help="apaga o catálogo atual (inclusive os exemplos) antes de importar")
    ap.add_argument("--carrossel", choices=["galeria", "primeira", "todas"], default="galeria")
    ap.add_argument("--max", type=int, default=0, help="máximo de posts a importar (os mais recentes)")
    ap.add_argument("--destaques", type=int, default=8, help="quantos modelos novos viram destaque na home")
    ap.add_argument("--categoria", default="", help="força uma categoria em todos")
    ap.add_argument("--tamanho", type=int, default=960, help="lado maior das fotos, em pixels")
    ap.add_argument("--qualidade", type=int, default=74, help="qualidade do WebP (1-100)")
    ap.add_argument("--dry-run", action="store_true", help="só mostra o que faria")
    a = ap.parse_args()

    projeto = Path(a.projeto)
    arq_catalogo = projeto / "js" / "catalogo.js"
    pasta_img = projeto / "img" / "catalogo"
    if not arq_catalogo.exists():
        sys.exit(f"Não achei {arq_catalogo}. Rode o comando na pasta do site ou use --projeto.")
    origem = Path(a.origem)
    if not origem.exists():
        sys.exit(f"Não achei {origem}")
    tmp = None
    if origem.is_file() and origem.suffix.lower() == ".zip":
        tmp = tempfile.TemporaryDirectory()
        with zipfile.ZipFile(origem) as z:
            z.extractall(tmp.name)
        raiz = Path(tmp.name)
    else:
        raiz = origem

    cabecalho, categorias, produtos = ler_catalogo(arq_catalogo)
    ids_categoria = {c["id"] for c in categorias}
    if a.categoria and a.categoria not in ids_categoria:
        sys.exit(f"Categoria '{a.categoria}' não existe. Use uma destas: {', '.join(sorted(ids_categoria))}")

    posts = ler_posts(raiz) or posts_por_pasta(raiz)
    if not posts:
        sys.exit("Não encontrei publicações nesse export. Confira se você marcou 'Mídia'/'Publicações' ao pedir os dados.")
    if a.carrossel == "primeira":
        posts = [dict(p, fotos=p["fotos"][:1]) for p in posts]
    elif a.carrossel == "todas":
        posts = [dict(p, fotos=[f]) for p in posts for f in p["fotos"]]
    com_legenda = sum(1 for p in posts if p["legenda"].strip())

    if a.substituir:
        antigos, produtos = produtos, []
    else:
        antigos = []
    ja = {p.get("origem") for p in produtos if p.get("origem")}
    maior = 0 if a.substituir else max([int(re.sub(r"\D", "", str(p["id"])) or 0) for p in produtos] + [0])

    novos, pulados, erros, sem_arquivo, heic_pulados, repetidas = [], 0, 0, 0, 0, 0
    for post in posts:
        if a.max and len(novos) >= a.max:
            break
        arquivos, conteudos = [], set()
        for uri in post["fotos"]:
            f = resolver(raiz, uri)
            if not f:
                sem_arquivo += 1
                continue
            if f.suffix.lower() == ".heic" and not HEIF:
                heic_pulados += 1
                continue
            conteudo = hashlib.sha1(f.read_bytes()).hexdigest()
            if conteudo in conteudos:          # a "capa" do carrossel é um arquivo igual à 1ª foto
                repetidas += 1
                continue
            conteudos.add(conteudo)
            arquivos.append((f, conteudo))
        if not arquivos:
            continue
        h = arquivos[0][1][:12]
        arquivos = [f for f, _ in arquivos]
        if h in ja:
            pulados += 1
            continue
        numero = maior + len(novos) + 1
        id_ = f"{numero:03d}"
        fotos = []
        for f in arquivos:
            try:
                im = abrir_foto(f, a.tamanho)
            except Exception as e:
                print(f"  ! foto ignorada ({e}): {f.name}")
                erros += 1
                continue
            nome_arq = f"{id_}.webp" if not fotos else f"{id_}-{len(fotos) + 1}.webp"
            fotos.append({"imagem": f"img/catalogo/{nome_arq}", "largura": im.width, "altura": im.height, "_im": im})
        if not fotos:
            continue
        nome, descricao = nome_e_descricao(post["legenda"], numero)
        novos.append({
            "id": id_, "nome": nome, "categoria": a.categoria or categoria_da_legenda(post["legenda"]),
            "imagem": fotos[0]["imagem"], "largura": fotos[0]["largura"], "altura": fotos[0]["altura"],
            "alt": nome, "descricao": descricao, "destaque": len(novos) < a.destaques, "origem": h, "tipo": "galeria",
            "_fotos": fotos,
        })

    total_fotos = sum(len(n["_fotos"]) for n in novos)
    print(f"Posts: {len(posts)} ({com_legenda} com legenda) | modelos novos: {len(novos)} com {total_fotos} fotos | já importados (pulados): {pulados}")
    if repetidas:
        print(f"  (i) {repetidas} foto(s) repetidas dentro de posts foram descartadas")
    if sem_arquivo:
        print(f"  ! {sem_arquivo} foto(s) citadas no JSON não estão na pasta")
    if heic_pulados:
        print(f"  ! {heic_pulados} foto(s) .heic ignoradas (instale com: pip install pillow-heif)")
    if erros:
        print(f"  ! {erros} foto(s) com erro")
    if not novos:
        print("Nada novo para importar.")
        return
    por_cat = {}
    for n in novos:
        k = n["categoria"] or "(sem categoria)"
        por_cat[k] = por_cat.get(k, 0) + 1
    print("Categorias pelas legendas:", ", ".join(f"{k}: {v}" for k, v in sorted(por_cat.items())))

    if a.dry_run:
        print("--dry-run: nada foi escrito.")
        for n in novos[:10]:
            print(f"  {n['id']}  [{n['categoria'] or '-'}]  {n['nome']}  ({len(n['_fotos'])} foto(s))")
        return

    pasta_img.mkdir(parents=True, exist_ok=True)
    if a.substituir:
        for p in antigos:
            for caminho in [p.get("imagem", "")] + [g.get("imagem", "") for g in p.get("galeria", [])]:
                f = projeto / caminho
                if caminho and f.is_file() and pasta_img in f.parents:
                    f.unlink()
        print(f"Catálogo anterior removido ({len(antigos)} modelos).")
    for n in novos:
        galeria = []
        for ft in n.pop("_fotos"):
            im = ft.pop("_im")
            im.save(projeto / ft["imagem"], "WEBP", quality=a.qualidade, method=6)
            galeria.append(ft)
        if len(galeria) > 1:
            n["galeria"] = galeria
    escrever_catalogo(arq_catalogo, cabecalho, categorias, novos + produtos)
    print(f"Pronto: {len(novos)} modelos ({total_fotos} fotos) em {arq_catalogo.relative_to(projeto)} e {pasta_img.relative_to(projeto)}/")
    print("Próximos passos: abra js/catalogo.js, revise nomes e categorias (modelos sem categoria só aparecem em 'Todos')")
    print("e abra colecao.html para conferir. Para trazer posts novos depois, peça outro export e rode sem --substituir.")
    if tmp:
        tmp.cleanup()


if __name__ == "__main__":
    main()
