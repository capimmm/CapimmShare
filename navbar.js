/* ============================================================
   CapimmShare — Dock camaleão (topo fundido ↔ pílula flutuante)
   Uso: <script src="navbar.js" defer></script>
   ============================================================ */
(function () {
  'use strict';

  const BASE = 'https://capimmm.github.io/CapimmShare';

  /* ---------- Ícones SVG ---------- */
  const svg = (p) =>
    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" ` +
    `stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ` +
    `stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

  const ICONS = {
    home:     svg(`<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>`),
    info:     svg(`<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"/>`),
    regras:   svg(`<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>`),
    apoiar:   svg(`<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>`),
    feedback: svg(`<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>`)
  };

  const LINKS = [
    { label: 'Início',   path: '/',         icon: 'home' },
    { label: 'Infos',    path: '/infos',    icon: 'info' },
    { label: 'Regras',   path: '/regras',   icon: 'regras' },
    { label: 'Apoiar',   path: '/apoiar',   icon: 'apoiar' },
    { label: 'Feedback', path: '/feedback', icon: 'feedback' }
  ];

  /* ---------- Rota atual ---------- */
  function getCurrentPath() {
    let p = window.location.pathname
      .replace(/\/index\.html?$/i, '/')
      .replace(/\.html?$/i, '')
      .replace(/\/+$/, '');
    return p === '' ? '/' : p;
  }
  const current = getCurrentPath();

  /* ---------- Estilos ---------- */
  const CSS = `
    .cs-dock{
      position:fixed;
      left:50%;
      top:16px;
      z-index:9999;

      /* Estado flutuante (padrão) */
      width:calc(100% - 32px);
      max-width:620px;
      transform:translateX(-50%);

      display:flex;
      align-items:center;
      justify-content:center;
      gap:2px;
      padding:6px;

      border-radius:20px;
      background:
        linear-gradient(180deg,
          rgba(255,255,255,0.14) 0%,
          rgba(255,255,255,0.07) 45%,
          rgba(255,255,255,0.03) 100%);
      border:1px solid rgba(255,255,255,0.14);

      backdrop-filter:blur(50px) saturate(200%) brightness(1.08);
      -webkit-backdrop-filter:blur(50px) saturate(200%) brightness(1.08);

      box-shadow:
        inset 0 1px 0 0 rgba(255,255,255,0.30),
        inset 0 -1px 0 0 rgba(255,255,255,0.06),
        inset 0 0 24px 0 rgba(255,255,255,0.05),
        0 24px 48px -16px rgba(0,0,0,0.9),
        0 10px 24px -8px rgba(0,0,0,0.7);

      font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Inter','Segoe UI',Roboto,sans-serif;
      -webkit-font-smoothing:antialiased;
      letter-spacing:-0.011em;
      -webkit-tap-highlight-color:transparent;

      transition:
        top .55s cubic-bezier(0.32,0.72,0,1),
        width .55s cubic-bezier(0.32,0.72,0,1),
        max-width .55s cubic-bezier(0.32,0.72,0,1),
        padding .55s cubic-bezier(0.32,0.72,0,1),
        border-radius .55s cubic-bezier(0.32,0.72,0,1),
        background .55s cubic-bezier(0.32,0.72,0,1),
        box-shadow .55s cubic-bezier(0.32,0.72,0,1),
        border-color .55s cubic-bezier(0.32,0.72,0,1),
        backdrop-filter .55s cubic-bezier(0.32,0.72,0,1),
        -webkit-backdrop-filter .55s cubic-bezier(0.32,0.72,0,1);

      will-change:top,width,padding,border-radius,background;
    }

    /* Linha de brilho especular (só no modo flutuante) */
    .cs-dock::before{
      content:'';
      position:absolute;
      top:-1px;
      left:18%;
      right:18%;
      height:1px;
      border-radius:1px;
      background:linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);
      pointer-events:none;
      opacity:1;
      transition:opacity .4s cubic-bezier(0.32,0.72,0,1);
    }

    /* ---- Estado "no topo da página" (camuflado) ---- */
    .cs-dock.is-top{
      top:0;
      width:100%;
      max-width:100%;
      padding:12px 22px;
      border-radius:0 0 20px 20px;
      border-color:transparent;
      border-bottom-color:rgba(255,255,255,0.06);

      background:
        linear-gradient(180deg,
          rgba(10,10,12,0.72) 0%,
          rgba(10,10,12,0.55) 70%,
          rgba(10,10,12,0.00) 100%);

      backdrop-filter:blur(24px) saturate(140%);
      -webkit-backdrop-filter:blur(24px) saturate(140%);

      box-shadow:
        inset 0 -1px 0 0 rgba(255,255,255,0.05),
        0 12px 30px -22px rgba(0,0,0,0.9);
    }
    .cs-dock.is-top::before{ opacity:0; }

    .cs-dock__item{
      position:relative;
      display:flex;
      align-items:center;
      gap:8px;
      padding:9px 14px;
      border-radius:14px;
      font-size:13.5px;
      font-weight:600;
      color:#8e8e93;
      text-decoration:none;
      white-space:nowrap;

      transition:
        background .35s cubic-bezier(0.32,0.72,0,1),
        color .35s cubic-bezier(0.32,0.72,0,1),
        transform .4s cubic-bezier(0.34,1.56,0.64,1);
    }

    .cs-dock__item svg{
      display:block;
      transition:transform .45s cubic-bezier(0.34,1.56,0.64,1);
    }

    .cs-dock__item:hover{
      background:rgba(255,255,255,0.08);
      color:#f5f5f7;
      transform:translateY(-1px);
    }
    .cs-dock__item:hover svg{ transform:scale(1.10); }
    .cs-dock__item:active{ transform:scale(0.95); }

    /* Entrada dos itens */
    .cs-dock__item{
      animation:csItemIn .5s cubic-bezier(0.32,0.72,0,1) both;
    }
    @keyframes csItemIn{
      from{opacity:0;transform:translateY(-6px)}
      to{opacity:1;transform:translateY(0)}
    }

    @media (max-width:600px){
      .cs-dock{ gap:1px; padding:5px; }
      .cs-dock.is-top{ padding:10px 14px; }
      .cs-dock__item{ padding:9px 11px; font-size:12.5px; gap:0; }
      .cs-dock__label{ display:none; }
      .cs-dock__item svg{ width:17px; height:17px; }
      .cs-dock__sep{ height:20px; margin:0 2px; }
    }

    @media (prefers-reduced-motion: reduce){
      .cs-dock, .cs-dock__item, .cs-dock__item svg{
        transition:none !important;
        animation:none !important;
      }
    }

    /* Espaço pra dock não cobrir conteúdo */
    body{ padding-top:96px; }
    @media (max-width:600px){ body{ padding-top:86px; } }
  `;

  /* ---------- Monta a dock ---------- */
  function buildDock() {
    const dock = document.createElement('nav');
    dock.className = 'cs-dock';
    dock.setAttribute('aria-label', 'Navegação principal');

    LINKS.forEach((link, i) => {
      const cleanPath = link.path.replace(/\/+$/, '') || '/';

      /* Esconde o link ativo (você já está nele) */
      const isActive =
        cleanPath === current ||
        (cleanPath !== '/' && current.startsWith(cleanPath));
      if (isActive) return;

      const a = document.createElement('a');
      a.className = 'cs-dock__item';
      a.href = link.path === '/' ? BASE + '/' : BASE + link.path;
      a.style.animationDelay = (0.06 * i + 0.15) + 's';
      a.innerHTML = ICONS[link.icon] +
        `<span class="cs-dock__label">${link.label}</span>`;
      dock.appendChild(a);
    });

    /* Se só sobrou o Início (caso raro), não renderiza */
    if (dock.children.length === 0) return;

    document.body.appendChild(dock);
  }

  /* ---------- Comportamento de scroll (camaleão) ---------- */
  function bindScroll() {
    const dock = document.querySelector('.cs-dock');
    if (!dock) return;

    const THRESHOLD = 24;
    let lastState = null;
    let ticking = false;

    function update() {
      const isTop = window.scrollY < THRESHOLD;
      if (isTop !== lastState) {
        dock.classList.toggle('is-top', isTop);
        lastState = isTop;
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update(); // estado inicial
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  function injectStyles() {
    const s = document.createElement('style');
    s.setAttribute('data-cs-dock', '');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function init() {
    injectStyles();
    buildDock();
    bindScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
