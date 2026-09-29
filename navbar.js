/* ============================================================
   CapimmShare — Dock bar flutuante no topo (liquid glass)
   Uso: <script src="navbar.js" defer></script>
   ============================================================ */
(function () {
  'use strict';

  const BASE = 'https://capimmm.github.io/CapimmShare';

  /* ---------- Ícones SVG (stroke: currentColor) ---------- */
  const svg = (paths) =>
    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" ` +
    `stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ` +
    `stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const ICONS = {
    home: svg(`<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>`),
    info: svg(`<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"/>`),
    regras: svg(`<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>`),
    apoiar: svg(`<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>`),
    feedback: svg(`<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>`),
    back: svg(`<path d="M15 18l-6-6 6-6"/>`)
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

  /* ---------- Estilos (liquid glass) ---------- */
  const CSS = `
    .cs-dock{
      position:fixed;
      top:max(16px, env(safe-area-inset-top));
      left:50%;
      z-index:9999;
      transform:translateX(-50%) translateY(-16px);
      opacity:0;
      animation:csDockIn .9s cubic-bezier(0.16,1,0.3,1) .2s forwards;

      display:flex;
      align-items:center;
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
    }

    /* Linha de brilho especular no topo */
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
    }

    @keyframes csDockIn{
      to{opacity:1;transform:translateX(-50%) translateY(0)}
    }

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
        background .3s cubic-bezier(0.16,1,0.3,1),
        color .3s cubic-bezier(0.16,1,0.3,1),
        transform .35s cubic-bezier(0.34,1.56,0.64,1);
    }

    .cs-dock__item svg{
      display:block;
      transition:transform .4s cubic-bezier(0.34,1.56,0.64,1);
    }

    .cs-dock__item:hover{
      background:rgba(255,255,255,0.08);
      color:#f5f5f7;
      transform:translateY(-1px);
    }
    .cs-dock__item:hover svg{ transform:scale(1.08); }
    .cs-dock__item:active{ transform:scale(0.95); }

    .cs-dock__item.is-active{
      background:rgba(255,255,255,0.13);
      color:#fff;
      box-shadow:
        inset 0 1px 0 0 rgba(255,255,255,0.18),
        0 4px 14px -6px rgba(0,0,0,0.7);
    }
    .cs-dock__item.is-active::after{
      content:'';
      position:absolute;
      left:50%;
      bottom:-1px;
      width:14px;
      height:2px;
      border-radius:2px;
      background:#fff;
      transform:translateX(-50%);
      box-shadow:0 0 8px rgba(255,255,255,0.75);
    }

    .cs-dock__sep{
      width:1px;
      height:22px;
      margin:0 4px;
      background:rgba(255,255,255,0.12);
      flex:none;
    }

    .cs-dock__back{
      display:flex;
      align-items:center;
      justify-content:center;
      width:36px;
      height:36px;
      border-radius:12px;
      border:none;
      cursor:pointer;
      background:rgba(255,255,255,0.06);
      color:#c7c7cc;
      transition:
        background .3s cubic-bezier(0.16,1,0.3,1),
        color .3s cubic-bezier(0.16,1,0.3,1),
        transform .35s cubic-bezier(0.34,1.56,0.64,1);
    }
    .cs-dock__back:hover{
      background:rgba(255,255,255,0.13);
      color:#fff;
      transform:translateX(-2px);
    }
    .cs-dock__back:active{ transform:scale(0.92); }
    .cs-dock__back:disabled{
      opacity:.3;
      cursor:default;
      transform:none;
      background:rgba(255,255,255,0.04);
    }

    /* Responsivo */
    @media (max-width:600px){
      .cs-dock{ gap:1px; padding:5px; border-radius:18px; }
      .cs-dock__item{ padding:9px 11px; font-size:12.5px; gap:0; }
      .cs-dock__label{ display:none; }
      .cs-dock__item svg{ width:17px; height:17px; }
      .cs-dock__item.is-active .cs-dock__label{
        display:inline;
        margin-left:6px;
      }
      .cs-dock__sep{ height:20px; margin:0 2px; }
    }

    @media (prefers-reduced-motion: reduce){
      .cs-dock, .cs-dock__item, .cs-dock__item svg, .cs-dock__back{
        animation:none !important;
        transition:none !important;
        opacity:1;
        transform:translateX(-50%) translateY(0);
      }
    }

    /* Espaço pra dock não cobrir conteúdo */
    body{ padding-top:90px; }
    @media (max-width:600px){ body{ padding-top:82px; } }
  `;

  /* ---------- Constrói a dock ---------- */
  function buildDock() {
    const dock = document.createElement('nav');
    dock.className = 'cs-dock';
    dock.setAttribute('aria-label', 'Navegação principal');

    /* Botão voltar */
    const back = document.createElement('button');
    back.className = 'cs-dock__back';
    back.type = 'button';
    back.innerHTML = ICONS.back;
    back.setAttribute('aria-label', 'Voltar');
    if (window.history.length <= 1) back.disabled = true;
    back.addEventListener('click', () => {
      if (window.history.length > 1) window.history.back();
      else window.location.href = BASE + '/';
    });
    dock.appendChild(back);

    /* Separador */
    const sep = document.createElement('span');
    sep.className = 'cs-dock__sep';
    sep.setAttribute('aria-hidden', 'true');
    dock.appendChild(sep);

    /* Links */
    LINKS.forEach((link) => {
      const a = document.createElement('a');
      a.className = 'cs-dock__item';
      a.href = link.path === '/' ? BASE + '/' : BASE + link.path;

      const cleanPath = link.path.replace(/\/+$/, '') || '/';
      if (cleanPath === current || (cleanPath !== '/' && current.startsWith(cleanPath))) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }

      a.innerHTML = ICONS[link.icon] +
        `<span class="cs-dock__label">${link.label}</span>`;
      dock.appendChild(a);
    });

    document.body.appendChild(dock);
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.setAttribute('data-cs-dock', '');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function init() { injectStyles(); buildDock(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
