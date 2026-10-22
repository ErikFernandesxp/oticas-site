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
| Pedidos dos clientes (status, anotações) e preços em massa | painel `admin.html` → abas *Pedidos* e *Produtos* |
| Área do cliente (entrar, criar conta, histórico de pedidos) | `js/conta.js` (ícone ao lado do carrinho) |
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

**Conta do cliente (opcional):** o ícone de conta ao lado do carrinho abre uma janela para entrar, criar conta e recuperar a senha.
Quem finaliza o pedido logado também o tem salvo em **Minha conta → Meus pedidos** (modelos, nome informado, data e status; os números da
receita **não** são gravados). Quem não tem conta continua comprando normalmente pelo WhatsApp, só que sem histórico. Você muda o status
(novo, confirmado, pronto, entregue, cancelado) e escreve anotações internas na aba **Pedidos** do painel. Sem `supabase.url`/`anonKey` o
ícone de conta não aparece.

**Como você cadastra óculos:** em `seusite/admin.html` (não aparece no menu). Cada óculos tem **ID automático**
(AE-0001, AE-0002…), nome, marca, modelo, categoria, preço (opcional), descrição, destaque e fotos.
Cada par precisa ser um cadastro: para separar pares que aparecem juntos numa foto, use **"Usar foto da galeria da loja"**
e recorte só um óculos. Dá para ocultar um produto sem apagar, editar e excluir.

### Configurar o Supabase (uma vez, uns 10 minutos)
1. Crie uma conta em supabase.com e um projeto (região **South America (São Paulo)**). Guarde a senha do banco.
2. **SQL Editor → New query**: cole todo o arquivo `supabase/schema.sql`, **troque `COLOQUE_SEU_EMAIL_AQUI` pelo seu e-mail** e clique *Run*.
   Depois rode também `supabase/migracao_clientes_pedidos.sql` (cria `perfis`, `pedidos` e a coluna `criado_por`; ele usa a função
   `eh_admin()` criada pelo primeiro). Guarde cópias dos dois arquivos na pasta `supabase/`.
3. **Authentication → Users → Add user → Create new user**: o mesmo e-mail + uma senha forte (marque *Auto Confirm User*).
4. Ainda em Authentication, deixe **ligada** a criação de contas ("Allow new users to sign up"): é o que permite o cliente criar conta na
   loja. A segurança do painel não depende disso: só os e-mails da tabela `admins` conseguem gravar (função `eh_admin()`). Em
   *URL Configuration*, ponha o endereço do site em *Site URL* e acrescente `http://127.0.0.1:5500/**` em *Redirect URLs* (testes locais),
   para os links de confirmação e de recuperação de senha voltarem ao lugar certo. O envio de e-mail padrão do Supabase tem limite baixo
   por hora: para vender de verdade, configure um SMTP próprio. Se aparecerem contas falsas, ligue o CAPTCHA.
5. **Project Settings → API**: copie a **Project URL** e a chave pública (**anon** ou **publishable**) para `js/config.js`
   (`supabase.url` e `supabase.anonKey`). Essa chave é feita para ficar no site; **nunca** use a chave `service_role`/*secret*.
6. Publique o site e abra `/admin.html`. Entre com o e-mail e a senha do passo 3.

Segurança: quem não é o administrador só consegue *ler* produtos ativos (regras RLS do `schema.sql`); gravar, enviar ou apagar
fotos exige estar logado com o e-mail da tabela `admins`. Cada cliente só enxerga o próprio perfil e os próprios pedidos; só o administrador vê todos. Os nomes dos menus do Supabase mudam de vez em quando.

Enquanto `supabase.url` estiver vazio, o site funciona só com `js/catalogo.js`. As fotos antigas do Instagram (vários óculos por foto)
aparecem como **"Foto da loja"** (botão *Perguntar*, sem carrinho). Quando a loja estiver cadastrada, esconda-as com
`catalogo.mostrarGaleria: false` no `js/config.js`.

## Painel: pedidos e preços
- **Pedidos:** lista todos os pedidos de clientes logados, com filtro por status, busca por número, nome ou telefone, link para chamar o
  cliente no WhatsApp, total dos itens (sem as lentes) e anotação interna que só você vê.
- **Preços em massa:** em *Produtos → Ajustar preços em massa*, escolha a categoria e o novo preço. Vale para todos os produtos dela,
  inclusive os cadastrados à mão. Cada óculos continua editável individualmente.
- O painel só abre para quem está na tabela `admins`: uma conta de cliente logada vê "Sem acesso".

## Passar o catálogo do arquivo para o banco
Para que os modelos de `js/catalogo.js` (importados do Instagram) virem produtos editáveis no painel, com código AE-xxxx, fotos no
Storage e preço inicial por categoria:

```
python tools/migrar_catalogo_supabase.py --dry-run
python tools/migrar_catalogo_supabase.py --email SEU@EMAIL
```

O primeiro só mostra o plano. O segundo pede a senha do administrador (não é gravada) e cadastra tudo. Só usa a biblioteca padrão do
Python. Pode rodar de novo sem duplicar: o progresso fica em `tools/migracao_estado.json`. Preços iniciais: `--preco-grau`, `--preco-sol`,
`--preco-clipon` (são estimativas: revise antes de publicar). `--ocultos` cadastra tudo escondido no site. Depois da migração, ponha
`catalogo.mostrarGaleria: false` no `js/config.js`; o `catalogo.js` continua sendo usado pelo painel para recortar fotos da galeria.

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
- Revise os **preços** dos produtos no painel: o preço exibido no site funciona como oferta ao cliente.
- No Supabase, confira *Site URL* e *Redirect URLs* com o endereço publicado, e o e-mail (SMTP próprio se for vender de verdade).
- Atualize a `privacidade.html` com os dados reais (ela já cobre conta e histórico de pedidos, mas ainda tem os colchetes do modelo).