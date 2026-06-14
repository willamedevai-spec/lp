/**
 * WILLAME SILVA — PREMIUM PORTFOLIO JS
 * Author: Willame Silva | willamesilva.dev
 * Version: 1.0.0
 */

"use strict";

/* ═══════════════════════════════════════════════════════
   1. UTILS
═══════════════════════════════════════════════════════ */

/** Throttle: limita chamadas de função de alta frequência */
const throttle = (fn, ms) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last < ms) return;
    last = now;
    fn(...args);
  };
};

/** Seleciona elemento */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═══════════════════════════════════════════════════════
   2. HEADER SCROLL
═══════════════════════════════════════════════════════ */
const initHeader = () => {
  const header = $("#header");
  if (!header) return;

  const onScroll = throttle(() => {
    header.classList.toggle("header--scrolled", window.scrollY > 20);
  }, 100);

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // estado inicial
};

/* ═══════════════════════════════════════════════════════
   3. MENU MOBILE (HAMBURGER)
═══════════════════════════════════════════════════════ */
const initMobileMenu = () => {
  const hamburger = $("#hamburger");
  const menu = $("#mobile-menu");
  const links = $$(".mobile-menu__link");
  if (!hamburger || !menu) return;

  const toggle = (force) => {
    const open =
      typeof force === "boolean"
        ? force
        : !hamburger.classList.contains("is-open");
    hamburger.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  hamburger.addEventListener("click", () => toggle());

  links.forEach((link) => link.addEventListener("click", () => toggle(false)));

  // Fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !hamburger.contains(e.target))
      toggle(false);
  });

  // Fecha com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggle(false);
  });
};

/* ═══════════════════════════════════════════════════════
   4. SCROLL REVEAL (Intersection Observer)
═══════════════════════════════════════════════════════ */
const initScrollReveal = () => {
  const items = $$(".reveal");
  if (!items.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );

  items.forEach((el) => obs.observe(el));
};

/* ═══════════════════════════════════════════════════════
   5. TECH CARDS — Animate skill bars on reveal
═══════════════════════════════════════════════════════ */
const initTechCards = () => {
  const cards = $$(".tech-card");
  if (!cards.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  cards.forEach((card) => obs.observe(card));
};

/* ═══════════════════════════════════════════════════════
   6. COUNTER ANIMATION (Stats)
═══════════════════════════════════════════════════════ */
const initCounters = () => {
  const nums = $$("[data-target]");
  if (!nums.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };

    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  nums.forEach((el) => obs.observe(el));
};

/* ═══════════════════════════════════════════════════════
   7. PORTFOLIO FILTER
═══════════════════════════════════════════════════════ */
const initPortfolioFilter = () => {
  const btns = $$(".filter-btn");
  const cards = $$(".project-card");
  if (!btns.length || !cards.length) return;

  const filter = (category) => {
    btns.forEach((b) => {
      const isActive = b.dataset.filter === category;
      b.classList.toggle("filter-btn--active", isActive);
      b.setAttribute("aria-selected", isActive);
    });

    cards.forEach((card) => {
      const match = category === "all" || card.dataset.category === category;
      if (match) {
        card.classList.remove("is-hidden");
        // Fade-in suave
        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";
        requestAnimationFrame(() => {
          card.style.transition = "opacity .4s ease, transform .4s ease";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });
      } else {
        card.classList.add("is-hidden");
      }
    });
  };

  btns.forEach((btn) => {
    btn.addEventListener("click", () => filter(btn.dataset.filter));
  });
};

/* ═══════════════════════════════════════════════════════
   8. BLOG FILTER
═══════════════════════════════════════════════════════ */
const initBlogFilter = () => {
  const btns = $$(".blog-filter");
  const cards = $$(".blog-card");
  if (!btns.length || !cards.length) return;

  const filter = (category) => {
    btns.forEach((b) =>
      b.classList.toggle(
        "blog-filter--active",
        b.dataset.blogFilter === category,
      ),
    );
    cards.forEach((card) => {
      const match =
        category === "all" || card.dataset.blogCategory === category;
      card.style.display = match ? "" : "none";
    });
  };

  btns.forEach((btn) =>
    btn.addEventListener("click", () => filter(btn.dataset.blogFilter)),
  );
};

/* ═══════════════════════════════════════════════════════
   9. CONTACT FORM VALIDATION
═══════════════════════════════════════════════════════ */
const initContactForm = () => {
  const submitBtn = $("#form-submit");
  if (!submitBtn) return;

  const rules = {
    nome: { required: true, minLen: 3, label: "Nome" },
    email: { required: true, email: true, label: "E-mail" },
    mensagem: { required: true, minLen: 10, label: "Mensagem" },
  };

  const getField = (id) => document.getElementById(id);
  const getError = (id) => document.getElementById(`${id}-error`);

  const validate = () => {
    let valid = true;

    Object.entries(rules).forEach(([id, rule]) => {
      const field = getField(id);
      const error = getError(id);
      if (!field || !error) return;

      const val = field.value.trim();
      let msg = "";

      if (rule.required && !val) {
        msg = `${rule.label} é obrigatório.`;
      } else if (rule.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        msg = "Informe um e-mail válido.";
      } else if (rule.minLen && val.length < rule.minLen) {
        msg = `${rule.label} deve ter pelo menos ${rule.minLen} caracteres.`;
      }

      field.classList.toggle("is-invalid", !!msg);
      error.textContent = msg;
      if (msg) valid = false;
    });

    return valid;
  };

  // Live validation
  Object.keys(rules).forEach((id) => {
    const field = getField(id);
    if (field) field.addEventListener("blur", validate);
  });

  submitBtn.addEventListener("click", () => {
    if (!validate()) return;

    // Simula envio → abre WhatsApp com dados preenchidos
    const nome = getField("nome").value.trim();
    const email = getField("email").value.trim();
    const telefone = getField("telefone")?.value.trim() || "";
    const empresa = getField("empresa")?.value.trim() || "";
    const mensagem = getField("mensagem").value.trim();

    const msg = encodeURIComponent(
      `Olá, Willame! Meu nome é ${nome}` +
        (empresa ? `, sou da empresa ${empresa}` : "") +
        `.\nE-mail: ${email}` +
        (telefone ? `\nTelefone: ${telefone}` : "") +
        `\n\nMensagem:\n${mensagem}`,
    );

    // Mostra sucesso
    const formEl = $("#contact-form");
    const successEl = $("#form-success");
    if (formEl && successEl) {
      formEl.hidden = true;
      successEl.hidden = false;
    }

    // Abre WhatsApp após 600ms
    setTimeout(() => {
      window.open(
        `https://wa.me/5585989131725?text=${msg}`,
        "_blank",
        "noopener,noreferrer",
      );
    }, 600);
  });
};

/* ═══════════════════════════════════════════════════════
   10. PARTICLES
═══════════════════════════════════════════════════════ */
const initParticles = () => {
  const container = $("#particles");
  if (!container) return;

  // Reduz partículas em motion-reduced
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const count = 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";

    const x = Math.random() * 100;
    const dur = 6 + Math.random() * 10;
    const delay = Math.random() * -15;
    const size = 1 + Math.random() * 2;

    p.style.cssText = `
      left: ${x}%;
      bottom: 0;
      width: ${size}px;
      height: ${size}px;
      --dur: ${dur}s;
      --delay: ${delay}s;
      opacity: 0;
    `;

    container.appendChild(p);
  }
};

/* ═══════════════════════════════════════════════════════
   11. SMOOTH SCROLL para links âncora
═══════════════════════════════════════════════════════ */
const initSmoothScroll = () => {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Atualiza foco para acessibilidade
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
};

/* ═══════════════════════════════════════════════════════
   12. ACTIVE NAV LINK (Scroll Spy)
═══════════════════════════════════════════════════════ */
const initScrollSpy = () => {
  const sections = $$("section[id]");
  const navLinks = $$(".nav__link");
  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle(
            "nav__link--active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      });
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
  );

  sections.forEach((s) => obs.observe(s));
};

/* ═══════════════════════════════════════════════════════
   13. PARALLAX HERO AURORA (leve, sem layout thrash)
═══════════════════════════════════════════════════════ */
const initParallax = () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const orbs = $$(".aurora__orb");
  if (!orbs.length) return;

  const speeds = [0.03, -0.02, 0.015];

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => {
          orb.style.transform = `translate(0, ${y * speeds[i]}px)`;
        });
        ticking = false;
      });
    },
    { passive: true },
  );
};

/* ═══════════════════════════════════════════════════════
   14. LAZY LOADING (imagens futuras com data-src)
═══════════════════════════════════════════════════════ */
const initLazyLoad = () => {
  const imgs = $$("img[data-src]");
  if (!imgs.length) return;

  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      });
    },
    { rootMargin: "200px" },
  );

  imgs.forEach((img) => obs.observe(img));
};

/* ═══════════════════════════════════════════════════════
   15. CURSOR GLOW (desktop only, sem performance hit)
═══════════════════════════════════════════════════════ */
const initCursorGlow = () => {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const glow = document.createElement("div");
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity .3s ease;
    will-change: left, top;
    left: -500px;
    top: -500px;
  `;
  document.body.appendChild(glow);

  let raf;
  let mx = -500,
    my = -500;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!raf) raf = requestAnimationFrame(updateGlow);
  });

  const updateGlow = () => {
    glow.style.left = mx + "px";
    glow.style.top = my + "px";
    raf = null;
  };

  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    glow.style.opacity = "1";
  });
};

/* ═══════════════════════════════════════════════════════
  16. INIT
═══════════════════════════════════════════════════════ */
const init = () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initTechCards();
  initCounters();
  initPortfolioFilter();
  initBlogFilter();
  initContactForm();
  initParticles();
  initSmoothScroll();
  initScrollSpy();
  initParallax();
  initLazyLoad();
  initCursorGlow();
};

// Inicia após DOM pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}