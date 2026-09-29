/* ============================================================
   CapimmShare — Hotbar de navegação global
   Injeta automaticamente uma barra flutuante em qualquer página.
   Uso: <script src="/navbar.js" defer></script>
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Configuração ---------- */
  const BASE = 'https://capimmm.github.io/CapimmShare';

  const LINKS = [
    { label: 'Início',   path: '/',         icon: '🏠' },
    { label: 'Infos',    path: '/infos',    icon: 'ℹ️' },
    { label: 'Regras',   path: '/regras',   icon: '📋' },
    { label: 'Apoiar',   path: '/apoiar',   icon: '💜' },
    { label: 'Feedback', path: '/feedback', icon: '💬' },
  ];

  /* ---------- Detecta a rota atual ---------- */
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
    .cs-hotbar{
      position:fixed;
      left:50%;
      bottom:max(18px, env(safe-area-inset-bottom));
      transform:translateX(-50%) translateY(24px);
      z-index:9999;

      display:flex;
      align-items:center;
      gap:4px;
      padding:6px;

      background:linear-gradient(180deg, rgba(28,28,30,0.72) 0%, rgba(18,18,20,0.78) 100%);
      border:1px solid rgba(255,255,255,0.09);
      border-radius:20px;

      backdrop-filter:blur(40px) saturate(160%);
      -webkit-backdrop-filter:blur(40px) saturate(160%);

      box-shadow:
        0 1px 0 0 rgba(255,255,255,0.07) inset,
        0 24px 60px -24px rgba(0,0,0,0.95),
        0 8px 24px -12px rgba(0,0,0,0.8);

      opacity:0;
      animation:csHotbarIn .7s cubic-bezier(0.16,1,0.3,1) .35s forwards;

      font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Inter','Segoe UI',Roboto,sans-serif;
      -webkit-font-smoothing:antialiased;
      letter-spacing:-0.011em;
      -webkit-tap-highlight-color:transparent;
    }

    @keyframes csHotbarIn{
      to{opacity:1;transform:translateX(-50%) translateY(0)}
    }

    .cs-hotbar__item{
      position:relative;
      display:flex;
      align-items:center;
      gap:7px;
      padding:9px 13px;
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

    .cs-hotbar__item:hover{
      background:rgba(255,255,255,0.08);
      color:#f5f5f7;
      transform:translateY(-1px);
    }

    .cs-hotbar__item:active{
      transform:scale(0.95);
    }

    /* Item ativo */
    .cs-hotbar__item.is-active{
      background:rgba(255,255,255,0.12);
      color:#fff;
      box-shadow:
        0 1px 0 0 rgba(255,255,255,0.1) inset,
        0 4px 14px -6px rgba(0,0,0,0.7);
    }

    .cs-hotbar__item.is-active::after{
      content:'';
      position:absolute;
      left:50%;
      bottom:-1px;
      width:16px;
      height:2px;
      border-radius:2px;
      background:#fff;
      transform:translateX(-50%);
      box-shadow:0 0 8px rgba(255,255,255,0.7);
    }

    .cs-hotbar__icon{
      font-size:14px;
      line-height:1;
      display:inline-block;
      transition:transform .35s cubic-bezier(0.34,1.56,0.64,1);
    }

    .cs-hotbar__item:hover .cs-hotbar__icon{
      transform:scale(1.18) rotate(-4deg);
    }

    .cs-hotbar__sep{
      width:1px;
      height:22px;
      margin:0 4px;
      background:rgba(255,255,255,0.1);
      flex:none;
    }

    /* Botão voltar */
    .cs-hotbar__back{
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
      font-size:15px;
      line-height:1;

      transition:
        background .3s cubic-bezier(0.16,1,0.3,1),
        color .3s cubic-bezier(0.16,1,0.3,1),
        transform .35s cubic-bezier(0.34,1.56,0.64,1);
    }

    .cs-hotbar__back:hover{
      background:rgba(255,255,255,0.12);
      color:#fff;
      transform:translateX(-2px);
    }

    .cs-hotbar__back:active{
      transform:scale(0.92);
    }

    .cs-hotbar__back:disabled{
      opacity:.32;
      cursor:default;
      transform:none;
      background:rgba(255,255,255,0.04);
    }

    /* Ajuste pra telas pequenas */
    @media (max-width:560px){
      .cs-hotbar{
        gap:2px;
        padding:5px;
        border-radius:18px;
      }
      .cs-hotbar__item{
        padding:9px 10px;
        font-size:12.5px;
        gap:5px;
      }
      .cs-hotbar__label{
        display:none;
      }
      .cs-hotbar__icon{
        font-size:17px;
      }
      .cs-hotbar__item.is-active .cs-hotbar__label{
        display:inline;
      }
      .cs-hotbar__sep{
        height:20px;
        margin:0 2px;
      }
    }

    @media (prefers-reduced-motion: reduce){
      .cs-hotbar,
      .cs-hotbar__item,
      .cs-hotbar__icon,
      .cs-hotbar__back{
        animation:none !important;
        transition:none !important;
        opacity:1;
        transform:translateX(-50%) translateY(0);
      }
    }

    /* Evita que a hotbar cubra conteúdo no fim da página */
    body{ padding-bottom:88px; }
    @media (max-width:560px){ body{ padding-bottom:80px; } }
  `;

  /* ---------- Cria a hotbar ---------- */
  function buildHotbar() {
    const bar = document.createElement('nav');
    bar.className = 'cs-hotbar';
    bar.setAttribute('aria-label', 'Navegação principal');

    /* Botão voltar */
    const back = document.createElement('button');
    back.className = 'cs-hotbar__back';
    back.type = 'button';
    back.textContent = '‹';
    back.setAttribute('aria-label', 'Voltar');

    const canGoBack = window.history.length > 1;
    if (!canGoBack) back.disabled = true;

    back.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = BASE + '/';
      }
    });

    bar.appendChild(back);

    /* Separador */
    const sep = document.createElement('span');
    sep.className = 'cs-hotbar__sep';
    sep.setAttribute('aria-hidden', 'true');
    bar.appendChild(sep);

    /* Links */
    LINKS.forEach((link) => {
      const a = document.createElement('a');
      a.className = 'cs-hotbar__item';

      const href = link.path === '/' ? BASE + '/' : BASE + link.path;
      a.href = href;

      /* Marca ativo */
      const cleanPath = link.path.replace(/\/+$/, '') || '/';
      if (cleanPath === current || (cleanPath !== '/' && current.startsWith(cleanPath))) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }

      const icon = document.createElement('span');
      icon.className = 'cs-hotbar__icon';
      icon.textContent = link.icon;
      icon.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.className = 'cs-hotbar__label';
      label.textContent = link.label;

      a.appendChild(icon);
      a.appendChild(label);
      bar.appendChild(a);
    });

    document.body.appendChild(bar);
  }

  /* ---------- Injeta estilos e monta ---------- */
  function injectStyles() {
    const style = document.createElement('style');
    style.setAttribute('data-cs-hotbar', '');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function init() {
    injectStyles();
    buildHotbar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
