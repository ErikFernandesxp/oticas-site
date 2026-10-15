/* ==========================================================================
   main.js — comportamento do site.
   Dados da ótica (nome, WhatsApp, redes, endereço): js/config.js
   Produtos e categorias: js/catalogo.js
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.OTICA_CONFIG || {};
  var MARCA = CFG.marca || {};
  var CONTATO = CFG.contato || {};
  var PRODUTOS = window.OTICA_CATALOGO || [];
  var CATEGORIAS = window.OTICA_CATEGORIAS || [];
  var POR_PAGINA = 24;

  // nome e cidade escritos no HTML (trocados pelos valores do config.js)
  var NOME_ORIGINAL = "Óticas Alto Estilo";
  var CIDADE_ORIGINAL = "Salvador - BA";
  var CIDADE_NOME_ORIGINAL = "Salvador";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function get(path) { return String(path).split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, CFG); }
  function digits(s) { return String(s || "").replace(/\D/g, ""); }
  function nome() { return MARCA.nome || NOME_ORIGINAL; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

  /* ---------- WhatsApp ---------- */
  function waUrl(msg) {
    var texto = (msg || CFG.mensagemPadrao || "").replace(/\{nome\}/g, nome());
    return "https://wa.me/" + digits(CONTATO.whatsapp) + "?text=" + encodeURIComponent(texto);
  }
  function openWhatsApp(url) {
    var w = window.open(url, "_blank");
    if (w) { try { w.opener = null; } catch (e) {} } else { window.location.href = url; }
  }
  var ICO_WA = '<svg class="ico ico--fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.8 11.8 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413"/></svg>';

  /* ---------- Tema claro/escuro (a classe inicial é aplicada no <head>) ---------- */
  var root = document.documentElement;
  var themeBtns = $$(".theme-toggle");
  function syncTheme() {
    var dark = root.classList.contains("dark");
    themeBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", dark ? "true" : "false");
      if (b.classList.contains("theme-toggle--menu")) {
        b.textContent = dark ? "Usar modo claro" : "Usar modo escuro";
      } else {
        b.setAttribute("aria-label", dark ? "Desativar modo escuro" : "Ativar modo escuro");
      }
    });
    var tc = $('meta[name="theme-color"]');
    if (tc) tc.setAttribute("content", dark ? "#0b121c" : "#f6f3ee");
  }
  themeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      root.classList.toggle("dark");
      try { localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light"); } catch (e) {}
      syncTheme();
    });
  });
  syncTheme();

  /* ---------- Menu mobile ---------- */
  var menuBtn = $("#menuToggle");
  var nav = $("#siteNav");
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    if (window.matchMedia) {
      var mq = window.matchMedia("(min-width: 961px)");
      var onChange = function (ev) { if (ev.matches) setMenu(false); };
      if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* ---------- Sombra do cabeçalho ao rolar ---------- */
  var header = $("#header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Nome da marca e cidade (troca o que está escrito no HTML pelo do config.js) ---------- */
  function aplicarMarca() {
    var novoNome = nome();
    var cidadeCfg = String(CONTATO.cidade || "");
    var cidadeNomeCfg = cidadeCfg.split(/\s*-\s*/)[0];
    var trocaNome = novoNome !== NOME_ORIGINAL;
    var trocaCidade = cidadeCfg && cidadeCfg !== CIDADE_ORIGINAL;
    if (!trocaNome && !trocaCidade) return;
    function trocar(t) {
      if (trocaNome) t = t.split(NOME_ORIGINAL).join(novoNome);
      if (trocaCidade) t = t.split(CIDADE_ORIGINAL).join(cidadeCfg).split(CIDADE_NOME_ORIGINAL).join(cidadeNomeCfg);
      return t;
    }
    function tem(t) {
      return (trocaNome && t.indexOf(NOME_ORIGINAL) !== -1) || (trocaCidade && t.indexOf(CIDADE_NOME_ORIGINAL) !== -1);
    }
    document.title = trocar(document.title);
    $$('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]').forEach(function (m) {
      var v = m.getAttribute("content");
      if (v && tem(v)) m.setAttribute("content", trocar(v));
    });
    ["alt", "aria-label", "title", "data-wa-msg", "placeholder", "data-intro"].forEach(function (attr) {
      $$("[" + attr + "]").forEach(function (el) {
        var v = el.getAttribute(attr);
        if (v && tem(v)) el.setAttribute(attr, trocar(v));
      });
    });
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var tag = node.parentNode && node.parentNode.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA") continue;
      if (tem(node.nodeValue)) node.nodeValue = trocar(node.nodeValue);
    }
  }

  /* ---------- Dados do config.js nos elementos da página ---------- */
  function aplicarDados() {
    $$("[data-text]").forEach(function (el) {
      var v = get(el.getAttribute("data-text"));
      if (v) el.textContent = v;
    });
    $$("[data-if]").forEach(function (el) { el.hidden = !get(el.getAttribute("data-if")); });
    $$("[data-href]").forEach(function (el) {
      var v = get(el.getAttribute("data-href"));
      if (v) { el.href = v; el.hidden = false; } else { el.hidden = true; }
    });
    $$("[data-wa]").forEach(function (el) { el.href = waUrl(el.getAttribute("data-wa-msg")); });

    var mapa = CONTATO.mapaUrl ||
      (CONTATO.endereco ? "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(CONTATO.endereco + " " + (CONTATO.cidade || "")) : "");
    $$("[data-map]").forEach(function (el) { if (mapa) { el.href = mapa; el.hidden = false; } else { el.hidden = true; } });

    var insta = String(get("redesSociais.instagram") || "").replace(/\/+$/, "").split("/").pop();
    $$("[data-insta-handle]").forEach(function (el) { if (insta) el.textContent = "@" + insta; });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    $$("[data-slogan]").forEach(function (el) { if (MARCA.slogan) el.textContent = MARCA.slogan; });
    $$("[data-logo]").forEach(function (el) { if (MARCA.logo) el.setAttribute("src", MARCA.logo); });
    var fav = $('link[rel="icon"]');
    if (fav && MARCA.favicon) fav.setAttribute("href", MARCA.favicon);
  }

  /* ---------- SEO: canonical, compartilhamento e dados do negócio (Google) ---------- */
  function aplicarSeo() {
    var dominio = (MARCA.dominio || "").replace(/\/+$/, "");
    if (dominio) {
      var arquivo = location.pathname.split("/").pop();
      var caminho = (!arquivo || arquivo === "index.html") ? "/" : "/" + arquivo;
      var url = dominio + caminho;
      var can = $('link[rel="canonical"]');
      if (!can) { can = document.createElement("link"); can.rel = "canonical"; document.head.appendChild(can); }
      can.href = url;
      var setMeta = function (attr, key, val) {
        var m = $('meta[' + attr + '="' + key + '"]');
        if (!m) { m = document.createElement("meta"); m.setAttribute(attr, key); document.head.appendChild(m); }
        m.setAttribute("content", val);
      };
      setMeta("property", "og:url", url);
      if (MARCA.imagemCompartilhar) {
        var img = dominio + "/" + MARCA.imagemCompartilhar.replace(/^\//, "");
        setMeta("property", "og:image", img);
        setMeta("name", "twitter:image", img);
      }
    }
    if (document.body.getAttribute("data-page") !== "inicio") return;
    var partes = String(CONTATO.cidade || "").split(/\s*-\s*/);
    var endereco = { "@type": "PostalAddress", addressCountry: "BR" };
    if (CONTATO.endereco) endereco.streetAddress = CONTATO.endereco;
    if (partes[0]) endereco.addressLocality = partes[0];
    if (partes[1]) endereco.addressRegion = partes[1];
    var redes = [get("redesSociais.instagram"), get("redesSociais.facebook")].filter(Boolean);
    var dados = {
      "@context": "https://schema.org",
      "@type": "Optician",
      name: nome(),
      description: MARCA.slogan || undefined,
      url: dominio || undefined,
      image: dominio && MARCA.imagemCompartilhar ? dominio + "/" + MARCA.imagemCompartilhar.replace(/^\//, "") : undefined,
      telephone: digits(CONTATO.whatsapp) ? "+" + digits(CONTATO.whatsapp) : undefined,
      email: CONTATO.email || undefined,
      address: endereco,
      sameAs: redes.length ? redes : undefined
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(dados);
    document.head.appendChild(s);
  }

  /* ---------- Rastreamento (só carrega se houver ID no config.js) ---------- */
  function carregarAnalytics() {
    var a = CFG.analytics || {};
    if (a.googleAnalyticsId) {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(a.googleAnalyticsId);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", a.googleAnalyticsId);
    }
    if (a.metaPixelId) {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n;
        n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = true; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", a.metaPixelId);
      window.fbq("track", "PageView");
    }
  }

  /* ---------- Formulários → WhatsApp ---------- */
  function setupForms() {
    $$("form[data-wa-form]").forEach(function (form) {
      var status = $(".form-status", form);
      function say(msg, ok) {
        if (!status) return;
        status.textContent = msg;
        status.className = "form-status " + (ok ? "is-ok" : "is-error");
      }
      var select = $('select[name="produto"]', form);
      var pedido = new URLSearchParams(window.location.search).get("produto");
      if (select && pedido) {
        $$("option", select).forEach(function (op) {
          if (op.value.toLowerCase() === pedido.toLowerCase()) select.value = op.value;
        });
      }
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var campos = $$("[name]", form);
        var faltando = campos.filter(function (c) { return c.required && !String(c.value).trim(); });
        if (faltando.length) {
          say("Preencha: " + faltando.map(function (c) { return c.getAttribute("data-label") || c.name; }).join(", ") + ".", false);
          faltando[0].focus();
          return;
        }
        var tel = $('input[type="tel"]', form);
        if (tel && digits(tel.value).length < 10) {
          say("Confira o WhatsApp: informe o DDD e o número.", false);
          tel.focus();
          return;
        }
        var linhas = [(form.getAttribute("data-intro") || "Olá! Vim pelo site da {nome}.").replace(/\{nome\}/g, nome())];
        campos.forEach(function (c) {
          var v = String(c.value).trim();
          if (v) linhas.push("*" + (c.getAttribute("data-label") || c.name) + ":* " + v);
        });
        say("Abrindo o WhatsApp… se não abrir, toque em Enviar de novo.", true);
        openWhatsApp(waUrl(linhas.join("\n")));
      });
    });
  }

  /* ==========================================================================
     Catálogo
     ========================================================================== */
  function catNome(id) {
    for (var i = 0; i < CATEGORIAS.length; i++) if (CATEGORIAS[i].id === id) return CATEGORIAS[i].nome;
    return "";
  }
  function categoriasComItens() {
    return CATEGORIAS.filter(function (c) { return PRODUTOS.some(function (p) { return p.categoria === c.id; }); });
  }
  function porId(id) {
    for (var i = 0; i < PRODUTOS.length; i++) if (String(PRODUTOS[i].id) === String(id)) return PRODUTOS[i];
    return null;
  }
  function msgProduto(p) {
    return "Olá! Tenho interesse neste modelo da {nome}: " + p.nome + " (ref. " + p.id + "). Pode me passar mais informações?";
  }
  function imgTag(p, extra) {
    return '<img src="' + esc(p.imagem) + '" alt="' + esc(p.alt || p.nome) + '" width="' + (p.largura || 800) +
      '" height="' + (p.altura || 800) + '" loading="lazy" decoding="async"' + (extra || "") + ">";
  }
  function fotosDe(p) {
    return (p.galeria && p.galeria.length) ? p.galeria : [{ imagem: p.imagem, largura: p.largura, altura: p.altura }];
  }
  var ICO_FOTOS = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 16-5-5-8 8"/></svg>';
  function cardProduto(p) {
    var cat = catNome(p.categoria);
    var n = fotosDe(p).length;
    return '<article class="product">' +
      '<button type="button" class="product__media" data-abrir="' + esc(p.id) + '" aria-label="Ver detalhes: ' + esc(p.nome) + (n > 1 ? " (" + n + " fotos)" : "") + '">' + imgTag(p) +
      (n > 1 ? '<span class="product__badge" aria-hidden="true">' + ICO_FOTOS + n + "</span>" : "") + "</button>" +
      '<div class="product__body">' +
        (cat ? '<span class="product__tag">' + esc(cat) + "</span>" : "") +
        '<h3 class="product__name">' + esc(p.nome) + "</h3>" +
        '<div class="product__cta"><a class="btn btn--primary btn--sm" href="' + waUrl(msgProduto(p)) +
        '" target="_blank" rel="noopener">' + ICO_WA + "Tenho interesse</a></div>" +
      "</div></article>";
  }

  var modal = null, galeriaAtual = [], fotoIdx = 0, produtoAtual = null;
  var SETA_E = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';
  var SETA_D = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
  function fecharModal() { if (modal.close) modal.close(); else modal.removeAttribute("open"); }
  function mostrarFoto(i) {
    var n = galeriaAtual.length;
    fotoIdx = (i + n) % n;
    var f = galeriaAtual[fotoIdx], p = produtoAtual;
    var img = $("#pm-img", modal);
    img.src = f.imagem;
    img.alt = (p.alt || p.nome) + (n > 1 ? " — foto " + (fotoIdx + 1) + " de " + n : "");
    if (f.largura) img.width = f.largura;
    if (f.altura) img.height = f.altura;
    $("#pm-count", modal).textContent = n > 1 ? (fotoIdx + 1) + " / " + n : "";
    $$("#pm-thumbs button", modal).forEach(function (b, k) {
      b.setAttribute("aria-current", k === fotoIdx ? "true" : "false");
      if (k === fotoIdx && b.scrollIntoView) b.scrollIntoView({ block: "nearest", inline: "center" });
    });
  }
  function abrirProduto(p, opener) {
    if (!p) return;
    if (!modal) {
      modal = document.createElement("dialog");
      modal.className = "modal";
      modal.setAttribute("aria-labelledby", "pm-titulo");
      modal.innerHTML =
        '<button type="button" class="modal__close" aria-label="Fechar" autofocus>' +
        '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '<div class="modal__grid"><div class="modal__img"><div class="modal__stage"><img id="pm-img" alt="">' +
        '<button type="button" class="modal__nav modal__nav--prev" id="pm-prev" aria-label="Foto anterior">' + SETA_E + "</button>" +
        '<button type="button" class="modal__nav modal__nav--next" id="pm-next" aria-label="Próxima foto">' + SETA_D + "</button>" +
        '<span class="modal__count" id="pm-count" aria-live="polite"></span></div>' +
        '<div class="modal__thumbs" id="pm-thumbs" role="group" aria-label="Fotos do modelo"></div></div>' +
        '<div class="modal__body"><span class="product__tag" id="pm-tag"></span><h2 id="pm-titulo"></h2>' +
        '<p class="modal__desc" id="pm-desc"></p><div class="modal__actions" id="pm-acoes"></div></div></div>';
      document.body.appendChild(modal);
      $(".modal__close", modal).addEventListener("click", fecharModal);
      modal.addEventListener("click", function (e) { if (e.target === modal) fecharModal(); });
      modal.addEventListener("close", function () { document.body.classList.remove("no-scroll"); });
      $("#pm-prev", modal).addEventListener("click", function () { mostrarFoto(fotoIdx - 1); });
      $("#pm-next", modal).addEventListener("click", function () { mostrarFoto(fotoIdx + 1); });
      $("#pm-thumbs", modal).addEventListener("click", function (e) {
        var b = e.target.closest("button[data-i]");
        if (b) mostrarFoto(parseInt(b.getAttribute("data-i"), 10));
      });
      modal.addEventListener("keydown", function (e) {
        if (galeriaAtual.length < 2) return;
        if (e.key === "ArrowLeft") { e.preventDefault(); mostrarFoto(fotoIdx - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); mostrarFoto(fotoIdx + 1); }
      });
      var x0 = null, stage = $(".modal__stage", modal);
      stage.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener("touchend", function (e) {
        if (x0 === null || galeriaAtual.length < 2) return;
        var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) mostrarFoto(fotoIdx + (dx < 0 ? 1 : -1));
      });
    }
    produtoAtual = p;
    galeriaAtual = fotosDe(p);
    var varias = galeriaAtual.length > 1;
    $("#pm-prev", modal).hidden = !varias;
    $("#pm-next", modal).hidden = !varias;
    $("#pm-count", modal).hidden = !varias;
    var thumbs = $("#pm-thumbs", modal);
    thumbs.hidden = !varias;
    thumbs.innerHTML = varias ? galeriaAtual.map(function (f, k) {
      return '<button type="button" data-i="' + k + '" aria-label="Ver foto ' + (k + 1) + '"><img src="' + esc(f.imagem) + '" alt="" width="56" height="56" loading="lazy" decoding="async"></button>';
    }).join("") : "";
    mostrarFoto(0);
    $("#pm-tag", modal).textContent = catNome(p.categoria);
    $("#pm-tag", modal).hidden = !catNome(p.categoria);
    $("#pm-titulo", modal).textContent = p.nome;
    var desc = $("#pm-desc", modal);
    desc.textContent = p.descricao || "";
    desc.hidden = !p.descricao;
    $("#pm-acoes", modal).innerHTML = '<a class="btn btn--wa" href="' + waUrl(msgProduto(p)) + '" target="_blank" rel="noopener">' + ICO_WA + "Tenho interesse</a>" +
      (p.instagram ? '<a class="btn btn--ghost" href="' + esc(p.instagram) + '" target="_blank" rel="noopener">Ver no Instagram</a>' : "");
    document.body.classList.add("no-scroll");
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }
  function bindAbrir(container) {
    container.addEventListener("click", function (e) {
      var b = e.target.closest("[data-abrir]");
      if (b) abrirProduto(porId(b.getAttribute("data-abrir")), b);
    });
  }

  function renderCategorias(el) {
    var cats = categoriasComItens();
    el.innerHTML = cats.map(function (c) {
      var capa = PRODUTOS.filter(function (p) { return p.categoria === c.id; })[0];
      var n = PRODUTOS.filter(function (p) { return p.categoria === c.id; }).length;
      return '<a class="cat" href="colecao.html?cat=' + encodeURIComponent(c.id) + '">' +
        '<img src="' + esc(c.capa || capa.imagem) + '" alt="" width="' + (capa.largura || 800) + '" height="' + (capa.altura || 800) + '" loading="lazy">' +
        '<span class="cat__body"><span class="cat__name">' + esc(c.nome) + '</span> <span class="cat__n">' + n + (n === 1 ? " modelo" : " modelos") + "</span></span></a>";
    }).join("");
    el.closest("section").hidden = !cats.length;
  }
  function renderDestaques(el) {
    var lista = PRODUTOS.filter(function (p) { return p.destaque; });
    if (!lista.length) lista = PRODUTOS;
    lista = lista.slice(0, 8);
    el.innerHTML = lista.map(cardProduto).join("");
    bindAbrir(el);
    el.closest("section").hidden = !lista.length;
  }
  function renderInstagram(el) {
    var perfil = get("redesSociais.instagram");
    var lista = PRODUTOS.slice(0, 6);
    el.innerHTML = lista.map(function (p) {
      return '<a href="' + esc(p.instagram || perfil) + '" target="_blank" rel="noopener" aria-label="Ver no Instagram: ' + esc(p.nome) + '">' + imgTag(p) + "</a>";
    }).join("");
    el.closest("section").hidden = !lista.length || !perfil;
  }

  function setupColecao() {
    var grid = $("#produtos");
    if (!grid) return;
    var chipsEl = $("#filtros"), busca = $("#busca"), contagem = $("#contagem"), mais = $("#maisBtn"), vazio = $("#vazio");
    var params = new URLSearchParams(window.location.search);
    var estado = { cat: params.get("cat") || "", q: params.get("q") || "", n: POR_PAGINA };
    var cats = categoriasComItens();
    if (!cats.some(function (c) { return c.id === estado.cat; })) estado.cat = "";
    if (busca) busca.value = estado.q;

    function chips() {
      var itens = [{ id: "", nome: "Todos", n: PRODUTOS.length }].concat(cats.map(function (c) {
        return { id: c.id, nome: c.nome, n: PRODUTOS.filter(function (p) { return p.categoria === c.id; }).length };
      }));
      chipsEl.innerHTML = itens.map(function (i) {
        return '<button type="button" class="chip" data-cat="' + esc(i.id) + '" aria-pressed="' + (estado.cat === i.id) + '">' + esc(i.nome) + " (" + i.n + ")</button>";
      }).join("");
    }
    function variantes(t) {
      var v = [t];
      if (t.length > 3 && /s$/.test(t)) v.push(t.slice(0, -1));
      if (/ao$/.test(t)) v.push(t.slice(0, -2) + "oes", t.slice(0, -2) + "aes", t.slice(0, -2) + "aos");
      if (/(oes|aes|aos)$/.test(t)) v.push(t.slice(0, -3) + "ao");
      return v;
    }
    function filtrados() {
      var tokens = norm(estado.q).split(/\s+/).filter(Boolean);
      return PRODUTOS.filter(function (p) {
        if (estado.cat && p.categoria !== estado.cat) return false;
        if (!tokens.length) return true;
        var texto = norm([p.nome, p.descricao, catNome(p.categoria), p.id].join(" "));
        return tokens.every(function (tk) { return variantes(tk).some(function (x) { return texto.indexOf(x) !== -1; }); });
      });
    }
    function render() {
      var lista = filtrados();
      var mostrar = lista.slice(0, estado.n);
      grid.innerHTML = mostrar.map(cardProduto).join("");
      vazio.hidden = lista.length > 0;
      grid.hidden = !lista.length;
      contagem.textContent = lista.length
        ? "Mostrando " + mostrar.length + " de " + lista.length + (lista.length === 1 ? " modelo" : " modelos")
        : "";
      mais.hidden = mostrar.length >= lista.length;
      $$("[data-cat]", chipsEl).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === estado.cat)); });
      try {
        var u = new URLSearchParams();
        if (estado.cat) u.set("cat", estado.cat);
        if (estado.q) u.set("q", estado.q);
        history.replaceState(null, "", location.pathname + (u.toString() ? "?" + u.toString() : ""));
      } catch (e) {}
    }
    chipsEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (!b) return;
      estado.cat = b.getAttribute("data-cat"); estado.n = POR_PAGINA; render();
    });
    if (busca) busca.addEventListener("input", function () { estado.q = busca.value; estado.n = POR_PAGINA; render(); });
    mais.addEventListener("click", function () { estado.n += POR_PAGINA; render(); });
    bindAbrir(grid);
    chips();
    render();
  }

  function setupCatalogo() {
    var c = $('[data-render="categorias"]'); if (c) renderCategorias(c);
    var d = $('[data-render="destaques"]'); if (d) renderDestaques(d);
    var i = $('[data-render="instagram"]'); if (i) renderInstagram(i);
    setupColecao();
  }

  /* ---------- Início ---------- */
  function init() {
    aplicarMarca();
    aplicarDados();
    setupCatalogo();
    aplicarSeo();
    carregarAnalytics();
    setupForms();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
