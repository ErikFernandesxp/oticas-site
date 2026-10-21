/* ==========================================================================
   CONFIGURAÇÃO DO SITE — é aqui que você troca os dados da ótica.
   Nada precisa ser editado no HTML para mudar nome, WhatsApp, redes
   sociais, endereço ou logo. O main.js lê este arquivo e atualiza o site.

   Para reaproveitar a estrutura para OUTRA ótica:
     1) troque "marca.nome" (o site troca o nome em todos os textos, no
        título da aba, nas mensagens de WhatsApp e no Google/SEO);
     2) troque os arquivos de logo em img/Logo/ (mesmos nomes) ou aponte
        os caminhos abaixo para arquivos novos;
     3) preencha contato e redes sociais;
     4) cores e fontes: edite as variáveis do topo do css/style.css;
     5) produtos: edite js/catalogo.js (ou importe as fotos do Instagram com
        tools/importar_instagram.py — veja o README).
   ========================================================================== */
window.OTICA_CONFIG = {
  marca: {
    nome: "Óticas Alto Estilo",
    slogan: "Seu estilo com mais visão e qualidade.",
    logo: "img/Logo/logo.webp",
    favicon: "img/Logo/favicon.png",
    imagemCompartilhar: "img/Logo/logo-og.jpg",
    /* Endereço do site (ex.: "https://www.suaotica.com.br"), sem barra no
       final. Quando preenchido, liga o link canônico e a imagem de
       compartilhamento. Lembre de atualizar também o sitemap.xml. */
    dominio: "",
  },

  contato: {
    /* DDI + DDD + número, só dígitos (usado em todos os links do WhatsApp) */
    whatsapp: "5571981207331",
    /* Como o número aparece escrito no site */
    whatsappExibicao: "(71) 98120-7331",
    cidade: "Salvador - BA",
    /* Deixe "" para não mostrar. Quando preenchidos, aparecem no rodapé e
       na página Fale Conosco, e entram nos dados do Google (SEO local). */
    endereco: "",
    horario: "",
    /* Link do Google Maps. Se vazio e houver endereço, o link é montado
       automaticamente a partir do endereço. */
    mapaUrl: "",
    email: "",
  },

  /* Deixe "" para esconder o ícone */
  redesSociais: {
    instagram: "https://www.instagram.com/oticasaltoestilo",
    facebook: "",
  },

  /* Mensagem padrão do WhatsApp quando o botão não define uma própria
     ({nome} vira o nome da ótica automaticamente) */
  mensagemPadrao: "Olá! Vim pelo site da {nome} e gostaria de atendimento.",

  /* LOJA — carrinho e painel de administração (passo a passo no README).
     url / anonKey: em Supabase → Project Settings → API (URL do projeto e a
     chave pública "publishable" ou "anon"; ela é feita para ficar no site).
     Em branco ("") o site usa só os produtos do arquivo js/catalogo.js.
     mostrarGaleria: false esconde as fotos antigas do Instagram (modelos com
     vários óculos na mesma foto) quando a loja já tiver produtos cadastrados. */
  supabase: {
    url: "https://nzlslpcbmpgjnsscjnnc.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bHNscGNibXBnam5zc2Nqbm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwOTM3OTgsImV4cCI6MjEwNzY2OTc5OH0.0IlvOC8-i8NpyszEui8KGY995mKHXlFi0fRvdQGyHwk",
    bucket: "produtos",
  },
  catalogo: {
    mostrarGaleria: true,
  },

  /* RASTREAMENTO (opcional): cole o ID do Google Analytics (G-XXXX) e/ou do
     Meta Pixel. Em branco ("") não carrega nada — é o padrão. */
  analytics: {
    googleAnalyticsId: "",
    metaPixelId: "",
  },
};
