const ICON_JSON = 'https://cdn.jsdelivr.net/gh/helloanaroul/icons@refs/heads/main/icons-v2.json';
const LIB = 'https://cdn.jsdelivr.net/gh/helloanaroul/icons@refs/heads/main/icons.min.js';
const DB_URL = 'https://heelo-chat-default-rtdb.asia-southeast1.firebasedatabase.app';
const STYLES = ['all', 'bold', 'duotone', 'broken', 'line-duotone', 'linear', 'outline'];
const PAGE_SIZE = 200;

const state = { all: [], filtered: [], rendered: 0, style: 'all', query: '', loading: false, jsonBytes: 0 };
const $ = (sel) => document.querySelector(sel);

const CSS = `
:root{--bg:#fff;--fg:#000;--muted:#666;--border:#e5e5e5;--hover:#f5f5f5;--code:#f5f5f5}
[data-theme="dark"]{--bg:#0a0a0a;--fg:#f5f5f5;--muted:#999;--border:#262626;--hover:#1a1a1a;--code:#171717}
*{transition:background-color .35s ease,color .35s ease,border-color .35s ease,transform .25s ease,opacity .25s ease,box-shadow .25s ease}
body{background:var(--bg);color:var(--fg)}
.bordered{border:1px solid var(--border);border-radius:5px}
.hover-bg:hover{background:var(--hover);transform:translateY(-1px)}
.hover-bg:active{transform:scale(.97)}
.muted{color:var(--muted)}
.no-scrollbar::-webkit-scrollbar{display:none}
.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
.icon-cell{animation:fadeIn .35s ease both}
.icon-cell svg{width:18px;height:18px;transition:transform .25s ease,color .25s ease}
.icon-cell:hover svg{transform:scale(1.15)}
.icon-cell:hover{box-shadow:0 2px 8px rgba(0,0,0,.08)}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@media(min-width:640px){.icon-cell svg{width:20px;height:20px}}
@media(min-width:1024px){.icon-cell svg{width:22px;height:22px}}
.copied-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:100;animation:toastIn .3s ease both}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
pre{background:var(--code);border:1px solid var(--border);border-radius:5px;padding:16px;overflow-x:auto;font-size:13px;line-height:1.6}
code{font-family:ui-monospace,SFMono-Regular,monospace}
:not(pre)>code{background:var(--code);border:1px solid var(--border);border-radius:4px;padding:2px 6px;font-size:12px}
html{scroll-behavior:smooth}
.page.hidden{display:none}
.page{animation:pageIn .35s ease both}
@keyframes pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
#search:focus{border-color:var(--muted);box-shadow:0 0 0 3px rgba(128,128,128,.15)}
.filter-btn{transition:all .2s ease}
.filter-btn:hover{transform:translateY(-1px)}
#empty,#loading{animation:fadeIn .3s ease both}

.floating-actions{position:fixed;bottom:20px;left:20px;z-index:90;display:flex;align-items:center;gap:4px;padding:0 5px;height:44px;border-radius:50px;overflow:hidden;background:transparent;border:none;box-shadow:0 4px 16px rgba(0,0,0,.08);animation:fadeIn .4s ease both}
.floating-actions::before{content:"";position:absolute;top:1px;left:1px;right:1px;bottom:1px;background:var(--bg);border-radius:inherit;z-index:2;transform:scale(.98);transition:transform .4s ease}
.floating-actions:hover::before{transform:scale(1)}
.floating-actions > a,.floating-actions > button{position:relative;z-index:3;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%;color:var(--fg);background:transparent;border:none;cursor:pointer}
.floating-actions svg{width:20px;height:20px}
.floating-actions .bubble-layer{position:absolute;width:40px;height:40px;border-radius:50%;filter:blur(6px);z-index:1;pointer-events:none;opacity:1}
.bubble-1{background:#ff007f;top:-20%;left:-10%;animation:moveUpRight 6s ease-in-out infinite}
.bubble-2{background:#ff6a00;top:0%;left:10%;animation:moveDownLeft 5s ease-in-out infinite;animation-delay:1s}
.bubble-3{background:#ffcc00;top:20%;left:50%;animation:moveRight 4s ease-in-out infinite;animation-delay:2s}
.bubble-4{background:#00fff0;top:-20%;left:70%;animation:moveUpLeft 7s ease-in-out infinite;animation-delay:3s}
.bubble-5{background:#9d00ff;top:30%;left:-10%;animation:moveDownRight 3s ease-in-out infinite;animation-delay:4s}
.bubble-6{background:#ff007f;top:-10%;left:30%;animation:moveLeft 8s ease-in-out infinite;animation-delay:.5s}
.bubble-7{background:#ff6a00;top:40%;left:60%;animation:moveUp 6s ease-in-out infinite;animation-delay:1.5s}
@keyframes moveUpRight{0%{transform:translate(0,0)}25%{transform:translate(100%,-100%)}50%{transform:translate(-50%,50%)}75%{transform:translate(50%,-50%)}100%{transform:translate(0,0)}}
@keyframes moveDownLeft{0%{transform:translate(0,0)}25%{transform:translate(-100%,100%)}50%{transform:translate(50%,-50%)}75%{transform:translate(-50%,50%)}100%{transform:translate(0,0)}}
@keyframes moveRight{0%{transform:translate(0,0)}25%{transform:translate(100%,0)}50%{transform:translate(-100%,50%)}75%{transform:translate(50%,-50%)}100%{transform:translate(0,0)}}
@keyframes moveUpLeft{0%{transform:translate(0,0)}25%{transform:translate(-100%,-100%)}50%{transform:translate(50%,50%)}75%{transform:translate(-50%,-50%)}100%{transform:translate(0,0)}}
@keyframes moveDownRight{0%{transform:translate(0,0)}25%{transform:translate(100%,100%)}50%{transform:translate(-50%,-50%)}75%{transform:translate(50%,50%)}100%{transform:translate(0,0)}}
@keyframes moveLeft{0%{transform:translate(0,0)}25%{transform:translate(-100%,0)}50%{transform:translate(100%,-50%)}75%{transform:translate(-50%,50%)}100%{transform:translate(0,0)}}
@keyframes moveUp{0%{transform:translate(0,0)}25%{transform:translate(0,-100%)}50%{transform:translate(50%,50%)}75%{transform:translate(-50%,-50%)}100%{transform:translate(0,0)}}

#themeToggle{position:relative;z-index:3;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:transparent;border:none;cursor:pointer;color:var(--fg);overflow:hidden}
#themeToggle:hover{background:var(--hover)}
#themeToggle:active{transform:scale(.95)}
#themeToggle .icon-sun,#themeToggle .icon-moon{position:absolute;width:20px;height:20px;display:flex;align-items:center;justify-content:center;transition:transform .5s cubic-bezier(.4,0,.2,1),opacity .35s ease}
#themeToggle .icon-sun{opacity:0;transform:rotate(-90deg) scale(.5)}
#themeToggle .icon-moon{opacity:1;transform:rotate(0deg) scale(1)}
#themeToggle.is-dark .icon-sun{opacity:1;transform:rotate(0deg) scale(1)}
#themeToggle.is-dark .icon-moon{opacity:0;transform:rotate(90deg) scale(.5)}
#themeToggle svg{width:20px;height:20px}

.settings-panel{position:fixed;bottom:76px;left:20px;z-index:95;width:300px;background:var(--bg);border:1px solid var(--border);border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.12);padding:14px;animation:panelIn .25s ease both;transform-origin:bottom left}
@keyframes panelIn{from{opacity:0;transform:scale(.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.settings-panel.hidden{display:none}
.settings-panel h3{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:10px}
.setting-row{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:9px 0;font-size:13px;border-bottom:1px solid var(--border)}
.setting-row:last-child{border-bottom:none}
.setting-row .row-icon{width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;opacity:.75;flex-shrink:0}
.setting-row .row-icon svg{width:16px;height:16px}
.setting-row .label{color:var(--muted);text-align:left}
.setting-row .value{font-weight:600;font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
`;

const injectStyles = () => {
  const s = document.createElement('style');
  s.textContent = CSS;
  document.head.appendChild(s);
};

const homeHTML = `
<div id="pageHome" class="page flex-1 flex flex-col overflow-hidden">
  <div class="shrink-0 max-w-6xl w-full mx-auto px-6">
    <div class="pt-8 pb-5">
      <h1 class="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">Solar Icons</h1>
      <p class="muted text-sm sm:text-base max-w-2xl leading-relaxed">
        7000+ beautifully crafted open-source icons in 6 styles — click any icon to copy its <code>&lt;i&gt;</code> tag.
      </p>
    </div>
    <div class="mb-4">
      <input id="search" type="text" placeholder="Search icons..." class="w-full bordered px-4 py-3 text-sm outline-none" style="background:transparent">
    </div>
    <div id="filters" class="flex gap-2 mb-4 overflow-x-auto no-scrollbar whitespace-nowrap pb-1"></div>
  </div>
  <main id="scrollArea" class="flex-1 overflow-y-auto">
    <div class="max-w-6xl mx-auto px-6 pb-20">
      <div id="grid" class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2"></div>
      <p id="empty" class="hidden text-center muted text-sm mt-10">No icons found.</p>
      <p id="loading" class="hidden text-center muted text-sm mt-6">Loading...</p>
      <div id="sentinel" class="h-2"></div>
    </div>
  </main>
</div>`;

const docsHTML = `
<div id="pageDocs" class="page hidden flex-1 overflow-y-auto">
  <main class="max-w-3xl mx-auto px-6 py-10 pb-24">
    <section class="mb-14">
      <div class="inline-block text-xs font-semibold muted uppercase tracking-wider mb-3">Documentation</div>
      <h1 class="text-3xl sm:text-4xl font-bold mb-3">Solar Icons</h1>
      <p class="muted text-base leading-relaxed max-w-2xl">A lightweight, zero-dependency JavaScript loader that dynamically renders <a href="https://icon-sets.iconify.design/solar/" target="_blank" class="underline">Solar Icon Set</a> SVGs using simple <code>&lt;i&gt;</code> tags — no build step, no framework required.</p>
      <div class="flex flex-wrap gap-2 mt-5">
        <span class="bordered px-2.5 py-1 text-xs muted">MIT License</span>
        <span class="bordered px-2.5 py-1 text-xs muted">Zero Dependencies</span>
        <span class="bordered px-2.5 py-1 text-xs muted">Vanilla JS</span>
        <span class="bordered px-2.5 py-1 text-xs muted">CDN Ready</span>
      </div>
    </section>
    <section class="mb-14">
      <h2 class="text-xl font-semibold mb-3">Quick Start</h2>
      <p class="text-sm muted mb-4">Add the script to your HTML — production or development build:</p>
      <pre><code>&lt;script src="${LIB}"&gt;&lt;/script&gt;

&lt;script src="https://cdn.jsdelivr.net/gh/helloanaroul/icons@refs/heads/main/icons.js"&gt;&lt;/script&gt;</code></pre>
      <p class="text-sm muted mt-4">Then use any icon with a single <code>&lt;i&gt;</code> tag:</p>
      <pre><code>&lt;i name="home-bold"&gt;&lt;/i&gt;</code></pre>
    </section>
    <section class="mb-14">
      <h2 class="text-xl font-semibold mb-3">Usage</h2>
      <p class="text-sm muted mb-4">There are three ways to reference an icon:</p>
      <div class="space-y-6">
        <div><p class="text-xs font-semibold mb-2">Method 1 · Name attribute <span class="muted font-normal">(simplest)</span></p><pre class="!m-0"><code>&lt;i name="home-bold"&gt;&lt;/i&gt;</code></pre></div>
        <div><p class="text-xs font-semibold mb-2">Method 2 · Prefix + class</p><pre class="!m-0"><code>&lt;i class="solar-home-bold"&gt;&lt;/i&gt;</code></pre></div>
        <div><p class="text-xs font-semibold mb-2">Method 3 · Exact icon key as class</p><pre class="!m-0"><code>&lt;i class="home-bold"&gt;&lt;/i&gt;</code></pre></div>
      </div>
    </section>
    <section class="mb-14">
      <h2 class="text-xl font-semibold mb-3">Styling</h2>
      <p class="text-sm muted mb-4">Icons inherit <code>font-size</code> and <code>color</code> from their parent — style them like text:</p>
      <pre><code>i { font-size: 24px; color: #f97316; }</code></pre>
      <p class="text-sm muted mt-4 mb-2">Or inline:</p>
      <pre><code>&lt;i name="star-bold" style="font-size: 32px; color: gold;"&gt;&lt;/i&gt;</code></pre>
    </section>
    <section class="mb-14">
      <h2 class="text-xl font-semibold mb-3">Icon Styles</h2>
      <p class="text-sm muted mb-4">Solar icons follow the pattern <code>{name}-{style}</code>:</p>
      <div class="bordered overflow-hidden">
        <table class="w-full text-sm">
          <thead style="background:var(--hover)"><tr><th class="text-left px-4 py-2.5 font-semibold">Style</th><th class="text-left px-4 py-2.5 font-semibold">Example</th></tr></thead>
          <tbody>
            <tr class="border-t" style="border-color:var(--border)"><td class="px-4 py-2.5"><code>bold</code></td><td class="px-4 py-2.5"><code>home-bold</code></td></tr>
            <tr class="border-t" style="border-color:var(--border)"><td class="px-4 py-2.5"><code>linear</code></td><td class="px-4 py-2.5"><code>home-linear</code></td></tr>
            <tr class="border-t" style="border-color:var(--border)"><td class="px-4 py-2.5"><code>outline</code></td><td class="px-4 py-2.5"><code>home-outline</code></td></tr>
            <tr class="border-t" style="border-color:var(--border)"><td class="px-4 py-2.5"><code>broken</code></td><td class="px-4 py-2.5"><code>home-broken</code></td></tr>
            <tr class="border-t" style="border-color:var(--border)"><td class="px-4 py-2.5"><code>duotone</code></td><td class="px-4 py-2.5"><code>home-duotone</code></td></tr>
            <tr class="border-t" style="border-color:var(--border)"><td class="px-4 py-2.5"><code>bold-duotone</code></td><td class="px-4 py-2.5"><code>home-bold-duotone</code></td></tr>
          </tbody>
        </table>
      </div>
    </section>
    <section class="mb-14">
      <h2 class="text-xl font-semibold mb-3">Performance</h2>
      <div class="space-y-2">
        <div class="bordered p-3 text-sm flex gap-3"><span class="muted shrink-0">01</span><span>If no <code>&lt;i&gt;</code> tags are found on the page, <code>icons.json</code> is never fetched.</span></div>
        <div class="bordered p-3 text-sm flex gap-3"><span class="muted shrink-0">02</span><span>Only <code>&lt;i&gt;</code> tags with a <code>name</code> or <code>class</code> attribute are queried.</span></div>
        <div class="bordered p-3 flex gap-3 text-sm"><span class="muted shrink-0">03</span><span>Pure vanilla JavaScript — no jQuery, no frameworks, no dependencies.</span></div>
        <div class="bordered p-3 flex gap-3 text-sm"><span class="muted shrink-0">04</span><span>Icon aliases automatically resolve to their parent icon.</span></div>
      </div>
    </section>
    <section class="mb-14">
      <h2 class="text-xl font-semibold mb-3">License</h2>
      <p class="text-sm muted">MIT — free to use, modify, and distribute.</p>
    </section>
    <div class="bordered p-5 flex items-center justify-between">
      <div><div class="text-xs muted mb-1">Author</div><div class="text-sm font-semibold">Anaroul Hasan</div></div>
      <a href="https://github.com/helloanaroul/icons" target="_blank" class="text-sm px-3 py-2 rounded hover-bg flex items-center gap-1.5" style="border:1px solid var(--border)"><span>GitHub</span><i name="arrow-right-up-bold"></i></a>
    </div>
  </main>
</div>`;

const actionsHTML = `
<div id="floatingActions" class="floating-actions">
  <div class="bubble-layer bubble-1"></div>
  <div class="bubble-layer bubble-2"></div>
  <div class="bubble-layer bubble-3"></div>
  <div class="bubble-layer bubble-4"></div>
  <div class="bubble-layer bubble-5"></div>
  <div class="bubble-layer bubble-6"></div>
  <div class="bubble-layer bubble-7"></div>
  <button id="themeToggle" title="Toggle theme" aria-label="Toggle theme">
    <span class="icon-sun"><i name="sun-bold"></i></span>
    <span class="icon-moon"><i name="cloudy-moon-bold"></i></span>
  </button>
  <a id="navToggle" href="#docs" title="Documentation" aria-label="Documentation"></a>
  <a href="https://github.com/helloanaroul/icons" target="_blank" title="GitHub" aria-label="GitHub"><i name="code-file-bold"></i></a>
  <button id="settingsBtn" title="Stats" aria-label="Stats"><i name="bell-bing-bold"></i></button>
</div>`;

const panelHTML = `
<div id="settingsPanel" class="settings-panel hidden">
  <h3>Statistics</h3>
  <div class="setting-row">
    <span class="row-icon"><i name="eye-bold"></i></span>
    <span class="label">Visit</span>
    <span class="value" id="statVisit">—</span>
  </div>
  <div class="setting-row">
    <span class="row-icon"><i name="copy-bold"></i></span>
    <span class="label">Total Usage</span>
    <span class="value" id="statCopy">—</span>
  </div>
  <div class="setting-row">
    <span class="row-icon"><i name="bolt-bold"></i></span>
    <span class="label">Total Icon</span>
    <span class="value" id="statIcon">—</span>
  </div>
  <div class="setting-row">
    <span class="row-icon"><i name="ssd-round-bold"></i></span>
    <span class="label">Total Storage</span>
    <span class="value" id="statSize">—</span>
  </div>
  <div class="setting-row">
    <span class="row-icon"><i name="clock-circle-bold"></i></span>
    <span class="label">Uptime</span>
    <span class="value" id="statUptime">—</span>
  </div>
</div>`;

const buildDOM = () => {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex-1 flex flex-col overflow-hidden';
  wrapper.innerHTML = homeHTML + docsHTML;
  document.body.appendChild(wrapper);

  const actions = document.createElement('div');
  actions.innerHTML = actionsHTML;
  document.body.appendChild(actions.firstElementChild);

  const panel = document.createElement('div');
  panel.innerHTML = panelHTML;
  document.body.appendChild(panel.firstElementChild);

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'copied-toast bordered px-4 py-2 text-sm hidden';
  toast.style.background = 'var(--bg)';
  toast.textContent = 'Copied!';
  document.body.appendChild(toast);

  const lib = document.createElement('script');
  lib.src = LIB;
  document.body.appendChild(lib);
};

const renderIconByName = (name) => {
  const icon = state.all.find(i => i.key === name);
  if (!icon) return '';
  return `<svg viewBox="0 0 ${icon.width || 24} ${icon.height || 24}" fill="currentColor">${icon.body}</svg>`;
};

const applyTheme = (dark) => {
  const root = document.documentElement;
  const btn = $('#themeToggle');
  if (dark) {
    root.setAttribute('data-theme', 'dark');
    if (btn) btn.classList.add('is-dark');
    localStorage.setItem('theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
    if (btn) btn.classList.remove('is-dark');
    localStorage.setItem('theme', 'light');
  }
};

const initTheme = () => {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved === 'dark' || (!saved && prefersDark));
};

const toggleTheme = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(!isDark);
};

const updateNavToggle = (isDocs) => {
  const link = $('#navToggle');
  if (!link) return;
  if (isDocs) {
    link.href = '#home';
    link.title = 'Home';
    link.setAttribute('aria-label', 'Home');
    link.innerHTML = renderIconByName('home-smile-angle-bold');
  } else {
    link.href = '#docs';
    link.title = 'Documentation';
    link.setAttribute('aria-label', 'Documentation');
    link.innerHTML = renderIconByName('documents-minimalistic-bold');
  }
};

const showPage = (page) => {
  const isDocs = page === 'docs';
  $('#pageHome').classList.toggle('hidden', isDocs);
  $('#pageDocs').classList.toggle('hidden', !isDocs);
  document.title = isDocs ? 'Documentation — Solar Icons' : 'Solar Icons';
  updateNavToggle(isDocs);
  const panel = $('#settingsPanel');
  if (panel) panel.classList.add('hidden');
};

const router = () => {
  const hash = location.hash.replace('#', '') || 'home';
  showPage(hash === 'docs' ? 'docs' : 'home');
};

const renderFilters = () => {
  const wrap = $('#filters');
  wrap.innerHTML = STYLES.map(s => `
    <button data-style="${s}" class="filter-btn shrink-0 px-3 py-1.5 text-xs capitalize rounded hover-bg ${s === state.style ? 'font-semibold' : 'muted'}"
      style="${s === state.style ? 'background:var(--hover);border:1px solid var(--border)' : 'border:1px solid transparent'}">${s}</button>
  `).join('');
  wrap.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.style = btn.dataset.style;
      renderFilters();
      applyFilter();
    });
  });
};

const applyFilter = () => {
  state.filtered = state.all.filter(icon => {
    if (state.style !== 'all' && !icon.key.endsWith('-' + state.style)) return false;
    if (state.query && !icon.key.toLowerCase().includes(state.query.toLowerCase())) return false;
    return true;
  });
  $('#grid').innerHTML = '';
  $('#scrollArea').scrollTop = 0;
  state.rendered = 0;
  $('#empty').classList.toggle('hidden', state.filtered.length > 0);
  loadMore();
};

const loadMore = () => {
  if (state.loading || state.rendered >= state.filtered.length) return;
  state.loading = true;
  $('#loading').classList.remove('hidden');

  const batch = state.filtered.slice(state.rendered, state.rendered + PAGE_SIZE);
  const grid = $('#grid');

  grid.insertAdjacentHTML('beforeend', batch.map((icon, i) => `
    <button class="icon-cell bordered p-2 hover-bg flex items-center justify-center aspect-square"
      data-key="${icon.key}" title="${icon.key}" style="animation-delay:${Math.min(i * 4, 200)}ms">
      <svg viewBox="0 0 ${icon.width || 24} ${icon.height || 24}" fill="currentColor">${icon.body}</svg>
    </button>
  `).join(''));

  grid.querySelectorAll('.icon-cell:not([data-bound])').forEach(cell => {
    cell.dataset.bound = '1';
    cell.addEventListener('click', () => copyIcon(cell.dataset.key));
  });

  state.rendered += batch.length;
  state.loading = false;
  $('#loading').classList.add('hidden');
};

const copyIcon = async (key) => {
  const tag = `<i name="${key}"></i>`;
  try {
    await navigator.clipboard.writeText(tag);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = tag;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  const toast = $('#toast');
  toast.textContent = `Copied: ${tag}`;
  toast.classList.remove('hidden');
  toast.style.animation = 'none';
  void toast.offsetHeight;
  toast.style.animation = 'toastIn .3s ease both';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.add('hidden'), 1500);
  incrementCopy();
};

const dbFetch = async (path, method = 'GET', body = null) => {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== null) opts.body = JSON.stringify(body);
  const res = await fetch(`${DB_URL}/${path}.json`, opts);
  if (!res.ok) throw new Error(`DB ${res.status}`);
  const text = await res.text();
  return text && text !== 'null' ? JSON.parse(text) : null;
};

const dbSet = async (path, value) => dbFetch(path, 'PUT', value);

const dbIncrement = async (path) => {
  const current = (await dbFetch(path)) || 0;
  const next = current + 1;
  await dbSet(path, next);
  return next;
};

const trackVisit = async () => {
  try {
    const count = await dbIncrement('solarIcons/stats/visits');
    sessionStorage.setItem('visitCount', count);
    const el = $('#statVisit');
    if (el) el.textContent = count;
    return count;
  } catch {
    const el = $('#statVisit');
    if (el) el.textContent = '—';
    return null;
  }
};

const incrementCopy = async () => {
  try {
    const count = await dbIncrement('solarIcons/stats/copies');
    sessionStorage.setItem('copyCount', count);
    const el = $('#statCopy');
    if (el) el.textContent = count;
  } catch {}
};

const formatDuration = (ms) => {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const startUptimeTicker = () => {
  const el = $('#statUptime');
  if (!el) return;
  const update = () => {
    if (!window.__firstLaunch) return;
    el.textContent = formatDuration(Date.now() - window.__firstLaunch);
  };
  update();
  if (window.__uptimeTimer) clearInterval(window.__uptimeTimer);
  window.__uptimeTimer = setInterval(update, 30000);
};

const ensureFirstLaunch = async () => {
  try {
    let first = await dbFetch('solarIcons/stats/firstLaunch');
    if (!first || typeof first !== 'number') {
      first = Date.now();
      await dbSet('solarIcons/stats/firstLaunch', first);
    }
    window.__firstLaunch = first;
    startUptimeTicker();
  } catch {}
};

const loadStats = async () => {
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  try {
    const stats = (await dbFetch('solarIcons/stats')) || {};
    setVal('statVisit', stats.visits ?? 0);
    setVal('statCopy', stats.copies ?? 0);
    if (stats.firstLaunch) {
      window.__firstLaunch = stats.firstLaunch;
      startUptimeTicker();
    }
  } catch {
    setVal('statVisit', '—');
    setVal('statCopy', '—');
  }

  setVal('statIcon', state.all.length || 0);
  const bytes = state.jsonBytes || 0;
  setVal('statSize', (bytes / (1024 * 1024)).toFixed(2) + ' MB');

  try {
    await dbSet('solarIcons/meta/totalIcons', state.all.length || 0);
    await dbSet('solarIcons/meta/jsonSizeBytes', bytes);
  } catch {}
};

const loadIcons = async () => {
  const res = await fetch(ICON_JSON);
  const text = await res.text();
  state.jsonBytes = new Blob([text]).size;
  const data = JSON.parse(text);
  
  let rawIcons = {};
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item && item.name) {
        const key = item.name.includes(':') ? item.name.split(':')[1] : item.name;
        const svgMatch = item.svg ? item.svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i) : null;
        const widthMatch = item.svg ? item.svg.match(/width="([^"]+)"/i) : null;
        const heightMatch = item.svg ? item.svg.match(/height="([^"]+)"/i) : null;
        
        rawIcons[key] = {
          body: svgMatch ? svgMatch[1] : (item.svg || ''),
          width: widthMatch ? parseInt(widthMatch[1], 10) : 24,
          height: heightMatch ? parseInt(heightMatch[1], 10) : 24
        };
      }
    });
  } else {
    const iconsObj = data.icons || data;
    Object.entries(iconsObj).forEach(([key, val]) => {
      if (typeof val === 'string') {
        rawIcons[key] = { body: val, width: 24, height: 24 };
      } else if (val && typeof val === 'object') {
        rawIcons[key] = {
          body: val.body || '',
          width: val.width || 24,
          height: val.height || 24
        };
      }
    });
  }

  state.all = Object.entries(rawIcons).map(([key, val]) => ({
    key,
    body: val.body,
    width: val.width,
    height: val.height
  }));

  renderFilters();
  applyFilter();
  router();
};

const setupEvents = () => {
  let searchTimer;
  $('#search').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = e.target.value;
      applyFilter();
    }, 200);
  });

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadMore();
  }, { root: $('#scrollArea'), rootMargin: '200px' });
  observer.observe($('#sentinel'));

  window.addEventListener('hashchange', router);

  $('#themeToggle').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTheme();
  });

  $('#settingsBtn').addEventListener('click', async (e) => {
    e.stopPropagation();
    const panel = $('#settingsPanel');
    const opening = panel.classList.contains('hidden');
    panel.classList.toggle('hidden');
    if (opening) await loadStats();
  });

  document.addEventListener('click', (e) => {
    const panel = $('#settingsPanel');
    const btn = $('#settingsBtn');
    if (!panel || panel.classList.contains('hidden') || !btn) return;
    if (!panel.contains(e.target) && !btn.contains(e.target)) {
      panel.classList.add('hidden');
    }
  });
};

const init = async () => {
  injectStyles();
  buildDOM();
  initTheme();
  setupEvents();
  await loadIcons();
  await trackVisit();
  await ensureFirstLaunch();
};

init();
