
document.addEventListener("DOMContentLoaded", () => {
    const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const movimentoAtivo = () => !reduzirMovimento.matches;

    // ==========================================
    // 1. ELEMENTOS VISUAIS DINÂMICOS
    // ==========================================

    const progresso = document.createElement("div");
    progresso.className = "scroll-progress";
    progresso.setAttribute("aria-hidden", "true");
    document.body.appendChild(progresso);

    const fundo = document.createElement("div");
    fundo.className = "gradient-background";
    fundo.setAttribute("aria-hidden", "true");
    document.body.prepend(fundo);

    const voltarTopo = document.createElement("button");
    voltarTopo.className = "back-to-top";
    voltarTopo.type = "button";
    voltarTopo.textContent = "↑";
    voltarTopo.setAttribute("aria-label", "Voltar ao topo");
    document.body.appendChild(voltarTopo);

    voltarTopo.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: movimentoAtivo() ? "smooth" : "instant"
        });
    });

    // ==========================================
    // 2. GRADIENTE DINÂMICO + SCROLL
    // ==========================================

    const perfil = document.querySelector(".profile-card");
    let scrollAgendado = false;

    function atualizarScroll() {
        const maxScroll = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
        );

        const porcentagem = maxScroll > 0
            ? Math.min(window.scrollY / maxScroll, 1)
            : 0;

        progresso.style.transform =
            `scaleX(${porcentagem})`;

        const tonalidade = 265 + porcentagem * 55;
        const posicao = 15 + porcentagem * 70;

        fundo.style.setProperty(
            "--gradient-hue",
            tonalidade.toFixed(1)
        );

        fundo.style.setProperty(
            "--gradient-position",
            `${posicao.toFixed(1)}%`
        );

        voltarTopo.classList.toggle(
            "show",
            window.scrollY > 450
        );

        // Parallax discreto no card de perfil
        if (perfil && movimentoAtivo() && window.innerWidth > 768) {
            const deslocamento = Math.min(window.scrollY * 0.08, 35);
            perfil.style.setProperty(
                "--parallax-y",
                `${deslocamento}px`
            );
        } else if (perfil) {
            perfil.style.setProperty("--parallax-y", "0px");
        }

        scrollAgendado = false;
    }

    function solicitarAtualizacao() {
        if (!scrollAgendado) {
            scrollAgendado = true;
            requestAnimationFrame(atualizarScroll);
        }
    }

    window.addEventListener("scroll", solicitarAtualizacao, {
        passive: true
    });

    window.addEventListener("resize", solicitarAtualizacao);
    atualizarScroll();

    // ==========================================
    // 3. ANIMAÇÃO DE ENTRADA DOS ELEMENTOS
    // ==========================================

    const elementos = document.querySelectorAll(
        ".hero-content, .profile-card, .section-head, " +
        ".project, .about-box, .contact"
    );

    const animarElemento = (elemento) => {
        elemento.classList.add("visivel");
    };

    if ("IntersectionObserver" in window && movimentoAtivo()) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animarElemento(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: "0px 0px -25px 0px"
        });

        elementos.forEach((elemento, indice) => {
            elemento.classList.add("animar");
            elemento.style.setProperty(
                "--delay",
                `${Math.min(indice % 3, 2) * 110}ms`
            );
            observer.observe(elemento);
        });
    } else {
        elementos.forEach(animarElemento);
    }

    // ==========================================
    // 4. EFEITO DE DIGITAÇÃO NO TÍTULO
    // ==========================================

    const titulo = document.querySelector("#typing-text");

    if (titulo && movimentoAtivo()) {
        const texto = titulo.textContent.trim();
        let indice = 0;

        titulo.textContent = "";
        titulo.classList.add("typing");

        function digitar() {
            if (!movimentoAtivo()) {
                titulo.textContent = texto;
                titulo.classList.remove("typing");
                return;
            }

            if (indice < texto.length) {
                titulo.textContent += texto.charAt(indice);
                indice++;
                setTimeout(digitar, 48);
            } else {
                titulo.classList.remove("typing");
            }
        }

        setTimeout(digitar, 350);
    }

    // ==========================================
    // 5. SPOTLIGHT NOS CARDS
    // ==========================================

    const cards = document.querySelectorAll(
        ".project, .about-box, .profile-card"
    );

    cards.forEach((card) => {
        card.classList.add("spotlight-card");

        card.addEventListener("pointermove", (evento) => {
            if (!movimentoAtivo() ||
                evento.pointerType === "touch") return;

            const area = card.getBoundingClientRect();

            card.style.setProperty(
                "--mouse-x",
                `${evento.clientX - area.left}px`
            );

            card.style.setProperty(
                "--mouse-y",
                `${evento.clientY - area.top}px`
            );
        });
    });

    // ==========================================
    // 6. MENU RESPONSIVO
    // ==========================================

    const botaoMenu = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".navlinks");

    function fecharMenu() {
        if (!botaoMenu || !menu) return;

        menu.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
        botaoMenu.textContent = "☰";
    }

    if (botaoMenu && menu) {
        botaoMenu.addEventListener("click", () => {
            const aberto = menu.classList.toggle("aberto");

            botaoMenu.setAttribute(
                "aria-expanded",
                String(aberto)
            );

            botaoMenu.setAttribute(
                "aria-label",
                aberto ? "Fechar menu" : "Abrir menu"
            );

            botaoMenu.textContent = aberto ? "✕" : "☰";
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", fecharMenu);
        });

        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") fecharMenu();
        });

        document.addEventListener("click", (evento) => {
            if (!evento.target.closest(".nav")) {
                fecharMenu();
            }
        });
    }

    // ==========================================
    // 7. MENU ATIVO CONFORME A SEÇÃO
    // ==========================================

    const links = document.querySelectorAll(".navlinks a");
    const secoes = document.querySelectorAll("section[id]");

    if ("IntersectionObserver" in window) {
        const observadorSecoes = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    links.forEach((link) => {
                        const ativo =
                            link.getAttribute("href") ===
                            `#${entry.target.id}`;

                        link.classList.toggle("ativo", ativo);

                        if (ativo) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-25% 0px -55% 0px"
            }
        );

        secoes.forEach((secao) => {
            observadorSecoes.observe(secao);
        });
    }

    // ==========================================
    // 8. EFEITO MAGNÉTICO NOS BOTÕES
    // ==========================================

    document.querySelectorAll(".btn").forEach((botao) => {
        botao.classList.add("magnetic-btn");

        botao.addEventListener("pointermove", (evento) => {
            if (!movimentoAtivo() ||
                evento.pointerType === "touch") return;

            const area = botao.getBoundingClientRect();

            const x = evento.clientX - area.left - area.width / 2;
            const y = evento.clientY - area.top - area.height / 2;

            botao.style.setProperty("--magnetic-x", `${x * 0.10}px`);
            botao.style.setProperty("--magnetic-y", `${y * 0.10}px`);
        });

        botao.addEventListener("pointerleave", () => {
            botao.style.setProperty("--magnetic-x", "0px");
            botao.style.setProperty("--magnetic-y", "0px");
        });
    });

    // ==========================================
    // 9. ACESSIBILIDADE
    // ==========================================

    reduzirMovimento.addEventListener("change", () => {
        if (!movimentoAtivo()) {
            elementos.forEach(animarElemento);
        }
        solicitarAtualizacao();
    });

});
