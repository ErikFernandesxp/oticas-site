# Óticas Alto Estilo — site

Site estático (HTML, CSS e JavaScript puro, sem build). Basta publicar a pasta.

## Páginas
`index.html` (início) · `colecao.html` (catálogo com filtros e busca) · `contato.html` (orçamento) · `privacidade.html`

## Onde mudar cada coisa
| O que | Onde |
|---|---|
| Nome da ótica, slogan, logo, favicon, domínio | `js/config.js` → `marca` |
| WhatsApp, cidade, endereço, horário, mapa, e-mail | `js/config.js` → `contato` |
| Instagram / Facebook (vazio = esconde) | `js/config.js` → `redesSociais` |
| Google Analytics / Meta Pixel (vazio = não carrega) | `js/config.js` → `analytics` |
| Produtos, categorias e galerias de fotos | `js/catalogo.js` |
| Cores, fontes, formato das fotos (quadrado ou retrato) | topo do `css/style.css` |
| Textos das seções | o HTML da página |

O nome da ótica e a cidade escritos no HTML (títulos, descrições, mensagens de
WhatsApp, textos) são trocados automaticamente pelos valores do `config.js`.

## Trazer as fotos do Instagram para o catálogo
O jeito oficial e seguro é o **export de dados do próprio Instagram** (quem tem o login da conta faz isso;
não precisa dar senha a ninguém e não usa nenhuma API):

1. No app do Instagram da ótica: **menu ☰ → Central de Contas → Suas informações e permissões →
   Exportar suas informações → Criar exportação → Exportar para o dispositivo** (os nomes mudam de vez em quando).
   Não escolha Google Drive/Dropbox: eles mandam *todas* as informações, inclusive mensagens.
2. Em "personalizar informações", toque em **Limpar tudo** em cada seção e marque só **Mídia**
   (confira que "Mensagens" ficou desmarcado). Período: todo o período. Formato: **JSON**. Qualidade: alta.
3. O Instagram avisa por e-mail quando o `.zip` estiver pronto. Baixe (de preferência pelo computador).
4. Na pasta do site, rode (precisa de Python 3 e `pip install pillow pillow-heif`):

```
python3 tools/importar_instagram.py CAMINHO/instagram-export.zip --substituir
```

O que a ferramenta faz: lê as **publicações** (ignora stories, reels e reposts), junta os dois arquivos
de publicações do export sem duplicar, descarta a "capa" repetida de cada carrossel, converte as fotos
(inclusive `.heic` do iPhone) para WebP leve e grava tudo em `js/catalogo.js` e `img/catalogo/`.
**Cada post vira um modelo, e as fotos do carrossel viram a galeria dele.**

Atenção: quando os posts não têm legenda (como no export da ótica), os modelos saem como "Modelo 1, 2, 3…"
e **sem categoria**. Abra `js/catalogo.js` e preencha `nome` e `categoria` de cada um. Modelos sem categoria só
aparecem em "Todos". Para trazer posts novos depois, peça outro export e rode **sem** `--substituir`
(ele ignora o que já foi importado).

Opções: `--carrossel galeria|primeira|todas` · `--max 60` · `--destaques 8` · `--categoria sol` · `--tamanho 960` · `--dry-run`.

Quer o feed atualizando sozinho, sem exportar de tempos em tempos? Isso exige a API oficial da Meta
(conta profissional + app + token, com uma função no servidor para guardar o token) ou um serviço
de terceiros. Para um catálogo com nomes e categorias, o export acima costuma ser mais prático.

## Reaproveitar para outra ótica
1. Edite `js/config.js` (marca, contato, redes) e troque as imagens de `img/Logo/` (mesmos nomes).
2. Importe as fotos da outra conta (acima) ou edite `js/catalogo.js`.
3. Ajuste as cores no topo do `css/style.css` e revise os textos das páginas.
4. Preencha a política de privacidade e o `sitemap.xml`.

## Antes de publicar
- `sitemap.xml` e `robots.txt`: troque `SEU-DOMINIO.com.br` pelo domínio real.
- `js/config.js`: preencha `marca.dominio` (liga o link canônico e a imagem de compartilhamento).
- `privacidade.html` é um **modelo**: preencha os colchetes e peça revisão jurídica
  (foto de receita enviada pelo WhatsApp é dado de saúde na LGPD).
- A foto de destaque do início e as fotos da seção "A loja" são **de banco de imagens**: troque por fotos reais da loja.
