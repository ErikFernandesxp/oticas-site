/* ==========================================================================
   supabase.js — cliente mínimo do Supabase (sem biblioteca) + carregamento
   do catálogo. Configuração em js/config.js → supabase.
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
      if (!r.ok) { var e = new Error(mensagemDe(corpo, r.status)); e.status = r.status; throw e; }
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

  /* ---------- login ---------- */
  function guardarToken(d, emailPadrao) {
    var s = {
      access_token: d.access_token, refresh_token: d.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + (d.expires_in || 3600),
      email: (d.user && d.user.email) || emailPadrao || ""
    };
    gravarSessao(s);
    return s;
  }
  SB.entrar = function (email, senha) {
    return comTempo(URL_BASE + "/auth/v1/token?grant_type=password", {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: senha })
    }).then(lerResposta).then(function (d) { return guardarToken(d, email); }).catch(function (e) {
      if (/invalid login|invalid_grant|credentials/i.test(e.message)) e.message = "E-mail ou senha incorretos.";
      throw e;
    });
  };
  function renovar() {
    var s = lerSessao();
    if (!s || !s.refresh_token) return Promise.reject(new Error("Sessão expirada. Entre de novo."));
    return comTempo(URL_BASE + "/auth/v1/token?grant_type=refresh_token", {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: s.refresh_token })
    }).then(lerResposta).then(function (d) { return guardarToken(d, s.email); }).catch(function (e) {
      gravarSessao(null);
      throw new Error("Sessão expirada. Entre de novo.");
    });
  };
  SB.sair = function () {
    var s = lerSessao();
    gravarSessao(null);
    if (s) fetch(URL_BASE + "/auth/v1/logout", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + s.access_token } }).catch(function () {});
  };

  /* ---------- requisição (com token do admin só quando pedido) ---------- */
  function req(metodo, caminho, opc) {
    opc = opc || {};
    function uma() {
      var h = { apikey: KEY };
      var s = opc.admin ? lerSessao() : null;
      if (opc.admin) {
        if (!s) return Promise.reject(new Error("Entre para continuar."));
        h.Authorization = "Bearer " + s.access_token;
      }
      for (var k in (opc.headers || {})) h[k] = opc.headers[k];
      return comTempo(URL_BASE + caminho, { method: metodo, headers: h, body: opc.body }, opc.tempo).then(lerResposta);
    }
    return uma().catch(function (e) {
      if (opc.admin && (e.status === 401 || /jwt/i.test(e.message)) && !opc._r) {
        opc._r = true;
        return renovar().then(uma);
      }
      throw e;
    });
  }
  function json(o) { return { body: JSON.stringify(o), headers: { "Content-Type": "application/json", Prefer: "return=representation" } }; }

  /* ---------- produtos ---------- */
  SB.listarProdutos = function (admin) {
    return req("GET", "/rest/v1/produtos?select=*&order=criado_em.desc" + (admin ? "" : "&ativo=eq.true"), { admin: !!admin });
  };
  SB.criarProduto = function (obj) {
    var j = json(obj);
    return req("POST", "/rest/v1/produtos", { admin: true, body: j.body, headers: j.headers }).then(function (r) { return Array.isArray(r) ? r[0] : r; });
  };
  SB.atualizarProduto = function (id, obj) {
    var j = json(obj);
    return req("PATCH", "/rest/v1/produtos?id=eq." + encodeURIComponent(id), { admin: true, body: j.body, headers: j.headers }).then(function (r) { return Array.isArray(r) ? r[0] : r; });
  };
  SB.apagarProduto = function (id) {
    return req("DELETE", "/rest/v1/produtos?id=eq." + encodeURIComponent(id), { admin: true });
  };

  /* ---------- fotos (Storage) ---------- */
  function caminhoFoto(path) { return path.split("/").map(encodeURIComponent).join("/"); }
  SB.enviarFoto = function (path, blob) {
    return req("POST", "/storage/v1/object/" + BUCKET + "/" + caminhoFoto(path), {
      admin: true, body: blob, tempo: 60000,
      headers: { "Content-Type": blob.type || "image/webp", "x-upsert": "true", "cache-control": "max-age=31536000" }
    }).then(function () { return SB.urlFoto(path); });
  };
  SB.apagarFoto = function (path) {
    return req("DELETE", "/storage/v1/object/" + BUCKET + "/" + caminhoFoto(path), { admin: true }).catch(function () {});
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
