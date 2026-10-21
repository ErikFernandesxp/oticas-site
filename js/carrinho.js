/* ==========================================================================
   carrinho.js — carrinho de óculos com receita por item.
   O pedido NÃO é pago no site: ao finalizar, abre o WhatsApp com tudo
   organizado (nome do modelo, ID, marca, modelo e receita de cada óculos).
   ========================================================================== */
(function () {
  "use strict";

  var CHAVE = "otica_carrinho_v1", NOME_CHAVE = "otica_cliente_nome", MAX = 10;
  var itens = ler();
  var dlg = null, toastEl = null, toastT = null;

  function O() { return window.Otica || {}; }
  function esc(s) { return (O().esc || function (x) { return String(x); })(s); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- estado ---------- */
  function ler() {
    try {
      var d = JSON.parse(localStorage.getItem(CHAVE) || "[]");
      return Array.isArray(d) ? d.slice(0, MAX) : [];
    } catch (e) { return []; }
  }
  function gravar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(itens)); } catch (e) {}
    avisar();
  }
  function avisar() {
    atualizarBadge();
    try { document.dispatchEvent(new CustomEvent("otica:carrinho")); } catch (e) {}
  }
  function receitaVazia() {
    return { tipo: "sem", od: { esf: "", cil: "", eixo: "" }, oe: { esf: "", cil: "", eixo: "" }, adicao: "", dnpOd: "", dnpOe: "", lente: "", obs: "" };
  }
  function novoId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function achar(lid) { for (var i = 0; i < itens.length; i++) if (itens[i].lid === lid) return itens[i]; return null; }
  function contem(codigo) { return itens.some(function (i) { return i.codigo === codigo; }); }

  function adicionar(p) {
    if (contem(p.codigo)) { toast("Este modelo já está no carrinho.", "Ver carrinho"); return "duplicado"; }
    if (itens.length >= MAX) { toast("O carrinho aceita até " + MAX + " óculos. Para mais, fale com a equipe."); return "limite"; }
    itens.push({ lid: novoId(), codigo: p.codigo, nome: p.nome, marca: p.marca || "", modelo: p.modelo || "", imagem: p.imagem || "", receita: receitaVazia() });
    gravar();
    toast("“" + p.nome + "” foi para o carrinho.", "Ver carrinho");
    return "ok";
  }

  /* ---------- selo do cabeçalho e aviso ---------- */
  function atualizarBadge() {
    var n = itens.length;
    $$("[data-carrinho-abrir]").forEach(function (b) {
      var sel = $("[data-carrinho-n]", b);
      if (sel) { sel.textContent = n; sel.hidden = !n; }
      b.setAttribute("aria-label", n ? "Abrir carrinho (" + n + (n === 1 ? " item)" : " itens)") : "Abrir carrinho");
    });
  }
  function toast(msg, acao) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      toastEl.hidden = true;
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = "<span>" + esc(msg) + "</span>" + (acao ? '<button type="button" class="toast__btn">' + esc(acao) + "</button>" : "");
    toastEl.hidden = false;
    var b = $(".toast__btn", toastEl);
    if (b) b.addEventListener("click", function () { toastEl.hidden = true; abrir(); });
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.hidden = true; }, 4000);
  }

  /* ---------- receita: leitura, validação e formatação ---------- */
  var REGRAS = {
    esf: { nome: "esférico", min: -20, max: 20, passo: 0.25, sinal: true },
    cil: { nome: "cilíndrico", min: -10, max: 10, passo: 0.25, sinal: true },
    eixo: { nome: "eixo", min: 0, max: 180, inteiro: true },
    adicao: { nome: "adição", min: 0.25, max: 4.5, passo: 0.25, sinal: true },
    dnp: { nome: "DNP", min: 20, max: 40, passo: 0.5 }
  };
  function lerNumero(txt) {
    var t = String(txt == null ? "" : txt).replace(/\s/g, "").replace("−", "-").replace(",", ".");
    if (t === "") return null;
    if (!/^[+-]?\d+(\.\d+)?$/.test(t)) return NaN;
    return parseFloat(t);
  }
  // devolve { v: "texto formatado" | "", erro: "" | "mensagem" }
  function conferir(txt, regra) {
    var n = lerNumero(txt);
    if (n === null) return { v: "", erro: "" };
    if (isNaN(n)) return { v: "", erro: "valor inválido em " + regra.nome };
    if (n < regra.min || n > regra.max) return { v: "", erro: regra.nome + " fora do normal (" + String(regra.min).replace(".", ",") + " a " + String(regra.max).replace(".", ",") + ")" };
    if (regra.inteiro) {
      if (n !== Math.round(n)) return { v: "", erro: regra.nome + " deve ser um número inteiro" };
      return { v: String(n), erro: "" };
    }
    if (Math.abs(n / regra.passo - Math.round(n / regra.passo)) > 1e-9) {
      return { v: "", erro: regra.nome + ": use passos de " + String(regra.passo).replace(".", ",") };
    }
    var s = regra.passo === 0.5 ? (n === Math.round(n) ? String(n) : n.toFixed(1).replace(".", ",")) : n.toFixed(2).replace(".", ",");
    if (regra.sinal && n > 0) s = "+" + s;
    return { v: s, erro: "" };
  }
  // valida a receita de um item; devolve { erros: [], r: receita formatada }
  function validarReceita(rc) {
    var erros = [], r = { tipo: rc.tipo, lente: rc.lente || "", obs: String(rc.obs || "").trim() };
    if (rc.tipo !== "com") return { erros: erros, r: r };
    function campo(txt, regra, rotulo) {
      var c = conferir(txt, regra);
      if (c.erro) erros.push(rotulo + ": " + c.erro + ".");
      return c.v;
    }
    r.od = { esf: campo(rc.od.esf, REGRAS.esf, "OD"), cil: campo(rc.od.cil, REGRAS.cil, "OD"), eixo: campo(rc.od.eixo, REGRAS.eixo, "OD") };
    r.oe = { esf: campo(rc.oe.esf, REGRAS.esf, "OE"), cil: campo(rc.oe.cil, REGRAS.cil, "OE"), eixo: campo(rc.oe.eixo, REGRAS.eixo, "OE") };
    r.adicao = campo(rc.adicao, REGRAS.adicao, "Adição");
    r.dnpOd = campo(rc.dnpOd, REGRAS.dnp, "DNP OD");
    r.dnpOe = campo(rc.dnpOe, REGRAS.dnp, "DNP OE");
    if (!erros.length) {
      if (!(r.od.esf || r.od.cil || r.oe.esf || r.oe.cil)) erros.push("Informe o esférico ou o cilíndrico de pelo menos um dos olhos.");
      ["od", "oe"].forEach(function (o) {
        var cil = lerNumero(r[o].cil);
        if (cil && !r[o].eixo) erros.push("Informe o eixo do " + (o === "od" ? "olho direito (OD)" : "olho esquerdo (OE)") + ", pois há cilíndrico.");
      });
    }
    return { erros: erros, r: r };
  }

  /* ---------- mensagem do WhatsApp ---------- */
  function linhaOlho(rot, o) {
    var p = [];
    if (o.esf) p.push("esf " + o.esf);
    if (o.cil) p.push("cil " + o.cil);
    if (o.eixo) p.push("eixo " + o.eixo);
    return p.length ? "• " + rot + ": " + p.join(" | ") : "";
  }
  function montarMensagem(nome, obs, validados) {
    var n = validados.length;
    var L = ["Olá! Quero fazer um pedido pelo site da {nome}.", "", "*Pedido* (" + n + (n === 1 ? " item)" : " itens)")];
    validados.forEach(function (v, i) {
      var it = v.item, r = v.r;
      L.push("", "*" + (i + 1) + ") " + it.nome + "*");
      var ficha = [];
      if (it.marca) ficha.push("Marca: " + it.marca);
      if (it.modelo) ficha.push("Modelo: " + it.modelo);
      ficha.push("Cód.: " + it.codigo);
      L.push(ficha.join(" | "));
      if (r.tipo === "sem") L.push("Só a armação (sem lentes)");
      else if (r.tipo === "foto") L.push("Com lentes: vou enviar a foto da receita aqui no WhatsApp");
      else {
        L.push("Com lentes. Receita:");
        [linhaOlho("OD", r.od), linhaOlho("OE", r.oe)].forEach(function (x) { if (x) L.push(x); });
        if (r.adicao) L.push("• Adição: " + r.adicao);
        if (r.dnpOd || r.dnpOe) L.push("• DNP: " + [r.dnpOd ? "OD " + r.dnpOd : "", r.dnpOe ? "OE " + r.dnpOe : ""].filter(Boolean).join(" | "));
        if (r.lente) L.push("• Lente: " + r.lente);
      }
      if (r.obs) L.push("Obs.: " + r.obs);
    });
    L.push("", "*Nome:* " + nome);
    if (obs) L.push("*Observações do pedido:* " + obs);
    return L.join("\n");
  }

  /* ---------- janela do carrinho ---------- */
  var ICO_X = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var ICO_COPIA = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
  var ICO_LIXO = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';

  function montar() {
    dlg = document.createElement("dialog");
    dlg.className = "cart";
    dlg.setAttribute("aria-labelledby", "cart-titulo");
    dlg.innerHTML =
      '<div class="cart__head"><h2 id="cart-titulo">Seu pedido</h2>' +
      '<button type="button" class="modal__close cart__close" data-fechar aria-label="Fechar carrinho" autofocus>' + ICO_X + "</button></div>" +
      '<div class="cart__body" id="cart-corpo"></div>' +
      '<div class="cart__foot" id="cart-rodape">' +
        '<div class="field"><label for="cart-nome">Seu nome <span class="req" aria-hidden="true">*</span></label>' +
        '<input id="cart-nome" type="text" autocomplete="name" placeholder="Como podemos te chamar?"></div>' +
        '<div class="field"><label for="cart-obs">Observações do pedido</label>' +
        '<textarea id="cart-obs" rows="2" placeholder="Ex.: retirar na loja, prazo, dúvidas…"></textarea></div>' +
        '<p class="form-status" id="cart-status" role="status" aria-live="polite"></p>' +
        '<button type="button" class="btn btn--wa cart__enviar" id="cart-enviar">' + (O().icoWa || "") + "Finalizar pelo WhatsApp</button>" +
        '<button type="button" class="cart__limpar" id="cart-limpar">Limpar carrinho</button>' +
      "</div>";
    document.body.appendChild(dlg);
    try { $("#cart-nome", dlg).value = localStorage.getItem(NOME_CHAVE) || ""; } catch (e) {}

    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.closest("[data-fechar]")) { fechar(); return; }
      var b = e.target.closest("[data-acao]");
      if (!b) return;
      var li = b.closest("[data-lid]"), lid = li && li.getAttribute("data-lid"), acao = b.getAttribute("data-acao");
      if (acao === "remover") { itens = itens.filter(function (i) { return i.lid !== lid; }); gravar(); lista(); }
      if (acao === "duplicar") {
        var it = achar(lid);
        if (it && itens.length < MAX) { var c = JSON.parse(JSON.stringify(it)); c.lid = novoId(); itens.splice(itens.indexOf(it) + 1, 0, c); gravar(); lista(); }
        else if (it) toast("O carrinho aceita até " + MAX + " óculos.");
      }
    });
    dlg.addEventListener("change", function (e) {
      var t = e.target, li = t.closest("[data-lid]"), it = li && achar(li.getAttribute("data-lid"));
      if (!it) return;
      if (t.name && t.name.indexOf("tipo-") === 0) {
        it.receita.tipo = t.value;
        $(".rx__campos", li).hidden = t.value !== "com";
        $(".rx__foto", li).hidden = t.value !== "foto";
        erroItem(li, "");
        gravar();
      }
    });
    dlg.addEventListener("input", function (e) {
      var t = e.target;
      if (t.id === "cart-nome") { try { localStorage.setItem(NOME_CHAVE, t.value); } catch (x) {} status(""); return; }
      var li = t.closest("[data-lid]"), it = li && achar(li.getAttribute("data-lid")), campo = t.getAttribute("data-campo");
      if (!it || !campo) return;
      var rc = it.receita;
      if (campo.indexOf(".") !== -1) { var p = campo.split("."); rc[p[0]][p[1]] = t.value; } else rc[campo] = t.value;
      erroItem(li, "");
      try { localStorage.setItem(CHAVE, JSON.stringify(itens)); } catch (x) {}
    });
    $("#cart-enviar", dlg).addEventListener("click", finalizar);
    $("#cart-limpar", dlg).addEventListener("click", function () {
      if (itens.length && !window.confirm("Remover todos os óculos do carrinho?")) return;
      itens = []; gravar(); lista(); status("");
    });
  }
  function status(msg, ok) {
    var el = $("#cart-status", dlg);
    if (!el) return;
    el.textContent = msg;
    el.className = "form-status" + (msg ? (ok ? " is-ok" : " is-error") : "");
  }
  function erroItem(li, msg) {
    var el = $(".rx__erro", li);
    if (!el) return;
    el.textContent = msg; el.hidden = !msg;
  }
  function campoRx(lid, caminho, rotulo, ph, modo) {
    return '<input type="text" inputmode="' + (modo || "decimal") + '" autocomplete="off" placeholder="' + ph + '" aria-label="' + esc(rotulo) + '" data-campo="' + caminho + '" value="__V__">';
  }
  function lista() {
    var corpo = $("#cart-corpo", dlg), rod = $("#cart-rodape", dlg);
    rod.hidden = !itens.length;
    if (!itens.length) {
      corpo.innerHTML = '<div class="cart__vazio"><p><strong>Seu carrinho está vazio.</strong></p><p>Escolha os óculos na coleção e toque em “Adicionar”.</p>' +
        '<a class="btn btn--primary" href="colecao.html">Ver coleção</a></div>';
      return;
    }
    corpo.innerHTML = '<ul class="cart__lista">' + itens.map(function (it, idx) {
      var rc = it.receita, id = it.lid;
      function v(x) { return esc(x || ""); }
      function inp(caminho, rotulo, ph, valor, modo) { var x = v(valor); return campoRx(id, caminho, rotulo, ph, modo).replace("__V__", function () { return x; }); }
      var ficha = [it.marca, it.modelo ? "Modelo " + it.modelo : "", "Cód. " + it.codigo].filter(Boolean).join(" · ");
      return '<li class="cart-item" data-lid="' + id + '">' +
        '<div class="cart-item__top">' +
          (it.imagem ? '<img src="' + esc(it.imagem) + '" alt="" width="64" height="80" loading="lazy">' : "") +
          '<div class="cart-item__info"><strong>' + (idx + 1) + ". " + esc(it.nome) + "</strong><span>" + esc(ficha) + "</span></div>" +
          '<div class="cart-item__btns">' +
            '<button type="button" class="icon-btn" data-acao="duplicar" aria-label="Duplicar ' + esc(it.nome) + ' (outro grau)" title="Duplicar para outro grau">' + ICO_COPIA + "</button>" +
            '<button type="button" class="icon-btn" data-acao="remover" aria-label="Remover ' + esc(it.nome) + '" title="Remover">' + ICO_LIXO + "</button>" +
          "</div>" +
        "</div>" +
        '<fieldset class="rx"><legend>Lentes</legend>' +
          ["sem|Só a armação", "com|Armação + lentes (tenho a receita)", "foto|Vou enviar a foto da receita no WhatsApp"].map(function (o) {
            var p = o.split("|");
            return '<label class="radio"><input type="radio" name="tipo-' + id + '" value="' + p[0] + '"' + (rc.tipo === p[0] ? " checked" : "") + "> <span>" + p[1] + "</span></label>";
          }).join("") +
          '<p class="rx__foto form-hint"' + (rc.tipo === "foto" ? "" : " hidden") + ">Depois de enviar o pedido, é só mandar a foto da receita na conversa.</p>" +
          '<div class="rx__campos"' + (rc.tipo === "com" ? "" : " hidden") + ">" +
            '<div class="rx__grade" role="group" aria-label="Receita">' +
              '<span class="rx__h" aria-hidden="true"></span><span class="rx__h" aria-hidden="true">Esférico</span><span class="rx__h" aria-hidden="true">Cilíndrico</span><span class="rx__h" aria-hidden="true">Eixo</span><span class="rx__h" aria-hidden="true">DNP</span>' +
              '<span class="rx__olho">OD</span>' + inp("od.esf", "OD esférico", "-2,00", rc.od.esf) + inp("od.cil", "OD cilíndrico", "-0,50", rc.od.cil) + inp("od.eixo", "OD eixo", "90", rc.od.eixo, "numeric") + inp("dnpOd", "DNP do olho direito", "31", rc.dnpOd) +
              '<span class="rx__olho">OE</span>' + inp("oe.esf", "OE esférico", "-1,75", rc.oe.esf) + inp("oe.cil", "OE cilíndrico", "—", rc.oe.cil) + inp("oe.eixo", "OE eixo", "—", rc.oe.eixo, "numeric") + inp("dnpOe", "DNP do olho esquerdo", "31", rc.dnpOe) +
            "</div>" +
            '<div class="rx__linha"><label>Adição (perto)' + inp("adicao", "Adição", "+1,50", rc.adicao) + "</label>" +
            '<label>Tipo de lente<select data-campo="lente">' +
              ["", "Visão simples", "Multifocal", "Bifocal", "Não sei"].map(function (o) { return '<option value="' + o + '"' + (rc.lente === o ? " selected" : "") + ">" + (o || "Escolher…") + "</option>"; }).join("") +
            "</select></label></div>" +
          "</div>" +
          '<label class="rx__obs">Observação sobre este óculos (opcional)<input type="text" data-campo="obs" maxlength="160" value="' + v(rc.obs) + '" placeholder="Ex.: lente com filtro de luz azul"></label>' +
          '<p class="rx__erro" role="alert" hidden></p>' +
        "</fieldset></li>";
    }).join("") + "</ul>";
  }

  function finalizar() {
    var nome = $("#cart-nome", dlg).value.trim();
    var obs = $("#cart-obs", dlg).value.trim();
    if (!itens.length) { status("O carrinho está vazio.", false); return; }
    var validados = [], primeiroErro = null;
    itens.forEach(function (it) {
      var res = validarReceita(it.receita), li = $('[data-lid="' + it.lid + '"]', dlg);
      erroItem(li, res.erros.join(" "));
      if (res.erros.length && !primeiroErro) primeiroErro = li;
      validados.push({ item: it, r: res.r });
    });
    if (primeiroErro) { status("Confira a receita destacada abaixo.", false); primeiroErro.scrollIntoView({ block: "center" }); return; }
    if (!nome) { status("Informe seu nome para finalizar.", false); $("#cart-nome", dlg).focus(); return; }
    var msg = montarMensagem(nome, obs, validados);
    status("Abrindo o WhatsApp… se não abrir, toque em Finalizar de novo.", true);
    if (O().openWhatsApp && O().waUrl) O().openWhatsApp(O().waUrl(msg));
  }

  function abrir() {
    if (!dlg) montar();
    lista(); status("");
    document.body.classList.add("no-scroll");
    if (typeof dlg.showModal === "function") { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute("open", "");
  }
  function fechar() {
    if (!dlg) return;
    if (dlg.close) dlg.close(); else dlg.removeAttribute("open");
    document.body.classList.remove("no-scroll");
  }

  function iniciar() {
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-carrinho-abrir]")) { e.preventDefault(); abrir(); }
    });
    window.addEventListener("storage", function (e) { if (e.key === CHAVE) { itens = ler(); avisar(); if (dlg && dlg.open) lista(); } });
    document.addEventListener("close", function (e) { if (e.target === dlg) document.body.classList.remove("no-scroll"); }, true);
    atualizarBadge();
  }

  window.OticaCarrinho = {
    adicionar: adicionar, contem: contem, abrir: abrir, iniciar: iniciar,
    contar: function () { return itens.length; },
    _validar: validarReceita, _mensagem: montarMensagem
  };
})();
