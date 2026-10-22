/* ==========================================================================
   supabase.js — cliente mínimo do Supabase (sem biblioteca) + carregamento
   do catálogo. Configuração em js/config.js → supabase.
   Inclui: login/cadastro/recuperação de senha, perfil e pedidos do cliente,
   e as funções do painel admin (produtos, fotos, pedidos).
   ========================================================================== */
(function () {
  "use strict";

  var CFG = (window.OTICA_CONFIG || {}).supabase || {};
  var CAT = (window.OTICA_CONFIG || {}).catalogo || {};
  var URL_BASE = String(CFG.url || "").replace(/\/+$/, "");
  var KEY = CFG.anonKey || "";
  var BUCKET = CFG.bucket || "produtos";
  var SESSAO = "otica_admin_sessao";

  var SB = { configurado: !!(URL_BASE && KEY), bucket: BUCKET, url: URL_BASE };

  /* ---------- sessão do administrador ---------- */
  function lerSessao() { try { return JSON.parse(localStorage.getItem(SESSAO) || "null"); } catch (e) { return null; } }
  function gravarSessao(s) { try { if (s) localStorage.setItem(SESSAO, JSON.stringify(s)); else localStorage.removeItem(SESSAO); } catch (e) {} }
  SB.sessao = lerSessao;

  function mensagemDe(corpo, status) {
    if (corpo && typeof corpo === "object") {
      var m = corpo.message || corpo.msg || corpo.error_description || corpo.error || corpo.hint;
      if (m) return String(m);
    }
    return "Erro " + status;
  }
  function lerResposta(r) {
    var tipo = r.headers.get("content-type") || "";
    var p = tipo.indexOf("json") !== -1 ? r.json().catch(function () { return null; }) : r.text().catch(function () { return ""; });
    return p.then(function (corpo) {
      if (!r.ok) {
        var e = new Error(mensagemDe(corpo, r.status));
        e.status = r.status;
        e.codigo = (corpo && typeof corpo === "object" && (corpo.error_code || corpo.code)) || "";
        throw e;
      }
      return corpo;
    });
  }
  function comTempo(url, opcoes, ms) {
    var ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var t = ctl ? setTimeout(function () { ctl.abort(); }, ms || 20000) : null;
    if (ctl) opcoes.signal = ctl.signal;
    return fetch(url, opcoes).then(function (r) { if (t) clearTimeout(t); return r; }, function (e) {
      if (t) clearTimeout(t);
      throw new Error(e && e.name === "AbortError" ? "A conexão demorou demais. Tente de novo." : "Sem conexão com o servidor.");
    });
  }

  /* ---------- mensagens amigáveis ---------- */
  function traduzir(e) {
    var m = String((e && e.message) || "") + " " + String((e && e.codigo) || "");
    var t = (e && e.message) || "Algo deu errado. Tente de novo.";
    if (/invalid login|invalid_grant|invalid_credentials|credentials/i.test(m)) t = "E-mail ou senha incorretos.";
    else if (/already registered|already been registered|user_already_exists/i.test(m)) t = "Este e-mail já tem conta. Use a aba “Entrar”.";
    else if (/weak_password|password should be at least|known to be weak/i.test(m)) t = "Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.";
    else if (/same_password|different from the old/i.test(m)) t = "A nova senha precisa ser diferente da atual.";
    else if (/email not confirmed|email_not_confirmed/i.test(m)) t = "Confirme seu e-mail pelo link que enviamos antes de entrar.";
    else if (/rate limit|too many|over_email_send_rate_limit|over_request_rate_limit|security purposes/i.test(m)) t = "Muitas tentativas seguidas. Espere um pouco e tente de novo.";
    else if (/otp_expired|expired|invalid.*(token|link)|access_denied/i.test(m)) t = "Esse link expirou ou já foi usado. Peça um novo.";
    return new Error(t);
  }
  function paraErro(e) { var n = traduzir(e); n.status = e && e.status; return n; }

  /* ---------- login ---------- */
  function guardarToken(d, emailPadrao, ant) {
    var u = d.user || {}, meta = u.user_metadata || {};
    var s = {
      access_token: d.access_token, refresh_token: d.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + (d.expires_in || 3600),
      id: u.id || (ant && ant.id) || "",
      email: u.email || emailPadrao || (ant && ant.email) || "",
      nome: meta.nome || (ant && ant.nome) || "",
      telefone: meta.telefone || (ant && ant.telefone) || ""
    };
    gravarSessao(s);
    return s;
  }
  /* id do usuário logado (sessões antigas não tinham "id": lê do token) */
  function uid(s) {
    s = s || lerSessao();
    if (!s) return "";
    if (s.id) return s.id;
    try {
      var p = String(s.access_token).split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(p)).sub || "";
    } catch (e) { return ""; }
  }
  function urlRetorno() { return encodeURIComponent(window.location.origin + "/"); }

  SB.entrar = function (email, senha) {
    return comTempo(URL_BASE + "/auth/v1/token?grant_type=password", {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: senha })
    }).then(lerResposta).then(function (d) { return guardarToken(d, email); }).catch(function (e) { throw paraErro(e); });
  };
  function renovar() {
    var s = lerSessao();
    if (!s || !s.refresh_token) return Promise.reject(new Error("Sessão expirada. Entre de novo."));
    return comTempo(URL_BASE + "/auth/v1/token?grant_type=refresh_token", {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: s.refresh_token })
    }).then(lerResposta).then(function (d) { return guardarToken(d, s.email, s); }).catch(function (e) {
      gravarSessao(null);
      throw new Error("Sessão expirada. Entre de novo.");
    });
  }
  SB.sair = function () {
    var s = lerSessao();
    gravarSessao(null);
    if (s) fetch(URL_BASE + "/auth/v1/logout", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + s.access_token } }).catch(function () {});
  };

  /* ---------- conta do cliente ---------- */
  /* cria a conta; resolve { logado: true } se já entrou, ou { logado: false } se precisa confirmar o e-mail */
  SB.cadastrar = function (email, senha, nome, telefone) {
    var meta = { nome: nome || "" };
    if (telefone) meta.telefone = String(telefone).replace(/\D/g, "").slice(0, 20);
    return comTempo(URL_BASE + "/auth/v1/signup?redirect_to=" + urlRetorno(), {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: senha, data: meta })
    }).then(lerResposta).then(function (d) {
      if (d && d.access_token) { guardarToken(d, email); return { logado: true }; }
      return { logado: false };
    }).catch(function (e) { throw paraErro(e); });
  };
  /* envia o e-mail de recuperação (sempre "ok", para não revelar se o e-mail existe) */
  SB.recuperar = function (email) {
    return comTempo(URL_BASE + "/auth/v1/recover?redirect_to=" + urlRetorno(), {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    }).then(lerResposta).then(function () { return true; }).catch(function (e) {
      if (e && e.status === 429) throw paraErro(e);
      return true;
    });
  };
  /* define a nova senha (usuário já logado pelo link de recuperação) */
  SB.definirSenha = function (senha) {
    return req("PUT", "/auth/v1/user", {
      auth: true, body: JSON.stringify({ password: senha }), headers: { "Content-Type": "application/json" }
    }).catch(function (e) { throw paraErro(e); });
  };
  /* lê o link do e-mail (confirmação de conta / recuperar senha) quando o cliente volta ao site.
     Resolve null se não há link; { tipo } se entrou; { erro } se o link falhou. Nunca rejeita. */
  SB.retornoDeLink = function () {
    try {
      var p = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
      var token = p.get("access_token"), erro = p.get("error_description") || p.get("error");
      if (!token && !erro) return Promise.resolve(null);
      var tipo = p.get("type") || "signup", refresh = p.get("refresh_token") || "", dura = Number(p.get("expires_in")) || 3600;
      var codigo = p.get("error_code") || "";
      try { history.replaceState(null, "", window.location.pathname + window.location.search); } catch (x) {}
      if (!token) return Promise.resolve({ erro: traduzir({ message: (erro || "").replace(/\+/g, " "), codigo: codigo }).message });
      return comTempo(URL_BASE + "/auth/v1/user", { method: "GET", headers: { apikey: KEY, Authorization: "Bearer " + token } })
        .then(lerResposta).then(function (u) {
          guardarToken({ access_token: token, refresh_token: refresh, expires_in: dura, user: u }, "");
          return { tipo: tipo };
        }).catch(function () {
          return { erro: "Não foi possível validar o link. Tente entrar com seu e-mail e senha." };
        });
    } catch (e) { return Promise.resolve(null); }
  };

  /* ---------- requisição (com token do usuário só quando pedido) ---------- */
  /* auth: true → envia o token de quem está logado (cliente ou admin); o RLS do banco decide o que cada um pode */
  function req(metodo, caminho, opc) {
    opc = opc || {};
    function uma() {
      var h = { apikey: KEY };
      var s = opc.auth ? lerSessao() : null;
      if (opc.auth) {
        if (!s) return Promise.reject(new Error("Entre para continuar."));
        h.Authorization = "Bearer " + s.access_token;
      }
      for (var k in (opc.headers || {})) h[k] = opc.headers[k];
      return comTempo(URL_BASE + caminho, { method: metodo, headers: h, body: opc.body }, opc.tempo).then(lerResposta);
    }
    return uma().catch(function (e) {
      if (opc.auth && (e.status === 401 || /jwt/i.test(e.message)) && !opc._r) {
        opc._r = true;
        return renovar().then(uma);
      }
      throw e;
    });
  }
  function json(o) { return { body: JSON.stringify(o), headers: { "Content-Type": "application/json", Prefer: "return=representation" } }; }

  /* ---------- produtos ---------- */
  SB.listarProdutos = function (admin) {
    return req("GET", "/rest/v1/produtos?select=*&order=criado_em.desc" + (admin ? "" : "&ativo=eq.true"), { auth: !!admin });
  };
  SB.criarProduto = function (obj) {
    var j = json(obj);
    return req("POST", "/rest/v1/produtos", { auth: true, body: j.body, headers: j.headers }).then(function (r) { return Array.isArray(r) ? r[0] : r; });
  };
  SB.atualizarProduto = function (id, obj) {
    var j = json(obj);
    return req("PATCH", "/rest/v1/produtos?id=eq." + encodeURIComponent(id), { auth: true, body: j.body, headers: j.headers }).then(function (r) { return Array.isArray(r) ? r[0] : r; });
  };
  SB.apagarProduto = function (id) {
    return req("DELETE", "/rest/v1/produtos?id=eq." + encodeURIComponent(id), { auth: true });
  };

  /* ---------- perfil e pedidos do cliente ---------- */
  SB.perfil = function () {
    var id = uid();
    if (!id) return Promise.resolve(null);
    return req("GET", "/rest/v1/perfis?select=*&id=eq." + encodeURIComponent(id), { auth: true }).then(function (r) { return (Array.isArray(r) && r[0]) || null; });
  };
  SB.atualizarPerfil = function (dados) {
    var s = lerSessao(), id = uid(s);
    if (!id) return Promise.reject(new Error("Entre para continuar."));
    var j = json(dados);
    function lembrar() {
      if (s) { if (dados.nome !== undefined) s.nome = dados.nome || ""; if (dados.telefone !== undefined) s.telefone = dados.telefone || ""; gravarSessao(s); }
    }
    return req("PATCH", "/rest/v1/perfis?id=eq." + encodeURIComponent(id), { auth: true, body: j.body, headers: j.headers }).then(function (r) {
      if (Array.isArray(r) && r.length) { lembrar(); return r[0]; }
      /* ainda não existe linha de perfil para esta conta: cria */
      var novo = { id: id, nome: dados.nome || null, telefone: dados.telefone || null };
      if (s && s.email) novo.email = s.email;
      var jn = json(novo);
      return req("POST", "/rest/v1/perfis", { auth: true, body: jn.body, headers: jn.headers }).then(function (c) {
        lembrar(); return Array.isArray(c) ? c[0] : c;
      });
    });
  };
  SB.listarMeusPedidos = function () {
    var id = uid();
    if (!id) return Promise.reject(new Error("Entre para continuar."));
    return req("GET", "/rest/v1/pedidos?select=*&order=criado_em.desc&user_id=eq." + encodeURIComponent(id), { auth: true });
  };
  SB.criarPedido = function (obj) {
    var id = uid();
    if (!id) return Promise.reject(new Error("Entre para continuar."));
    var j = json({ user_id: id, cliente_nome: obj.cliente_nome, itens: obj.itens });
    return req("POST", "/rest/v1/pedidos", { auth: true, body: j.body, headers: j.headers }).then(function (r) { return Array.isArray(r) ? r[0] : r; });
  };

  /* ---------- administração (o banco decide: função eh_admin()) ---------- */
  SB.ehAdmin = function () {
    if (!lerSessao()) return Promise.resolve(false);
    return req("POST", "/rest/v1/rpc/eh_admin", { auth: true, body: "{}", headers: { "Content-Type": "application/json" } })
      .then(function (r) { return r === true; }, function () { return false; });
  };
  SB.listarPedidos = function () {
    return req("GET", "/rest/v1/pedidos?select=*&order=criado_em.desc", { auth: true });
  };
  SB.listarPerfis = function () {
    return req("GET", "/rest/v1/perfis?select=*", { auth: true });
  };
  SB.atualizarPedido = function (id, dados) {
    var j = json(dados);
    return req("PATCH", "/rest/v1/pedidos?id=eq." + encodeURIComponent(id), { auth: true, body: j.body, headers: j.headers }).then(function (r) {
      if (Array.isArray(r) && !r.length) throw new Error("Não foi possível salvar (sem permissão ou pedido não encontrado).");
      return Array.isArray(r) ? r[0] : r;
    });
  };

  /* ---------- fotos (Storage) ---------- */
  function caminhoFoto(path) { return path.split("/").map(encodeURIComponent).join("/"); }
  SB.enviarFoto = function (path, blob) {
    return req("POST", "/storage/v1/object/" + BUCKET + "/" + caminhoFoto(path), {
      auth: true, body: blob, tempo: 60000,
      headers: { "Content-Type": blob.type || "image/webp", "x-upsert": "true", "cache-control": "max-age=31536000" }
    }).then(function () { return SB.urlFoto(path); });
  };
  SB.apagarFoto = function (path) {
    return req("DELETE", "/storage/v1/object/" + BUCKET + "/" + caminhoFoto(path), { auth: true }).catch(function () {});
  };
  SB.urlFoto = function (path) { return URL_BASE + "/storage/v1/object/public/" + BUCKET + "/" + caminhoFoto(path); };

  window.SB = SB;

  /* ---------- catálogo do site: produtos do Supabase + fotos da galeria ---------- */
  function deLocal(p) {
    var q = {};
    for (var k in p) q[k] = p[k];
    q.tipo = p.tipo || "produto";
    q.codigo = p.codigo || (q.tipo === "galeria" ? "G-" + p.id : String(p.id));
    q.marca = p.marca || ""; q.modelo = p.modelo || "";
    q.preco = p.preco == null ? null : Number(p.preco);
    return q;
  }
  function deRemoto(r) {
    var fotos = Array.isArray(r.fotos) ? r.fotos : [];
    var galeria = fotos.filter(function (f) { return f && f.url; }).map(function (f) { return { imagem: f.url, largura: f.w || 800, altura: f.h || 1000 }; });
    if (!galeria.length) return null;
    var p = {
      id: r.id, codigo: r.codigo || r.id, nome: r.nome || "", marca: r.marca || "", modelo: r.modelo || "",
      categoria: r.categoria || "", descricao: r.descricao || "", preco: r.preco == null ? null : Number(r.preco),
      imagem: galeria[0].imagem, largura: galeria[0].largura, altura: galeria[0].altura, alt: r.nome || "",
      destaque: !!r.destaque, tipo: "produto", remoto: true
    };
    if (galeria.length > 1) p.galeria = galeria;
    return p;
  }

  window.OticaDados = {
    erro: false,
    carregar: function () {
      var locais = (window.OTICA_CATALOGO || []).map(deLocal);
      if (CAT.mostrarGaleria === false) locais = locais.filter(function (p) { return p.tipo !== "galeria"; });
      if (!SB.configurado) return Promise.resolve(locais);
      return SB.listarProdutos(false).then(function (linhas) {
        var remotos = (linhas || []).map(deRemoto).filter(Boolean);
        try { localStorage.setItem("otica_cache_produtos", JSON.stringify({ t: Date.now(), lista: remotos })); } catch (e) {}
        return remotos.concat(locais);
      }).catch(function () {
        window.OticaDados.erro = true;
        var cache = [];
        try { cache = (JSON.parse(localStorage.getItem("otica_cache_produtos") || "{}").lista) || []; } catch (e) {}
        return cache.concat(locais);
      });
    }
  };
})();