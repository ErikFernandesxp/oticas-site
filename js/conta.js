/* ==========================================================================
   conta.js — área do cliente: entrar, criar conta, recuperar senha e
   "Minha conta" (dados + histórico de pedidos). Aparece como uma janela
   lateral dentro das páginas que já existem (mesmo estilo do carrinho) e um
   ícone de conta no cabeçalho, ao lado do carrinho.
   Carregado pelo carrinho.js. Só funciona com o Supabase configurado
   (js/config.js → supabase.url e supabase.anonKey).
   ========================================================================== */
(function () {
  "use strict";

  var SB = window.SB;
  if (!SB || !SB.configurado || window.OticaConta) return;

  var O = window.Otica || {};
  var dlg = null, corpo = null, titulo = null, btnCabecalho = null, vista = "login";

  var STATUS = { novo: "Enviado", confirmado: "Confirmado", pronto: "Pronto para retirada", entregue: "Entregue", cancelado: "Cancelado" };
  var LENTES = { sem: "Só a armação", com: "Com lentes", foto: "Com lentes (receita por foto)" };
  var ICO_X = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var ICO_USER = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>';

  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) {
    if (O.esc) return O.esc(s);
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function moeda(v) { return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function emailOk(e) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e); }

  /* ---------- estilos só do que é novo (o resto reaproveita o carrinho) ---------- */
  function estilos() {
    if ($("#conta-estilos")) return;
    var s = document.createElement("style");
    s.id = "conta-estilos";
    s.textContent = [
      ".conta-abas{display:flex;gap:.5rem;margin:0 0 1.1rem}",
      ".conta-abas button{flex:1;padding:.65rem .8rem;border:0;border-bottom:2px solid transparent;background:none;color:inherit;font:inherit;font-weight:600;opacity:.6;cursor:pointer}",
      ".conta-abas button[aria-pressed=true]{opacity:1;border-bottom-color:currentColor}",
      ".conta-form{display:grid;gap:.9rem}",
      ".conta-link{background:none;border:0;padding:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer;justify-self:start}",
      ".conta-check{display:flex;gap:.6rem;align-items:flex-start;font-size:.9rem}",
      ".conta-check input{margin-top:.2rem}",
      ".conta-sec{margin-top:1.6rem}",
      ".conta-sec h3{margin:0 0 .7rem;font-size:1.05rem}",
      ".conta-pedidos{list-style:none;margin:0;padding:0;display:grid;gap:.8rem}",
      ".conta-pedido{border:1px solid rgba(128,128,128,.35);border-radius:12px;padding:.9rem 1rem;display:grid;gap:.45rem}",
      ".conta-pedido__top{display:flex;justify-content:space-between;gap:.6rem;align-items:center}",
      ".conta-pedido__data{font-size:.85rem;opacity:.7}",
      ".conta-chip{font-size:.75rem;font-weight:700;padding:.2rem .65rem;border-radius:999px;border:1px solid currentColor;white-space:nowrap}",
      ".conta-pedido__itens{margin:0;padding-left:1.1rem;display:grid;gap:.3rem;font-size:.92rem}",
      ".conta-pedido__itens small{display:block;opacity:.7}",
      ".conta-acoes{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.4rem}"
    ].join("");
    document.head.appendChild(s);
  }

  /* ---------- ícone no cabeçalho, ao lado do carrinho ---------- */
  function botao() {
    var cart = $("[data-carrinho-abrir]");
    if (!cart || !cart.parentNode) return;
    btnCabecalho = document.createElement("button");
    btnCabecalho.type = "button";
    btnCabecalho.className = cart.className;
    btnCabecalho.setAttribute("data-conta-abrir", "");
    btnCabecalho.innerHTML = ICO_USER;
    cart.parentNode.insertBefore(btnCabecalho, cart);
    atualizarBotao();
  }
  function atualizarBotao() {
    if (!btnCabecalho) return;
    var s = SB.sessao();
    var rot = s ? "Minha conta" : "Entrar ou criar conta";
    btnCabecalho.setAttribute("aria-label", rot);
    btnCabecalho.title = rot;
    btnCabecalho.classList.toggle("is-logado", !!s);
  }
  function mudou() {
    atualizarBotao();
    try { document.dispatchEvent(new CustomEvent("otica:conta")); } catch (e) {}
  }

  /* ---------- janela ---------- */
  function montar() {
    dlg = document.createElement("dialog");
    dlg.className = "cart";
    dlg.setAttribute("aria-labelledby", "conta-titulo");
    dlg.innerHTML =
      '<div class="cart__head"><h2 id="conta-titulo">Entrar</h2>' +
      '<button type="button" class="modal__close cart__close" data-fechar aria-label="Fechar">' + ICO_X + "</button></div>" +
      '<div class="cart__body" id="conta-corpo"></div>';
    document.body.appendChild(dlg);
    corpo = $("#conta-corpo", dlg);
    titulo = $("#conta-titulo", dlg);

    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.closest("[data-fechar]")) { fechar(); return; }
      var v = e.target.closest("[data-vista]");
      if (v) { ir(v.getAttribute("data-vista")); return; }
      if (e.target.closest("[data-acao=sair]")) { SB.sair(); mudou(); ir("login"); }
    });
    dlg.addEventListener("submit", function (e) {
      e.preventDefault();
      submeter(e.target);
    });
    dlg.addEventListener("close", function () {
      if (!$("dialog[open]")) document.body.classList.remove("no-scroll");
    });
  }
  function abrir(v, dados) {
    if (!dlg) montar();
    ir(v || (SB.sessao() ? "conta" : "login"), dados);
    document.body.classList.add("no-scroll");
    if (typeof dlg.showModal === "function") { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute("open", "");
  }
  function fechar() {
    if (!dlg) return;
    if (dlg.close) dlg.close(); else dlg.removeAttribute("open");
    if (!$("dialog[open]")) document.body.classList.remove("no-scroll");
  }

  function status(msg, ok) {
    var el = corpo && $(".form-status", corpo);
    if (!el) return;
    el.textContent = msg || "";
    el.className = "form-status" + (msg ? (ok ? " is-ok" : " is-error") : "");
  }
  function ocupado(form, sim) {
    var b = $("button[type=submit]", form);
    if (b) { b.disabled = !!sim; b.setAttribute("aria-busy", String(!!sim)); }
  }
  function foco() {
    try {
      if (window.matchMedia && window.matchMedia("(pointer:fine)").matches) {
        var i = $("input:not([type=checkbox])", corpo);
        if (i) i.focus();
      }
    } catch (e) {}
  }

  /* ---------- peças de HTML ---------- */
  function campo(id, rotulo, tipo, extra) {
    return '<div class="field"><label for="' + id + '">' + rotulo + '</label><input id="' + id + '" name="' + id + '" type="' + tipo + '" ' + (extra || "") + "></div>";
  }
  function abas(ativa) {
    return '<div class="conta-abas" role="group" aria-label="Acesso à conta">' +
      '<button type="button" data-vista="login" aria-pressed="' + (ativa === "login") + '">Entrar</button>' +
      '<button type="button" data-vista="cadastro" aria-pressed="' + (ativa === "cadastro") + '">Criar conta</button></div>';
  }
  var STATUS_P = '<p class="form-status" role="status" aria-live="polite"></p>';

  function mostrar(html, tit) {
    titulo.textContent = tit;
    corpo.innerHTML = html;
  }
  function aviso(msg, ok) {
    var el = corpo && $(".form-status", corpo);
    if (el && msg) { el.textContent = msg; el.className = "form-status " + (ok ? "is-ok" : "is-error"); }
  }

  /* ---------- telas ---------- */
  function ir(v, dados) {
    dados = dados || {};
    vista = v;
    if (v === "cadastro") {
      mostrar(abas("cadastro") + '<form class="conta-form" data-form="cadastro" novalidate>' +
        campo("conta-nome", "Seu nome", "text", 'autocomplete="name" maxlength="120" required') +
        campo("conta-tel", "WhatsApp (opcional)", "tel", 'autocomplete="tel" inputmode="tel" maxlength="20" placeholder="(71) 90000-0000"') +
        campo("conta-email", "E-mail", "email", 'autocomplete="email" required') +
        campo("conta-senha", "Senha (mínimo 8 caracteres)", "password", 'autocomplete="new-password" minlength="8" required') +
        '<label class="conta-check"><input type="checkbox" id="conta-ok" required> <span>Li e concordo com a <a href="privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label>' +
        STATUS_P + '<button type="submit" class="btn btn--primary">Criar conta</button></form>', "Criar conta");
    } else if (v === "esqueci") {
      mostrar('<form class="conta-form" data-form="esqueci" novalidate>' +
        '<p class="form-hint">Digite o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.</p>' +
        campo("conta-email", "E-mail", "email", 'autocomplete="email" required') +
        STATUS_P + '<button type="submit" class="btn btn--primary">Enviar link</button>' +
        '<button type="button" class="conta-link" data-vista="login">Voltar para entrar</button></form>', "Recuperar senha");
    } else if (v === "confirmar") {
      mostrar('<div class="conta-form"><p><strong>Quase lá!</strong></p>' +
        "<p>Enviamos um link de confirmação para <strong>" + esc(dados.email || "") + "</strong>. Abra o e-mail (olhe também o spam) e toque no link para ativar a conta.</p>" +
        '<button type="button" class="btn btn--ghost" data-vista="login">Já confirmei, quero entrar</button></div>', "Confirme seu e-mail");
    } else if (v === "novasenha") {
      mostrar('<form class="conta-form" data-form="novasenha" novalidate>' +
        '<p class="form-hint">Escolha uma nova senha para a sua conta.</p>' +
        campo("conta-senha", "Nova senha (mínimo 8 caracteres)", "password", 'autocomplete="new-password" minlength="8" required') +
        campo("conta-senha2", "Repita a nova senha", "password", 'autocomplete="new-password" minlength="8" required') +
        STATUS_P + '<button type="submit" class="btn btn--primary">Salvar nova senha</button></form>', "Nova senha");
    } else if (v === "conta") {
      verConta(dados);
      return;
    } else {
      vista = "login";
      mostrar(abas("login") + '<form class="conta-form" data-form="login" novalidate>' +
        campo("conta-email", "E-mail", "email", 'autocomplete="email" required') +
        campo("conta-senha", "Senha", "password", 'autocomplete="current-password" required') +
        STATUS_P + '<button type="submit" class="btn btn--primary">Entrar</button>' +
        '<button type="button" class="conta-link" data-vista="esqueci">Esqueci minha senha</button></form>', "Entrar");
      if (dados.aviso) aviso(dados.aviso, !dados.erro);
    }
    foco();
  }

  function pedidoHtml(p) {
    var itens = Array.isArray(p.itens) ? p.itens : [];
    var soma = 0, todos = itens.length > 0;
    itens.forEach(function (i) { if (i.preco == null || isNaN(Number(i.preco))) todos = false; else soma += Number(i.preco); });
    var data = "";
    try { data = new Date(p.criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }); } catch (e) {}
    return '<li class="conta-pedido"><div class="conta-pedido__top"><strong>Pedido #' + esc(p.numero) + '</strong>' +
      '<span class="conta-chip">' + esc(STATUS[p.status] || p.status) + "</span></div>" +
      '<span class="conta-pedido__data">' + esc(data) + "</span>" +
      '<ul class="conta-pedido__itens">' + itens.map(function (i) {
        var ficha = ["Cód. " + (i.codigo || ""), LENTES[i.lentes] || "", i.preco != null && !isNaN(Number(i.preco)) ? moeda(i.preco) : ""].filter(Boolean).join(" · ");
        return "<li>" + esc(i.nome) + "<small>" + esc(ficha) + "</small></li>";
      }).join("") + "</ul>" +
      (todos ? "<span>Total dos itens: <strong>" + esc(moeda(soma)) + "</strong> <small>(lentes não incluídas)</small></span>" : "") +
      "</li>";
  }

  function verConta(dados) {
    var s = SB.sessao();
    if (!s) { ir("login"); return; }
    mostrar('<p class="form-hint">Carregando…</p>', "Minha conta");
    Promise.all([
      SB.perfil().catch(function () { return null; }),
      SB.listarMeusPedidos().catch(function (e) { return e instanceof Error ? e : new Error("Erro ao carregar os pedidos."); }),
      SB.ehAdmin()
    ]).then(function (r) {
      if (vista !== "conta") return;
      var perfil = r[0] || {}, pedidos = r[1], admin = r[2];
      if (pedidos instanceof Error && /Sessão expirada|Entre/i.test(pedidos.message)) { mudou(); ir("login", { aviso: "Sua sessão expirou. Entre de novo.", erro: true }); return; }
      var nome = perfil.nome || s.nome || "";
      var lista = Array.isArray(pedidos)
        ? (pedidos.length
            ? '<ul class="conta-pedidos">' + pedidos.map(pedidoHtml).join("") + "</ul>"
            : '<p class="form-hint">Você ainda não tem pedidos. Os pedidos que finalizar pelo WhatsApp com a conta ligada aparecem aqui.</p>')
        : '<p class="form-status is-error">' + esc(pedidos.message) + "</p>";
      mostrar(
        "<p>" + (nome ? "Olá, <strong>" + esc(nome) + "</strong>." : "Olá!") + ' <span class="form-hint">' + esc(s.email) + "</span></p>" +
        '<form class="conta-form conta-sec" data-form="perfil" novalidate>' +
          campo("conta-nome", "Nome", "text", 'autocomplete="name" maxlength="120" value="' + esc(nome) + '"') +
          campo("conta-tel", "WhatsApp", "tel", 'autocomplete="tel" inputmode="tel" maxlength="20" value="' + esc(perfil.telefone || s.telefone || "") + '"') +
          STATUS_P + '<button type="submit" class="btn btn--ghost">Salvar dados</button></form>' +
        '<div class="conta-sec"><h3>Meus pedidos</h3>' + lista + "</div>" +
        '<div class="conta-acoes">' +
          (admin ? '<a class="btn btn--primary" href="admin.html">Abrir painel</a>' : "") +
          '<button type="button" class="btn btn--ghost" data-acao="sair">Sair</button></div>',
        "Minha conta");
      if (dados && dados.boasVindas) aviso(dados.boasVindas, true);
    });
  }

  /* ---------- envio dos formulários ---------- */
  function valor(f, id, aparar) {
    var el = $("#" + id, f);
    if (!el) return "";
    return aparar === false ? el.value : el.value.trim();
  }
  function submeter(f) {
    var tipo = f.getAttribute("data-form");
    var falha = function (e) { ocupado(f, false); status(e && e.message ? e.message : "Algo deu errado. Tente de novo.", false); };

    if (tipo === "login") {
      var em = valor(f, "conta-email"), sn = valor(f, "conta-senha", false);
      if (!emailOk(em) || !sn) { status("Informe e-mail e senha.", false); return; }
      ocupado(f, true); status("");
      SB.entrar(em, sn).then(function () { mudou(); ir("conta"); }, falha);

    } else if (tipo === "cadastro") {
      var nome = valor(f, "conta-nome"), tel = valor(f, "conta-tel"), email = valor(f, "conta-email"), senha = valor(f, "conta-senha", false);
      if (!nome) { status("Informe seu nome.", false); return; }
      if (!emailOk(email)) { status("Confira o e-mail digitado.", false); return; }
      if (senha.length < 8) { status("A senha precisa ter pelo menos 8 caracteres.", false); return; }
      if (!$("#conta-ok", f).checked) { status("Aceite a Política de Privacidade para criar a conta.", false); return; }
      ocupado(f, true); status("");
      SB.cadastrar(email, senha, nome, tel).then(function (r) {
        if (r.logado) { mudou(); ir("conta", { boasVindas: "Conta criada! Bem-vindo(a)." }); }
        else ir("confirmar", { email: email });
      }, falha);

    } else if (tipo === "esqueci") {
      var e2 = valor(f, "conta-email");
      if (!emailOk(e2)) { status("Confira o e-mail digitado.", false); return; }
      ocupado(f, true); status("");
      SB.recuperar(e2).then(function () {
        ocupado(f, false);
        status("Se esse e-mail tiver conta, enviamos o link. Olhe também o spam.", true);
      }, falha);

    } else if (tipo === "novasenha") {
      var a = valor(f, "conta-senha", false), b = valor(f, "conta-senha2", false);
      if (a.length < 8) { status("A senha precisa ter pelo menos 8 caracteres.", false); return; }
      if (a !== b) { status("As duas senhas não são iguais.", false); return; }
      ocupado(f, true); status("");
      SB.definirSenha(a).then(function () { mudou(); ir("conta", { boasVindas: "Senha alterada com sucesso." }); }, falha);

    } else if (tipo === "perfil") {
      var n = valor(f, "conta-nome"), t = valor(f, "conta-tel");
      if (!n) { status("Informe seu nome.", false); return; }
      ocupado(f, true); status("");
      SB.atualizarPerfil({ nome: n, telefone: t.replace(/\D/g, "").slice(0, 20) || null }).then(function () {
        ocupado(f, false); mudou(); status("Dados salvos.", true);
      }, falha);
    }
  }

  /* ---------- início ---------- */
  function iniciar() {
    estilos();
    botao();
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("[data-conta-abrir]");
      if (a) { e.preventDefault(); abrir(); }
    });
    SB.retornoDeLink().then(function (r) {
      if (!r) return;
      if (r.erro) { abrir("login", { aviso: r.erro, erro: true }); return; }
      mudou();
      if (r.tipo === "recovery") abrir("novasenha");
      else abrir("conta", { boasVindas: "E-mail confirmado! Sua conta está pronta." });
    });
  }

  window.OticaConta = { abrir: abrir, logado: function () { return !!SB.sessao(); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
