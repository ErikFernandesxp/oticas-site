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

  /* RASTREAMENTO (opcional): cole o ID do Google Analytics (G-XXXX) e/ou do
     Meta Pixel. Em branco ("") não carrega nada — é o padrão. */
  analytics: {
    googleAnalyticsId: "",
    metaPixelId: "",
  },
};
