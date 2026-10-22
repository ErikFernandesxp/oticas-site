#!/usr/bin/env python3
"""
migrar_catalogo_supabase.py — leva os modelos de js/catalogo.js para o Supabase,
cadastrando cada um exatamente como o painel (admin.html) faria: fotos no
Storage, linha na tabela "produtos", código AE-xxxx automático, dono = a sua
conta de administrador. Depois disso você edita tudo pelo painel.

Só usa a biblioteca padrão do Python 3.8+ (não precisa de pip install).
NÃO usa a chave service_role: entra com o e-mail e a senha do administrador.

Uso (na pasta do site — a que tem index.html e js/):

  1) Simulação, sem enviar nada:
       python tools/migrar_catalogo_supabase.py --dry-run

  2) Para valer (pergunta a senha; ela não é gravada em lugar nenhum):
       python tools/migrar_catalogo_supabase.py --email seu@email.com

Preços: cada categoria recebe um valor inicial (estimativa de mercado).
Ajuste com --preco-grau 129.90 --preco-sol 119.90 --preco-clipon 149.90 ou
depois, em massa, pelo painel (Produtos → Ajustar preços em massa).

Pode rodar de novo: o que já foi migrado fica registrado em
tools/migracao_estado.json e é pulado.
"""
import argparse
import getpass
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from datetime import datetime, timedelta, timezone

PRECOS_PADRAO = {"grau": 129.90, "sol": 119.90, "clipon": 149.90}
TIPOS_IMAGEM = {".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png"}


def erro(msg):
    print("\nERRO: " + msg, file=sys.stderr)
    sys.exit(1)


def moeda(v):
    return "R$ " + f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


# ---------------------------------------------------------------- arquivos do site
def ler_config(raiz):
    caminho = os.path.join(raiz, "js", "config.js")
    if not os.path.exists(caminho):
        return {}
    s = open(caminho, encoding="utf-8").read()
    m = re.search(r"supabase\s*:\s*\{(.*?)\}", s, re.S)
    bloco = m.group(1) if m else ""

    def pega(chave):
        r = re.search(chave + r'\s*:\s*"([^"]*)"', bloco)
        return r.group(1).strip() if r else ""

    return {"url": pega("url").rstrip("/"), "chave": pega("anonKey"), "bucket": pega("bucket") or "produtos"}


def ler_catalogo(raiz):
    caminho = os.path.join(raiz, "js", "catalogo.js")
    if not os.path.exists(caminho):
        erro("Não achei js/catalogo.js. Rode o script na pasta do site.")
    s = open(caminho, encoding="utf-8").read()
    m = re.search(r"window\.OTICA_CATALOGO\s*=\s*", s)
    if not m:
        erro("Não achei window.OTICA_CATALOGO em js/catalogo.js.")
    dados, _ = json.JSONDecoder().raw_decode(s[m.end():])
    return dados


def fotos_do_modelo(p):
    lista = p.get("galeria") or [{"imagem": p.get("imagem"), "largura": p.get("largura"), "altura": p.get("altura")}]
    return [g for g in lista if g and g.get("imagem")]


# ---------------------------------------------------------------- Supabase
class Supabase:
    def __init__(self, url, chave, bucket):
        self.url, self.chave, self.bucket = url, chave, bucket
        self.token = self.refresh = None
        self.email = ""

    def _http(self, metodo, caminho, corpo=None, cab=None, token=True, bruto=False):
        h = {"apikey": self.chave}
        if token and self.token:
            h["Authorization"] = "Bearer " + self.token
        h.update(cab or {})
        dados = corpo
        if corpo is not None and not isinstance(corpo, (bytes, bytearray)):
            dados = json.dumps(corpo).encode("utf-8")
            h.setdefault("Content-Type", "application/json")
        req = urllib.request.Request(self.url + caminho, data=dados, headers=h, method=metodo)
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                texto = r.read().decode("utf-8", "replace")
                return r.status, (json.loads(texto) if texto.strip() and not bruto else texto)
        except urllib.error.HTTPError as e:
            texto = e.read().decode("utf-8", "replace")
            try:
                corpo_erro = json.loads(texto)
            except Exception:
                corpo_erro = texto
            return e.code, corpo_erro
        except urllib.error.URLError as e:
            erro("Sem conexão com o Supabase (" + str(e.reason) + ").")

    def chamar(self, metodo, caminho, corpo=None, cab=None):
        status, resp = self._http(metodo, caminho, corpo, cab)
        if status == 401 and self.refresh:  # sessão de 1 hora venceu: renova e tenta de novo
            self.renovar()
            status, resp = self._http(metodo, caminho, corpo, cab)
        return status, resp

    def _guardar(self, d, email=""):
        self.token, self.refresh = d["access_token"], d.get("refresh_token")
        self.email = (d.get("user") or {}).get("email") or email

    def entrar(self, email, senha):
        status, d = self._http("POST", "/auth/v1/token?grant_type=password", {"email": email, "password": senha}, token=False)
        if status != 200:
            msg = d.get("msg") or d.get("error_description") if isinstance(d, dict) else str(d)
            erro("Não consegui entrar: " + str(msg or status))
        self._guardar(d, email)

    def renovar(self):
        status, d = self._http("POST", "/auth/v1/token?grant_type=refresh_token", {"refresh_token": self.refresh}, token=False)
        if status != 200:
            erro("A sessão venceu e não consegui renovar. Rode de novo (o que já foi enviado é pulado).")
        self._guardar(d, self.email)

    def eh_admin(self):
        status, v = self.chamar("POST", "/rest/v1/rpc/eh_admin", {})
        return status == 200 and v is True

    def url_foto(self, path):
        return f"{self.url}/storage/v1/object/public/{self.bucket}/" + "/".join(urllib.parse.quote(p) for p in path.split("/"))

    def enviar_foto(self, path, dados, tipo):
        caminho = f"/storage/v1/object/{self.bucket}/" + "/".join(urllib.parse.quote(p) for p in path.split("/"))
        status, resp = self.chamar("POST", caminho, dados, {"Content-Type": tipo, "x-upsert": "true", "cache-control": "max-age=31536000"})
        if status >= 300:
            raise RuntimeError("envio da foto falhou (" + str(status) + "): " + str(resp)[:200])

    def apagar_foto(self, path):
        caminho = f"/storage/v1/object/{self.bucket}/" + "/".join(urllib.parse.quote(p) for p in path.split("/"))
        self.chamar("DELETE", caminho)

    def criar_produto(self, obj):
        status, resp = self.chamar("POST", "/rest/v1/produtos", obj, {"Prefer": "return=representation"})
        if status >= 300:
            raise RuntimeError("gravação do produto falhou (" + str(status) + "): " + str(resp)[:300])
        return resp[0] if isinstance(resp, list) else resp

    def ultimo_criado_em(self):
        status, resp = self.chamar("GET", "/rest/v1/produtos?select=criado_em&order=criado_em.desc&limit=1")
        if status == 200 and resp:
            return resp[0].get("criado_em")
        return None

    def total_produtos(self):
        status, resp = self.chamar("GET", "/rest/v1/produtos?select=id")
        return len(resp) if status == 200 and isinstance(resp, list) else 0


# ---------------------------------------------------------------- principal
def main():
    ap = argparse.ArgumentParser(description="Migra js/catalogo.js para o Supabase (como o painel faria).")
    ap.add_argument("--raiz", default=None, help="pasta do site (padrão: a pasta acima de tools/)")
    ap.add_argument("--email", help="e-mail do administrador")
    ap.add_argument("--url", help="URL do projeto (padrão: js/config.js)")
    ap.add_argument("--chave", help="chave anon/publishable (padrão: js/config.js)")
    ap.add_argument("--preco-grau", type=float, default=PRECOS_PADRAO["grau"])
    ap.add_argument("--preco-sol", type=float, default=PRECOS_PADRAO["sol"])
    ap.add_argument("--preco-clipon", type=float, default=PRECOS_PADRAO["clipon"])
    ap.add_argument("--ocultos", action="store_true", help="cadastra tudo oculto no site (você libera depois pelo painel)")
    ap.add_argument("--limite", type=int, default=0, help="migra só os N primeiros (para testar)")
    ap.add_argument("--dry-run", action="store_true", help="só mostra o plano, não envia nada")
    ap.add_argument("--sim", action="store_true", help="não pede confirmação")
    a = ap.parse_args()

    raiz = a.raiz or os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    if not os.path.exists(os.path.join(raiz, "js", "catalogo.js")) and os.path.exists(os.path.join(os.getcwd(), "js", "catalogo.js")):
        raiz = os.getcwd()
    cfg = ler_config(raiz)
    url, chave, bucket = (a.url or cfg.get("url", "")).rstrip("/"), a.chave or cfg.get("chave", ""), cfg.get("bucket", "produtos")
    precos = {"grau": a.preco_grau, "sol": a.preco_sol, "clipon": a.preco_clipon}

    catalogo = ler_catalogo(raiz)
    if a.limite:
        catalogo = catalogo[: a.limite]
    estado_arq = os.path.join(raiz, "tools", "migracao_estado.json")
    estado = {"itens": {}}
    if os.path.exists(estado_arq):
        estado = json.load(open(estado_arq, encoding="utf-8"))

    pendentes = [p for p in catalogo if str(p["id"]) not in estado["itens"]]
    faltando = [g["imagem"] for p in pendentes for g in fotos_do_modelo(p) if not os.path.exists(os.path.join(raiz, g["imagem"]))]
    if faltando:
        erro("Faltam %d imagens (ex.: %s). Confira a pasta img/catalogo." % (len(faltando), faltando[0]))

    # ---- resumo
    por_cat = {}
    for p in pendentes:
        por_cat.setdefault(p.get("categoria") or "", []).append(p)
    total_fotos = sum(len(fotos_do_modelo(p)) for p in pendentes)
    mb = sum(os.path.getsize(os.path.join(raiz, g["imagem"])) for p in pendentes for g in fotos_do_modelo(p)) / 1e6
    print("Modelos a migrar: %d (já migrados antes: %d) | fotos: %d (%.1f MB)" % (len(pendentes), len(estado["itens"]), total_fotos, mb))
    for cat, lista in sorted(por_cat.items()):
        pr = precos.get(cat)
        print("  - %-8s %3d modelos · preço inicial: %s" % (cat or "(sem categoria)", len(lista), moeda(pr) if pr is not None else "sem preço"))
    grandes = [p for p in pendentes if len(fotos_do_modelo(p)) > 10]
    if grandes:
        print("  Obs.: %d modelo(s) têm mais de 10 fotos (o painel aceita até 10 ao ADICIONAR, mas mantém as existentes)." % len(grandes))
    print("  Situação no site: %s" % ("OCULTOS (você libera pelo painel)" if a.ocultos else "VISÍVEIS"))
    if not pendentes:
        print("Nada a fazer.")
        return
    if a.dry_run:
        print("\n(simulação: nada foi enviado)")
        return

    # ---- conexão
    if not url or not chave:
        erro("Preencha supabase.url e supabase.anonKey em js/config.js (ou use --url e --chave).")
    email = a.email or input("E-mail do administrador: ").strip()
    senha = os.environ.get("OTICA_SENHA") or getpass.getpass("Senha (não aparece enquanto digita): ")
    sb = Supabase(url, chave, bucket)
    sb.entrar(email, senha)
    if not sb.eh_admin():
        erro("Essa conta não é de administrador (não está na tabela admins). Nada foi enviado.")
    existentes = sb.total_produtos()
    print("\nEntrou como %s. O banco já tem %d produto(s)." % (sb.email, existentes))
    if not a.sim:
        if existentes > 1 + len(estado["itens"]):
            print("ATENÇÃO: há mais produtos no banco do que o esperado; rodar de novo pode DUPLICAR modelos.")
        r = input("Cadastrar %d modelos agora? [s/N] " % len(pendentes)).strip().lower()
        if r not in ("s", "sim", "y", "yes"):
            print("Cancelado. Nada foi enviado.")
            return

    # criado_em: o 1º do arquivo fica como o mais novo (topo do site), logo abaixo do que já existe
    ref = sb.ultimo_criado_em()
    base = datetime.fromisoformat(ref.replace("Z", "+00:00")) if ref else datetime.now(timezone.utc)
    base = base - timedelta(seconds=1)

    feitos = 0
    for idx, p in enumerate(pendentes):
        pid = str(uuid.uuid4())
        fotos, enviados = [], []
        try:
            for i, g in enumerate(fotos_do_modelo(p)):
                arq = os.path.join(raiz, g["imagem"])
                ext = os.path.splitext(arq)[1].lower()
                tipo = TIPOS_IMAGEM.get(ext)
                if not tipo:
                    raise RuntimeError("formato de imagem não aceito: " + ext)
                path = "%s/%d-%d%s" % (pid, int(time.time() * 1000), i, ext)
                sb.enviar_foto(path, open(arq, "rb").read(), tipo)
                enviados.append(path)
                fotos.append({"url": sb.url_foto(path), "path": path, "w": g.get("largura") or 800, "h": g.get("altura") or 1000})
            cat = p.get("categoria") or ""
            salvo = sb.criar_produto({
                "id": pid, "nome": p["nome"], "marca": None, "modelo": None, "categoria": cat,
                "descricao": (p.get("descricao") or "").strip() or None,
                "preco": precos.get(cat), "destaque": bool(p.get("destaque")), "ativo": not a.ocultos,
                "fotos": fotos, "criado_em": (base - timedelta(seconds=idx)).isoformat(),
            })
        except Exception as e:  # não deixa foto órfã no Storage
            for path in enviados:
                sb.apagar_foto(path)
            json.dump(estado, open(estado_arq, "w", encoding="utf-8"), indent=1)
            erro("Parou no modelo %s (“%s”): %s\nO que já foi enviado ficou salvo; rode de novo para continuar." % (p["id"], p["nome"], e))
        estado["itens"][str(p["id"])] = {"id": pid, "codigo": salvo.get("codigo")}
        json.dump(estado, open(estado_arq, "w", encoding="utf-8"), indent=1)
        feitos += 1
        pr = precos.get(p.get("categoria") or "")
        print("[%3d/%d] %-9s %s · %d foto(s)%s" % (idx + 1, len(pendentes), salvo.get("codigo") or "?", p["nome"][:46], len(fotos), " · " + moeda(pr) if pr is not None else ""))

    codigos = sorted(v["codigo"] for v in estado["itens"].values() if v.get("codigo"))
    print("\nPronto! %d modelos cadastrados (%s a %s)." % (feitos, codigos[0] if codigos else "?", codigos[-1] if codigos else "?"))
    print("Próximos passos:\n  1) Abra o painel e revise nomes, marcas e PREÇOS (Produtos → Ajustar preços em massa).")
    print("  2) Em js/config.js troque catalogo.mostrarGaleria para false, para as fotos antigas não aparecerem duplicadas.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterrompido. O que já foi enviado ficou salvo; rode de novo para continuar.")
        sys.exit(130)
