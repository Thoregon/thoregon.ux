/*
 * Copyright (c) 2025.
 * @author: Martin Neitz
 */

export default class Inspector {
    constructor(settings = {}) {
        this.settings = Object.assign({
            object: {},               // zu untersuchendes Objekt
            element: document.body,   // tatsächliches DOM-Element
            collapse: true            // Start mit eingeklappter Ansicht
        }, settings);
        this._debugObj = null;
        this.watches = new Set();
        this.currentRow = null;
        this.currentPath = null;
        this.elementId = this.settings.element.id;
    }

    getValueByPath(path) {
        return path.split('.').reduce(
            (o, key) => (o && o[key] != null) ? o[key] : undefined,
            this._debugObj
        );
    }

    // Baut die UI im angegebenen Container
    renderUI() {
        const id = this.elementId;
        const tpl = `
                  <style>
                      #${id} {
                      --bg-body: #181a1b;
                      --color-text: #ececec;
                      --bg-card: #23272e;
                      --color-key: #93d6f7;
                      --color-value: #e6d07c;
                      --color-type: #7fdca9;
                      --color-highlight: #38556b;
                      --color-highlight-text: #ffdd57;
                      --color-watch-line: #3a3a4a;
                      --watch-border: #ffdd57;
                      --bg-context: #2d3640;
                      --border-context: #444;
                      --bg-context-hover: #404a56;
                      --bg-watch-btn: #404a56;
                      --bg-watch-btn-hover: #505a66;
                      --color-circular: #ff6f61;
                      --control-bg: #2d3640;
                      --control-btn-bg: #404a56;
                      --control-btn-hover: #505a66;
                      --control-btn-color: #ececec;
                  }
                      @media (prefers-color-scheme: light) {
                      #${id} {
                      --bg-body: #f5f5f5;
                      --color-text: #1a1a1a;
                      --bg-card: #ffffff;
                      --color-key: #005f87;
                      --color-value: #7f5a00;
                      --color-type: #087f5a;
                      --color-highlight: #d0eacf;
                      --color-highlight-text: #005f00;
                      --color-watch-line: #d0d0d0;
                      --watch-border: #005f00;
                      --bg-context: #ffffff;
                      --border-context: #cccccc;
                      --bg-context-hover: #f0f0f0;
                      --bg-watch-btn: #e0e0e0;
                      --bg-watch-btn-hover: #cccccc;
                      --color-circular: #d9534f;
                      --control-bg: #ececec;
                      --control-btn-bg: #dddddd;
                      --control-btn-hover: #cccccc;
                      --control-btn-color: #1a1a1a;
                  }
                  }
                      body {
                      background: var(--bg-body);
                      color: var(--color-text);
                      font-family: 'Inter', Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      min-height: 100vh;
                  }
                      #debugger-card { padding: 24px; }
                      .controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; background: var(--control-bg); padding: 8px; border-radius: 8px; margin-bottom: 12px; }
                      .controls button { background: var(--control-btn-bg); color: var(--control-btn-color); border: none; border-radius: 6px; padding: 6px 16px; cursor: pointer; transition: background 0.2s; font-size: 0.95rem; }
                      .controls button:hover { background: var(--control-btn-hover); }
                      .controls label { font-size: 0.95rem; color: var(--color-type); }
                      .controls input { border: 1px solid var(--border-context); border-radius: 6px; background: var(--bg-card); color: var(--color-text); padding: 6px 10px; font-size: 0.95rem; outline: none; }
                      .object-tree { font-size: 1rem; line-height: 1.4; font-family: 'JetBrains Mono', monospace; overflow-x: auto; max-height: 400px; padding-right: 8px; }
                      .tree-row { position: relative; }
                      .tree-key { color: var(--color-key); user-select: none; margin-right: 8px; font-weight: bold; cursor: pointer; }
                      .tree-key.highlight { background: var(--color-highlight); border-radius: 4px; padding: 2px 4px; color: var(--color-highlight-text); }
                      .watch-line { margin-bottom: -1px; border-bottom: 1px dotted var(--watch-border); }
                      .tree-value { color: var(--color-value); }
                      .tree-type { color: var(--color-type); font-style: italic; margin-left: 6px; }
                      .tree-circular { color: var(--color-circular); font-weight: bold; }
                      .collapsed > .children { display: none; }
                      .tree-toggle, .tree-toggle-empty { display: inline-block; width: 1.2em; text-align: center; }
                      .tree-toggle { color: var(--color-type); cursor: pointer; transition: transform 0.2s; }
                      .collapsed > .tree-toggle { transform: rotate(-90deg); }
                      #context-menu { position: absolute; background: var(--bg-context); border: 1px solid var(--border-context); border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: none; z-index: 100; }
                      #context-menu ul { list-style: none; margin: 0; padding: 4px 0; }
                      #context-menu li { padding: 6px 16px; white-space: nowrap; cursor: pointer; }
                      #context-menu li:hover { background: var(--bg-context-hover); }
                      #watch-panel { display: none; margin-bottom: 12px; }
                      #watch-panel.active { display: block; }
                      .watch-item { display: flex; align-items: center; justify-content: space-between; }
                      .watch-btn { background: var(--bg-watch-btn); color: var(--color-text); border: none; border-radius: 4px; padding: 6px 12px; text-align: left; cursor: pointer; font-family: 'JetBrains Mono', monospace; flex-grow: 1; }
                      .watch-btn:hover { background: var(--bg-watch-btn-hover); }
                      .watch-remove-btn { background: transparent; border: none; color: var(--color-text); margin-left: 8px; cursor: pointer; font-size: 1rem; }
                      .watch-remove-btn:hover { color: var(--watch-border); }
                  </style>
        <div id="debugger-card">
            <div class="controls">
                <button id="expandAllBtn">Alles aufklappen</button>
                <button id="collapseAllBtn">Alles schließen</button>
                <label for="searchInput">Suchen:</label>
                <input type="text" id="searchInput" placeholder="Schlüssel" autocomplete="off" />
            </div>
            <div id="watch-panel"><h2>Watch</h2><ul id="watch-list"></ul></div>
            <div id="object-tree-root" class="object-tree"></div>
        </div>
        <div id="context-menu">
            <ul>
                <li id="copy-path">Pfad kopieren</li>
                <li id="copy-key">Name kopieren</li>
                <li id="copy-value">Wert kopieren</li>
                <li id="add-watch">Zur Watchliste hinzufügen</li>
            </ul>
        </div>`;
        this.settings.element.innerHTML = tpl;
    }

    renderWatches() {
        const panel = this.settings.element.querySelector('#watch-panel');
        const list = this.settings.element.querySelector('#watch-list');
        list.innerHTML = '';
        if (!this.watches.size) { panel.classList.remove('active'); return; }
        panel.classList.add('active');
        this.watches.forEach(path => {
            const li = document.createElement('li'); li.className = 'watch-item';
            const btn = document.createElement('button'); btn.className = 'watch-btn';
            const val = this.getValueByPath(path);
            btn.textContent = (val !== null && typeof val !== 'object') ? ` ${path}: ${JSON.stringify(val)}` : path;
            btn.addEventListener('click', () => this.selectWatch(path));
            const del = document.createElement('button'); del.className = 'watch-remove-btn'; del.textContent = '✕';
            del.addEventListener('click', () => this.deleteWatch(path));
            li.appendChild(btn); li.appendChild(del); list.appendChild(li);
        });
    }

    selectWatch(path) {
        const keyEl = this.settings.element.querySelector(`.tree-key[data-path="${path}"]`);
        if (!keyEl) return;
        let p = keyEl.parentElement;
        const rootEl = this.settings.element.querySelector('#object-tree-root');
        while (p && p !== rootEl) { p.classList.remove('collapsed'); p = p.parentElement; }
        const row = keyEl.closest('.tree-row');
        row.classList.add('watch-line'); row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => row.classList.remove('watch-line'), 2000);
    }

    deleteWatch(path) {
        this.watches.delete(path);
        const keyEl = this.settings.element.querySelector(`.tree-key[data-path="${path}"]`);
        if (keyEl) keyEl.closest('.tree-row').classList.remove('watch-line');
        this.renderWatches();
    }

    copyToClipboard(text) {
        const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }

    async renderTree(obj, level = 0, path = '', seen = new WeakSet()) {
        if (obj === null) return `<span class="tree-value">null</span>`;
        if (typeof obj !== 'object') return `<span class="tree-value">${JSON.stringify(obj)}</span><span class="tree-type">(${typeof obj})</span>`;
        if (seen.has(obj)) return `<span class="tree-value tree-circular">[Zirkulär]</span>`;
        seen.add(obj);
        const isArray = Array.isArray(obj);
        // const keys = isArray ? obj.map((_, i) => i) : Object.keys(obj);

        let keys = [];
        if (obj && typeof obj === 'object') {
            if (Array.isArray(obj?.$keys)) {
                keys = obj.$keys;
            } else if (Array.isArray(obj)) {
                keys = obj.map((_, i) => i);
            } else {
                keys = Object.keys(obj);
            }
        }

        const rows = [];

        for await (let key of keys) {
            const child = await obj[key];
            const childPath = path ? `${path}.${key}` : `${key}`;
            const hasChildren = child && typeof child === 'object' && Object.keys(child).length > 0;
            const toggleHtml = hasChildren ? `<span class="tree-toggle">▼</span>` : `<span class="tree-toggle-empty"></span>`;
            const valueHtml = await this.renderTree(child, level + 1, childPath, seen);
            rows.push(`
                <div class="tree-row" style="margin-left:${(level+1)*20}px">${toggleHtml}<span class="tree-key" data-path="${childPath}">${key}</span>:${valueHtml}</div>
            `);
        }

        const typeLabel = isArray ? `<span class="tree-type">[Array, ${obj.length} items]</span>` : `<span class="tree-type">{Object}</span>`;
        return `${typeLabel}<div class="children">${rows.join('')}</div>`;
    }

    makeTreeInteractive() {
        const root = this.settings.element;
        root.querySelectorAll('.tree-toggle').forEach(toggle => {
            const parent = toggle.parentElement;
            toggle.addEventListener('click', e => { e.stopPropagation(); parent.classList.toggle('collapsed'); });
        });
        root.querySelectorAll('.tree-key').forEach(keyEl => {
            keyEl.addEventListener('click', e => {
                e.stopPropagation();
                const row = keyEl.parentElement;
                const toggle = row.querySelector('.tree-toggle');
                if (!toggle || toggle.classList.contains('tree-toggle-empty')) return;
                row.classList.toggle('collapsed');
            });
        });
    }

    setAllCollapsed(collapsed) {
        this.settings.element.querySelectorAll('.tree-row').forEach(row => collapsed ? row.classList.add('collapsed') : row.classList.remove('collapsed'));
    }

    highlightKeys(term) {
        const root = this.settings.element;
        root.querySelectorAll('.tree-key').forEach(keyEl => {
            const path = keyEl.getAttribute('data-path');
            const match = term && path.toLowerCase().includes(term.toLowerCase());
            keyEl.classList.toggle('highlight', match);
            if (match) { let p = keyEl.parentElement; const rootEl = root.querySelector('#object-tree-root'); while (p && p !== rootEl) { p.classList.remove('collapsed'); p = p.parentElement; }}
        });
    }

    async debugObject() {
        this._debugObj = this.settings.object;
        const rootEl = this.settings.element.querySelector('#object-tree-root');
        rootEl.innerHTML = await this.renderTree(this._debugObj);
        this.makeTreeInteractive();
        if (this.settings.collapse) this.setAllCollapsed(true);
        this.renderWatches();
    }

    async init() {
        this.renderUI();
        document.addEventListener('click', () => this.settings.element.querySelector('#context-menu').style.display = 'none');
        const root = this.settings.element;
        root.querySelectorAll('#copy-path').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); this.copyToClipboard(this.currentPath); }));
        root.querySelectorAll('#copy-key').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); this.copyToClipboard(this.currentPath.split('.').pop()); }));
        root.querySelectorAll('#copy-value').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); this.copyToClipboard(JSON.stringify(this.getValueByPath(this.currentPath))); }));
        root.querySelectorAll('#add-watch').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); this.watches.add(this.currentPath); this.currentRow.classList.add('watch-line'); this.renderWatches(); }));
        root.querySelector('#expandAllBtn').addEventListener('click', () => this.setAllCollapsed(false));
        root.querySelector('#collapseAllBtn').addEventListener('click', () => this.setAllCollapsed(true));
        root.querySelector('#searchInput').addEventListener('input', e => this.highlightKeys(e.target.value));
        document.addEventListener('contextmenu', e => {
            const row = e.target.closest('.tree-row');
            if (!row) return;
            e.preventDefault();
            this.currentRow = row;
            this.currentPath = row.querySelector('.tree-key').getAttribute('data-path');
            menu.style.top = `${e.pageY}px`;
            menu.style.left = `${e.pageX}px`;
            menu.style.display = 'block';
        });
        await this.debugObject();
    }
}