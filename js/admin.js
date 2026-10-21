/* ==========================================================================
   admin.js — painel do administrador (admin.html).
   Login pelo Supabase Auth; produtos e fotos no Supabase (veja o README).
   A segurança está no servidor (regras RLS do supabase/schema.sql): mesmo
   que alguém abra esta página, só o e-mail da tabela "admins" consegue gravar.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.OTICA_CONFIG || {};
  var SB = window.SB;
  var CATS = window.OTICA_CATEGORIAS || [];
  var GALERIA = (window.OTICA_CATALOGO || []).filter(function (p) { return p.tipo === "galeria"; });
  var MAX_FOTOS = 10, LADO_MAX = 1100;

  var root = document.getElementById("admRoot");
  var btnSair = document.getElementById("admSair");
  var estado = { produtos: [], aba: "lista", editando: null, fotos: [], apagar: [], busca: "", ocupado: false };

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function catNome(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i].nome; return id || ""; }
  function moeda(v) { return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16);
    });
  }
  function aviso(msg, ok) {
    var el = $("#admMsg");
    if (!el) return;
    el.textContent = msg || "";
    el.className = "form-status" + (msg ? (ok ? " is-ok" : " is-error") : "");
    if (msg && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
  }
  function parsePreco(txt) {
    var t = String(txt || "").replace(/[R$\s]/g, "");
    if (!t) return null;
    t = t.indexOf(",") !== -1 ? t.replace(/\./g, "").replace(",", ".") : t;
    var n = Number(t);
    return isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : NaN;
  }
  function fmtPreco(v) { return v == null ? "" : Number(v).toFixed(2).replace(".", ","); }

  /* ---------- fotos: redimensionar e recortar ---------- */
  function carregarImagem(src, cors) {
    return new Promise(function (ok, erro) {
      var img = new Image();
      if (cors) img.crossOrigin = "anonymous";
      img.onload = function () { ok(img); };
      img.onerror = function () { erro(new Error("Não consegui abrir esta imagem. Se for foto do iPhone em HEIC, tire um print ou use JPG.")); };
      img.src = src;
    });
  }
  function paraBlob(img, sx, sy, sw, sh) {
    var s = Math.min(1, LADO_MAX / Math.max(sw, sh));
    var w = Math.max(1, Math.round(sw * s)), h = Math.max(1, Math.round(sh * s));
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    return new Promise(function (ok, erro) {
      c.toBlob(function (b) { b ? ok({ blob: b, w: w, h: h }) : erro(new Error("Não consegui converter a imagem.")); }, "image/webp", 0.84);
    });
  }
  function reduzirArquivo(arq) {
    var url = URL.createObjectURL(arq);
    return carregarImagem(url).then(function (img) {
      return paraBlob(img, 0, 0, img.naturalWidth, img.naturalHeight);
    }).then(function (r) { URL.revokeObjectURL(url); return r; }, function (e) { URL.revokeObjectURL(url); throw e; });
  }

  // abre o recorte; devolve { blob, w, h } ou null se cancelar
  function recortar(src, cors) {
    return carregarImagem(src, cors).then(function (img) {
      return new Promise(function (resolve) {
        var d = document.createElement("dialog");
        d.className = "crop";
        d.setAttribute("aria-labelledby", "crop-t");
        d.innerHTML = '<h2 id="crop-t">Recortar foto</h2>' +
          '<p class="crop__ajuda">Arraste a moldura para mover e as bolinhas dos cantos para ajustar. Deixe só um óculos dentro.</p>' +
          '<div class="crop__area"><img alt="Foto para recortar"><div class="crop__box" tabindex="0" aria-label="Área de recorte">' +
          '<span class="crop__h crop__h--tl" data-h="tl"></span><span class="crop__h crop__h--tr" data-h="tr"></span>' +
          '<span class="crop__h crop__h--bl" data-h="bl"></span><span class="crop__h crop__h--br" data-h="br"></span></div></div>' +
          '<div class="crop__acoes"><button type="button" class="btn btn--primary" data-usar>Usar recorte</button>' +
          '<button type="button" class="btn btn--ghost" data-cancelar>Cancelar</button></div>';
        document.body.appendChild(d);
        var vimg = $("img", d), box = $(".crop__box", d), area = $(".crop__area", d);
        vimg.src = src;
        var R = { x: 0, y: 0, w: 0, h: 0 }, W = 0, H = 0, arrasto = null, MIN = 40;
        function aplicar() { box.style.left = R.x + "px"; box.style.top = R.y + "px"; box.style.width = R.w + "px"; box.style.height = R.h + "px"; }
        function medir() {
          W = vimg.clientWidth; H = vimg.clientHeight;
          if (!R.w) { R.w = Math.round(W * 0.8); R.h = Math.round(H * 0.8); R.x = Math.round((W - R.w) / 2); R.y = Math.round((H - R.h) / 2); }
          aplicar();
        }
        function ponto(e) { var b = area.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; }
        function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
        area.addEventListener("pointerdown", function (e) {
          var alvo = e.target, h = alvo.getAttribute && alvo.getAttribute("data-h");
          if (!h && alvo !== box) return;
          e.preventDefault();
          arrasto = { modo: h || "move", p0: ponto(e), r0: { x: R.x, y: R.y, w: R.w, h: R.h } };
          try { area.setPointerCapture(e.pointerId); } catch (x) {}
        });
        area.addEventListener("pointermove", function (e) {
          if (!arrasto) return;
          var p = ponto(e), dx = p.x - arrasto.p0.x, dy = p.y - arrasto.p0.y, r = arrasto.r0;
          if (arrasto.modo === "move") {
            R.x = clamp(r.x + dx, 0, W - r.w); R.y = clamp(r.y + dy, 0, H - r.h);
          } else {
            var x1 = r.x, y1 = r.y, x2 = r.x + r.w, y2 = r.y + r.h;
            if (arrasto.modo.indexOf("l") !== -1) x1 = clamp(r.x + dx, 0, x2 - MIN);
            if (arrasto.modo.indexOf("r") !== -1) x2 = clamp(r.x + r.w + dx, x1 + MIN, W);
            if (arrasto.modo.indexOf("t") !== -1) y1 = clamp(r.y + dy, 0, y2 - MIN);
            if (arrasto.modo.indexOf("b") !== -1) y2 = clamp(r.y + r.h + dy, y1 + MIN, H);
            R.x = x1; R.y = y1; R.w = x2 - x1; R.h = y2 - y1;
          }
          aplicar();
        });
        function soltar() { arrasto = null; }
        area.addEventListener("pointerup", soltar);
        area.addEventListener("pointercancel", soltar);
        function fechar(res) { try { d.close(); } catch (e) {} d.remove(); resolve(res); }
        $("[data-cancelar]", d).addEventListener("click", function () { fechar(null); });
        d.addEventListener("cancel", function (e) { e.preventDefault(); fechar(null); });
        $("[data-usar]", d).addEventListener("click", function () {
          var k = img.naturalWidth / W;
          paraBlob(img, Math.round(R.x * k), Math.round(R.y * k), Math.round(R.w * k), Math.round(R.h * k))
            .then(fechar, function (e) { aviso(e.message, false); fechar(null); });
        });
        if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
        if (vimg.complete) medir(); else vimg.onload = medir;
        window.addEventListener("resize", function () { if (d.isConnected) { var k = vimg.clientWidth / (W || 1); R.x *= k; R.y *= k; R.w *= k; R.h *= k; medir(); } });
      });
    });
  }

  // escolher uma foto já existente na galeria do site para recortar
  function escolherDaGaleria() {
    return new Promise(function (resolve) {
      var fotos = [];
      GALERIA.forEach(function (p) {
        (p.galeria && p.galeria.length ? p.galeria : [{ imagem: p.imagem }]).forEach(function (g) { fotos.push({ src: g.imagem, nome: p.nome }); });
      });
      var d = document.createElement("dialog");
      d.className = "crop";
      d.setAttribute("aria-labelledby", "pick-t");
      d.innerHTML = '<h2 id="pick-t">Fotos da galeria da loja</h2><p class="crop__ajuda">Toque na foto que tem o óculos que você quer cadastrar. Depois você recorta só ele.</p>' +
        '<div class="pick">' + (fotos.length ? fotos.map(function (f, i) {
          return '<button type="button" data-i="' + i + '" aria-label="' + esc(f.nome) + ' — foto ' + (i + 1) + '"><img src="' + esc(f.src) + '" alt="" loading="lazy"></button>';
        }).join("") : "<p>Não há fotos de galeria cadastradas.</p>") + "</div>" +
        '<div class="crop__acoes"><button type="button" class="btn btn--ghost" data-cancelar>Fechar</button></div>';
      document.body.appendChild(d);
      function fechar(res) { try { d.close(); } catch (e) {} d.remove(); resolve(res); }
      d.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-i]");
        if (b) fechar(fotos[parseInt(b.getAttribute("data-i"), 10)].src);
        if (e.target.closest("[data-cancelar]")) fechar(null);
      });
      d.addEventListener("cancel", function () { d.remove(); resolve(null); });
      if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
    });
  }

  /* ---------- telas ---------- */
  function mostrarLogin() {
    btnSair.hidden = true;
    root.innerHTML = '<div class="adm-card" style="max-width:440px;margin:30px auto"><h1>Entrar no painel</h1>' +
      '<form id="fLogin" novalidate><div class="field"><label for="lgEmail">E-mail</label><input id="lgEmail" type="email" autocomplete="username" required></div>' +
      '<div class="field"><label for="lgSenha">Senha</label><input id="lgSenha" type="password" autocomplete="current-password" required></div>' +
      '<button class="btn btn--primary" type="submit">Entrar</button><p class="form-status" id="admMsg" role="status" aria-live="polite"></p></form></div>';
    $("#fLogin").addEventListener("submit", function (e) {
      e.preventDefault();
      var em = $("#lgEmail").value.trim(), sn = $("#lgSenha").value;
      if (!em || !sn) { aviso("Informe e-mail e senha.", false); return; }
      aviso("Entrando…", true);
      SB.entrar(em, sn).then(function () { mostrarPainel(); }, function (err) { aviso(err.message, false); });
    });
  }
  function semConfig() {
    btnSair.hidden = true;
    root.innerHTML = '<div class="adm-card"><h1>Painel não configurado</h1><p>Preencha <strong>supabase.url</strong> e <strong>supabase.anonKey</strong> em <code>js/config.js</code> ' +
      '(passo a passo no README, seção “Painel de administração”).</p></div>';
  }

  function mostrarPainel() {
    var s = SB.sessao();
    btnSair.hidden = false;
    root.innerHTML = '<div class="adm-top"><button type="button" class="chip" data-aba="lista" aria-pressed="true">Produtos</button>' +
      '<button type="button" class="chip" data-aba="form" aria-pressed="false">Novo óculos</button>' +
      '<span class="adm-email">' + esc(s ? s.email : "") + "</span></div>" +
      '<p class="form-status" id="admMsg" role="status" aria-live="polite"></p><div id="admView"></div>';
    $$("[data-aba]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("data-aba") === "form") novoForm(); else { estado.aba = "lista"; carregarLista(); }
      });
    });
    carregarLista();
  }
  function marcarAba(a) {
    $$("[data-aba]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-aba") === a)); });
  }
  function tratarErro(err) {
    if (/sess[aã]o|entre/i.test(err.message)) { aviso("", true); mostrarLogin(); aviso(err.message, false); return; }
    aviso(err.message, false);
  }

  function carregarLista() {
    estado.aba = "lista"; marcarAba("lista");
    var v = $("#admView");
    v.innerHTML = '<p class="count">Carregando…</p>';
    SB.listarProdutos(true).then(function (linhas) {
      estado.produtos = linhas || [];
      desenharLista();
    }, tratarErro);
  }
  function desenharLista() {
    var v = $("#admView");
    var q = estado.busca.toLowerCase();
    var lista = estado.produtos.filter(function (p) {
      return !q || [p.nome, p.marca, p.modelo, p.codigo].join(" ").toLowerCase().indexOf(q) !== -1;
    });
    v.innerHTML = '<div class="adm-barra"><div class="search"><label class="sr-only" for="admBusca">Buscar</label>' +
      '<input type="search" id="admBusca" placeholder="Buscar nome, marca, modelo ou código" value="' + esc(estado.busca) + '"></div>' +
      '<button type="button" class="btn btn--primary" id="admNovo">+ Novo óculos</button></div>' +
      '<p class="count">' + estado.produtos.length + (estado.produtos.length === 1 ? " produto cadastrado" : " produtos cadastrados") + "</p>" +
      (lista.length ? '<div class="adm-lista">' + lista.map(function (p) {
        var f = (p.fotos && p.fotos[0]) || {};
        return '<div class="adm-item" data-id="' + esc(p.id) + '">' + (f.url ? '<img src="' + esc(f.url) + '" alt="" loading="lazy">' : "<span></span>") +
          '<div class="adm-item__info"><strong>' + esc(p.nome) + "</strong><span>" + esc([p.marca, p.modelo ? "Modelo " + p.modelo : ""].filter(Boolean).join(" · ") || "Sem marca/modelo") + "</span>" +
          "<span>Cód. " + esc(p.codigo) + " · " + esc(catNome(p.categoria)) + (p.preco != null ? " · " + moeda(p.preco) : "") + "</span>" +
          "<span>" + (p.ativo ? "" : '<span class="adm-tag adm-tag--off">Oculto no site</span>') + (p.destaque ? '<span class="adm-tag">Destaque</span>' : "") + "</span></div>" +
          '<div class="adm-item__btns"><button type="button" class="btn btn--ghost btn--sm" data-ac="editar">Editar</button>' +
          '<button type="button" class="btn btn--ghost btn--sm" data-ac="ativo">' + (p.ativo ? "Ocultar" : "Mostrar") + "</button>" +
          '<button type="button" class="btn btn--ghost btn--sm" data-ac="excluir">Excluir</button></div></div>';
      }).join("") + "</div>" : '<div class="empty"><h3>Nenhum produto ainda</h3><p>Cadastre o primeiro óculos.</p></div>');
    $("#admBusca").addEventListener("input", function (e) { estado.busca = e.target.value; var pos = e.target.selectionStart; desenharLista(); var b = $("#admBusca"); b.focus(); try { b.setSelectionRange(pos, pos); } catch (x) {} });
    $("#admNovo").addEventListener("click", novoForm);
    $$(".adm-item [data-ac]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.closest(".adm-item").getAttribute("data-id");
        var p = estado.produtos.filter(function (x) { return x.id === id; })[0];
        var ac = b.getAttribute("data-ac");
        if (ac === "editar") editarForm(p);
        if (ac === "ativo") alternar(p);
        if (ac === "excluir") excluir(p);
      });
    });
  }
  function alternar(p) {
    SB.atualizarProduto(p.id, { ativo: !p.ativo }).then(function () {
      aviso(p.ativo ? "“" + p.nome + "” foi ocultado do site." : "“" + p.nome + "” voltou ao site.", true);
      carregarLista();
    }, tratarErro);
  }
  function excluir(p) {
    if (!window.confirm("Excluir “" + p.nome + "” (" + p.codigo + ") e as fotos dele? Isso não pode ser desfeito.")) return;
    SB.apagarProduto(p.id).then(function () {
      return Promise.all((p.fotos || []).map(function (f) { return f.path ? SB.apagarFoto(f.path) : null; }));
    }).then(function () { aviso("“" + p.nome + "” foi excluído.", true); carregarLista(); }, tratarErro);
  }

  /* ---------- formulário ---------- */
  function novoForm() { estado.editando = null; estado.fotos = []; estado.apagar = []; desenharForm({}); }
  function editarForm(p) {
    estado.editando = p;
    estado.fotos = (p.fotos || []).map(function (f) { return { origem: "existente", url: f.url, path: f.path, w: f.w, h: f.h }; });
    estado.apagar = [];
    desenharForm(p);
  }
  function marcasExistentes() {
    var m = {};
    estado.produtos.forEach(function (p) { if (p.marca) m[p.marca] = 1; });
    return Object.keys(m).sort();
  }
  function desenharForm(p) {
    estado.aba = "form"; marcarAba(p.id ? "lista" : "form");
    var v = $("#admView");
    v.innerHTML = '<div class="adm-card"><h1>' + (p.id ? "Editar óculos" : "Novo óculos") + "</h1>" +
      (p.codigo ? '<p class="count">Código: <strong>' + esc(p.codigo) + "</strong></p>" : '<p class="count">O código (ID) é criado automaticamente ao salvar.</p>') +
      '<form id="fProd" novalidate><div class="adm-grid">' +
      '<div class="field field--full"><label for="fNome">Nome do modelo <span class="req" aria-hidden="true">*</span></label><input id="fNome" maxlength="120" value="' + esc(p.nome) + '" placeholder="Ex.: Armação gatinho acetato preta" required></div>' +
      '<div class="field"><label for="fMarca">Marca</label><input id="fMarca" list="dlMarcas" maxlength="60" value="' + esc(p.marca) + '" placeholder="Ex.: Vision"><datalist id="dlMarcas">' + marcasExistentes().map(function (m) { return '<option value="' + esc(m) + '">'; }).join("") + "</datalist></div>" +
      '<div class="field"><label for="fModelo">Modelo / referência</label><input id="fModelo" maxlength="60" value="' + esc(p.modelo) + '" placeholder="Ex.: BR2563"></div>' +
      '<div class="field"><label for="fCat">Categoria <span class="req" aria-hidden="true">*</span></label><select id="fCat" required><option value="">Escolher…</option>' +
        CATS.map(function (c) { return '<option value="' + esc(c.id) + '"' + (p.categoria === c.id ? " selected" : "") + ">" + esc(c.nome) + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="fPreco">Preço (opcional)</label><input id="fPreco" inputmode="decimal" value="' + esc(fmtPreco(p.preco)) + '" placeholder="Ex.: 189,90"></div>' +
      '<div class="field field--full"><label for="fDesc">Descrição (opcional)</label><textarea id="fDesc" rows="3" maxlength="600">' + esc(p.descricao) + "</textarea></div>" +
      '<div class="field field--full"><label class="adm-check"><input type="checkbox" id="fDest"' + (p.destaque ? " checked" : "") + '> Mostrar em destaque na página inicial</label></div>' +
      '<div class="field field--full"><label>Fotos <span class="req" aria-hidden="true">*</span> <span class="form-hint">(a primeira é a capa; até ' + MAX_FOTOS + ')</span></label>' +
      '<div class="crop__acoes"><button type="button" class="btn btn--ghost btn--sm" id="fAdd">+ Adicionar fotos</button>' +
      '<button type="button" class="btn btn--ghost btn--sm" id="fGal">Usar foto da galeria da loja</button></div>' +
      '<input type="file" id="fArq" accept="image/*" multiple hidden><div class="adm-fotos" id="fFotos"></div></div></div>' +
      '<div class="crop__acoes"><button type="submit" class="btn btn--primary" id="fSalvar">Salvar</button><button type="button" class="btn btn--ghost" id="fCancel">Cancelar</button></div>' +
      '<p class="form-status" id="fStatus" role="status" aria-live="polite"></p></form></div>';
    desenharFotos();
    $("#fAdd").addEventListener("click", function () { $("#fArq").click(); });
    $("#fArq").addEventListener("change", function (e) { adicionarArquivos(Array.prototype.slice.call(e.target.files)); e.target.value = ""; });
    $("#fGal").addEventListener("click", function () {
      escolherDaGaleria().then(function (src) { if (src) return recortar(src, false).then(function (r) { if (r) addFoto(r); }); }).catch(function (e) { statusForm(e.message, false); });
    });
    $("#fCancel").addEventListener("click", function () { carregarLista(); });
    $("#fProd").addEventListener("submit", function (e) { e.preventDefault(); salvar(); });
  }
  function statusForm(msg, ok) {
    var el = $("#fStatus");
    if (!el) return;
    el.textContent = msg || "";
    el.className = "form-status" + (msg ? (ok ? " is-ok" : " is-error") : "");
  }
  function addFoto(r) {
    if (estado.fotos.length >= MAX_FOTOS) { statusForm("Máximo de " + MAX_FOTOS + " fotos por produto.", false); return; }
    estado.fotos.push({ origem: "nova", blob: r.blob, w: r.w, h: r.h, prev: URL.createObjectURL(r.blob) });
    desenharFotos();
  }
  function adicionarArquivos(arqs) {
    statusForm("Preparando fotos…", true);
    arqs.reduce(function (cadeia, a) {
      return cadeia.then(function () {
        if (estado.fotos.length >= MAX_FOTOS) return null;
        return reduzirArquivo(a).then(addFoto);
      });
    }, Promise.resolve()).then(function () { statusForm("", true); }, function (e) { statusForm(e.message, false); });
  }
  function desenharFotos() {
    var el = $("#fFotos");
    if (!el) return;
    el.innerHTML = estado.fotos.map(function (f, i) {
      var src = f.origem === "nova" ? f.prev : f.url;
      return '<div class="adm-foto" data-i="' + i + '"><img src="' + esc(src) + '" alt="Foto ' + (i + 1) + '">' + (i === 0 ? '<span class="adm-foto__capa">Capa</span>' : "") +
        '<div class="adm-foto__btns"><button type="button" data-f="esq" aria-label="Mover foto ' + (i + 1) + ' para trás"' + (i === 0 ? " disabled" : "") + '>←</button>' +
        '<button type="button" data-f="dir" aria-label="Mover foto ' + (i + 1) + ' para frente"' + (i === estado.fotos.length - 1 ? " disabled" : "") + '>→</button>' +
        '<button type="button" data-f="cortar" aria-label="Recortar foto ' + (i + 1) + '">✂</button>' +
        '<button type="button" data-f="del" aria-label="Remover foto ' + (i + 1) + '">✕</button></div></div>';
    }).join("");
    $$("[data-f]", el).forEach(function (b) {
      b.addEventListener("click", function () {
        var i = parseInt(b.closest(".adm-foto").getAttribute("data-i"), 10), a = b.getAttribute("data-f"), f = estado.fotos[i];
        if (a === "esq" && i > 0) { estado.fotos.splice(i - 1, 0, estado.fotos.splice(i, 1)[0]); desenharFotos(); }
        if (a === "dir" && i < estado.fotos.length - 1) { estado.fotos.splice(i + 1, 0, estado.fotos.splice(i, 1)[0]); desenharFotos(); }
        if (a === "del") { if (f.origem === "existente" && f.path) estado.apagar.push(f.path); estado.fotos.splice(i, 1); desenharFotos(); }
        if (a === "cortar") {
          recortar(f.origem === "nova" ? f.prev : f.url, f.origem !== "nova").then(function (r) {
            if (!r) return;
            if (f.origem === "existente" && f.path) estado.apagar.push(f.path);
            estado.fotos[i] = { origem: "nova", blob: r.blob, w: r.w, h: r.h, prev: URL.createObjectURL(r.blob) };
            desenharFotos();
          }).catch(function (e) { statusForm(e.message, false); });
        }
      });
    });
  }

  function salvar() {
    if (estado.ocupado) return;
    var nome = $("#fNome").value.trim(), cat = $("#fCat").value, preco = parsePreco($("#fPreco").value);
    if (nome.length < 2) { statusForm("Informe o nome do modelo.", false); $("#fNome").focus(); return; }
    if (!cat) { statusForm("Escolha a categoria.", false); $("#fCat").focus(); return; }
    if (preco !== null && isNaN(preco)) { statusForm("Preço inválido. Use algo como 189,90.", false); $("#fPreco").focus(); return; }
    if (!estado.fotos.length) { statusForm("Adicione pelo menos uma foto.", false); return; }
    var editando = estado.editando, id = editando ? editando.id : uuid();
    estado.ocupado = true; $("#fSalvar").disabled = true;
    var enviados = [], total = estado.fotos.filter(function (f) { return f.origem === "nova"; }).length, feitos = 0;
    var finais = [];
    estado.fotos.reduce(function (cadeia, f, i) {
      return cadeia.then(function () {
        if (f.origem === "existente") { finais.push({ url: f.url, path: f.path, w: f.w, h: f.h }); return null; }
        feitos++; statusForm("Enviando foto " + feitos + " de " + total + "…", true);
        var ext = f.blob.type === "image/webp" ? "webp" : (f.blob.type === "image/png" ? "png" : "jpg");
        var path = id + "/" + Date.now() + "-" + i + "." + ext;
        return SB.enviarFoto(path, f.blob).then(function (url) { enviados.push(path); finais.push({ url: url, path: path, w: f.w, h: f.h }); });
      });
    }, Promise.resolve()).then(function () {
      statusForm("Salvando…", true);
      var dados = {
        nome: nome, marca: $("#fMarca").value.trim() || null, modelo: $("#fModelo").value.trim() || null, categoria: cat,
        descricao: $("#fDesc").value.trim() || null, preco: preco, destaque: $("#fDest").checked, fotos: finais
      };
      if (editando) return SB.atualizarProduto(id, dados);
      dados.id = id;
      return SB.criarProduto(dados);
    }).then(function (salvo) {
      return Promise.all(estado.apagar.map(function (p) { return SB.apagarFoto(p); })).then(function () { return salvo; });
    }).then(function (salvo) {
      estado.ocupado = false;
      aviso("Salvo! " + (salvo && salvo.codigo ? "Código: " + salvo.codigo + ". " : "") + "Já aparece no site.", true);
      carregarLista();
    }).catch(function (err) {
      estado.ocupado = false;
      var b = $("#fSalvar"); if (b) b.disabled = false;
      enviados.forEach(function (p) { SB.apagarFoto(p); });   // não deixa foto órfã no storage
      statusForm(err.message || "Não foi possível salvar.", false);
      if (/sess[aã]o/i.test(err.message)) { mostrarLogin(); aviso(err.message, false); }
    });
  }

  /* ---------- início ---------- */
  btnSair.addEventListener("click", function () { SB.sair(); mostrarLogin(); });
  if (!SB || !SB.configurado) semConfig();
  else if (SB.sessao()) mostrarPainel();
  else mostrarLogin();
})();
