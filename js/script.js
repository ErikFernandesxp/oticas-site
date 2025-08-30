// ===============================
// Configurações globais do site
// ===============================
const WHATSAPP_NUMERO = "5571984756524"; 
// 👉 Troque aqui o número quando precisar (DDD + número, sem espaços)


// ===============================
// Modo escuro / claro
// ===============================
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    // Salva preferência no localStorage
    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });

  // Carrega preferência ao abrir o site
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
}


// ===============================
// Menu mobile
// ===============================
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}


// ===============================
// Formulário Fale Conosco → WhatsApp
// ===============================
const contatoForm = document.getElementById("contatoForm");

if (contatoForm) {
  contatoForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const whats = document.getElementById("whats").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !whats || !mensagem) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const texto = `*Olá, meu nome é*%0A
*Nome:* ${nome}%0A
*WhatsApp:* ${whats}%0A
*Mensagem:* ${mensagem}`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;

    window.open(url, "_blank");
  });
}


// ===============================
// --- ORÇAMENTOS ---
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form.form");

  forms.forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = this.querySelector("input[type='text']").value;
      const whats = this.querySelector("input[type='tel']").value;
      const textarea = this.querySelector("textarea");
      const mensagem = textarea ? textarea.value : "";

      let texto = "";

      // Se for a página de Orçamentos
      if (document.title.includes("Orçamentos")) {
        const produto = this.querySelector("select").value;

        texto = `Olá, meu nome é *${nome}*.%0A` +
                `Meu WhatsApp: *${whats}*%0A` +
                `Produto de interesse: *${produto}*%0A` +
                `Mensagem: ${mensagem}`;
      } 
      // Se for a página de Fale Conosco (backup extra)
      else if (document.title.includes("Fale Conosco")) {
        texto = `Olá, meu nome é *${nome}*.%0A` +
                `Meu WhatsApp: *${whats}*%0A` +
                `${mensagem}`;
      }

      if (texto) {
        const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;
        window.open(url, "_blank");
      }
    });
  });
});
