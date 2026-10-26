
document.addEventListener("DOMContentLoaded", () => {

  // 1. Animações ao rolar a página
  const elementos = document.querySelectorAll(
    ".hero-content, .profile-card, .section-head, .project, .about-box, .contact"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visivel");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elementos.forEach((elemento) => {
    elemento.classList.add("animar");
    observer.observe(elemento);
  });

  // 2. Efeito de digitação
  const titulo = document.querySelector("#typing-text");
  const reduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (titulo && !reduzirMovimento) {
    const texto = titulo.textContent.trim();
    titulo.textContent = "";
    let indice = 0;

    function digitar() {
      if (indice < texto.length) {
        titulo.textContent += texto.charAt(indice);
        indice++;
        setTimeout(digitar, 55);
      }
    }

    digitar();
  }

  // 3. Menu para celular
  const menuBtn = document.querySelector(".menu-toggle");
  const navlinks = document.querySelector(".navlinks");

  if (menuBtn && navlinks) {
    menuBtn.addEventListener("click", () => {
      const aberto = navlinks.classList.toggle("aberto");
      menuBtn.setAttribute("aria-expanded", String(aberto));
      menuBtn.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu"
      );
      menuBtn.textContent = aberto ? "✕" : "☰";
    });

    navlinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navlinks.classList.remove("aberto");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Abrir menu");
        menuBtn.textContent = "☰";
      });
    });
  }

  // 4. Destaque da seção atual
  const links = document.querySelectorAll(".navlinks a");

  const secaoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => {
          const ativo = link.getAttribute("href") ===
            "#" + entry.target.id;

          link.classList.toggle("ativo", ativo);
        });
      }
    });
  }, { rootMargin: "-25% 0px -55% 0px" });

  document.querySelectorAll("section[id]").forEach((secao) => {
    secaoObserver.observe(secao);
  });

});
