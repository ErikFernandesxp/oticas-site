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
| Produtos (loja) | painel `admin.html` (Supabase) |
| Fotos antigas do Instagram e categorias | `js/catalogo.js` |
| Cores, fontes, formato das fotos (quadrado ou retrato) | topo do `css/style.css` |
| Textos das seções | o HTML da página |

O nome da ótica e a cidade escritos no HTML (títulos, descrições, mensagens de
WhatsApp, textos) são trocados automaticamente pelos valores do `config.js`.

## Loja: carrinho, receita e painel do administrador

**Como o cliente compra:** escolhe os óculos na coleção → *Adicionar* → no carrinho, para **cada óculos**,
marca "só a armação", "armação + lentes (tenho a receita)" (OD/OE: esférico, cilíndrico, eixo, adição, DNP, tipo de lente)
ou "vou enviar a foto da receita" → informa o nome → *Finalizar pelo WhatsApp*. O site confere a receita
(passos de 0,25, eixo de 0 a 180 e obrigatório quando há cilíndrico) e abre o WhatsApp com o pedido organizado
(nome do modelo, **ID**, marca, modelo e receita de cada item). Não há pagamento no site. Limite: 10 óculos por pedido.

**Como você cadastra óculos:** em `seusite/admin.html` (não aparece no menu). Cada óculos tem **ID automático**
(AE-0001, AE-0002…), nome, marca, modelo, categoria, preço (opcional), descrição, destaque e fotos.
Cada par precisa ser um cadastro: para separar pares que aparecem juntos numa foto, use **"Usar foto da galeria da loja"**
e recorte só um óculos. Dá para ocultar um produto sem apagar, editar e excluir.

### Configurar o Supabase (uma vez, uns 10 minutos)
1. Crie uma conta em supabase.com e um projeto (região **South America (São Paulo)**). Guarde a senha do banco.
2. **SQL Editor → New query**: cole todo o arquivo `supabase/schema.sql`, **troque `COLOQUE_SEU_EMAIL_AQUI` pelo seu e-mail** e clique *Run*.
3. **Authentication → Users → Add user → Create new user**: o mesmo e-mail + uma senha forte (marque *Auto Confirm User*).
4. Ainda em Authentication, **desligue a criação de contas** ("Allow new users to sign up"): clientes não precisam de conta.
5. **Project Settings → API**: copie a **Project URL** e a chave pública (**anon** ou **publishable**) para `js/config.js`
   (`supabase.url` e `supabase.anonKey`). Essa chave é feita para ficar no site; **nunca** use a chave `service_role`/*secret*.
6. Publique o site e abra `/admin.html`. Entre com o e-mail e a senha do passo 3.

Segurança: quem não é o administrador só consegue *ler* produtos ativos (regras RLS do `schema.sql`); gravar, enviar ou apagar
fotos exige estar logado com o e-mail da tabela `admins`. Os nomes dos menus do Supabase mudam de vez em quando.

Enquanto `supabase.url` estiver vazio, o site funciona só com `js/catalogo.js`. As fotos antigas do Instagram (vários óculos por foto)
aparecem como **"Foto da loja"** (botão *Perguntar*, sem carrinho). Quando a loja estiver cadastrada, esconda-as com
`catalogo.mostrarGaleria: false` no `js/config.js`.

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
