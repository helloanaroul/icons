
function loadSolarIcons(options = {}) {
    const JSON_URL = options.url || 'icons.json';
    const LOG_PREFIX = '[ICONS]';

    const allIconElements = document.querySelectorAll('i[name], i[class]');

    if (allIconElements.length === 0) {
        console.info(`${LOG_PREFIX} No <i> elements found. Skipping icon load.`);
        return;
    }

    console.group(`${LOG_PREFIX} Initializing...`);
    console.groupCollapsed('%c[ICONS] Developer Information', 'color:#64748b;font-size:10px;font-weight:normal;');
    console.log('%c  Developer       : Anaroul Hasan\n  GitHub          : github.com/helloanaroul/icons\n  Usage           : https://github.com/helloanaroul/icons/blob/main/README.md\n  jsdelivr        : https://cdn.jsdelivr.net/gh/helloanaroul/icons@refs/heads/main/icons.js\n  Icon Webpage    : https://icones.js.org/collection/solar', 'color:#E87F24;font-size:8px;line-height:1.8;');
    console.groupEnd();
    console.groupCollapsed('%c[ICONS] Usage Examples', 'color:#64748b;font-size:8px;font-weight:normal;');
    console.log(
        '%c' +
        '  <!-- Method 1: name attribute -->\n' +
        '  <i name="home-bold"></i>\n\n' +
        '  <!-- Method 2: prefix + class -->\n' +
        '  <i class="solar-home-bold"></i>\n\n' +
        '  <!-- Method 3: exact icon key -->\n' +
        '  <i class="home-bold"></i>',
        'color:#7dd3fc;font-family:monospace;font-size:11px;line-height:1.9;'
    );
    console.groupEnd();
    console.info(`${LOG_PREFIX} Found ${allIconElements.length} potential icon element(s).`);
    console.time(`${LOG_PREFIX} Total load time`);
    console.log(`${LOG_PREFIX} Fetching: ${JSON_URL}`);

    fetch(JSON_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status} — ${res.statusText}`);
            }
            console.log(`${LOG_PREFIX} icons.json loaded (${res.status} OK)`);
            return res.json();
        })
        .then(data => {
            const prefix = data.prefix || 'solar';
            const icons = data.icons || {};
            const aliases = data.aliases || {};
            const defaultWidth = data.width || 24;
            const defaultHeight = data.height || 24;

            const totalIcons = Object.keys(icons).length;
            const totalAliases = Object.keys(aliases).length;
            console.log(`${LOG_PREFIX} Parsed — ${totalIcons} icons, ${totalAliases} aliases, prefix: "${prefix}"`);

            let rendered = 0, skipped = 0, notFound = 0;

            allIconElements.forEach((el, index) => {
                let iconName = el.getAttribute('name');

                if (!iconName) {
                    for (const cls of el.classList) {
                        if (cls.startsWith(`${prefix}-`)) {
                            iconName = cls.substring(prefix.length + 1);
                            break;
                        }
                    }
                }

                if (!iconName) {
                    for (const cls of el.classList) {
                        if (icons[cls] || aliases[cls]) {
                            iconName = cls;
                            break;
                        }
                    }
                }

                if (!iconName) {
                    console.warn(`${LOG_PREFIX} [${index}] Skipped — no icon name detected.`, el);
                    skipped++;
                    return;
                }

                let resolvedName = iconName;
                if (aliases[resolvedName]) {
                    resolvedName = aliases[resolvedName].parent;
                    console.debug(`${LOG_PREFIX} [${index}] Alias "${iconName}" → "${resolvedName}"`);
                }

                if (!icons[resolvedName]) {
                    console.warn(`${LOG_PREFIX} [${index}] Icon not found: "${iconName}"${resolvedName !== iconName ? ` (resolved: "${resolvedName}")` : ''}`);
                    notFound++;
                    return;
                }

                const iconData = icons[resolvedName];
                const w = iconData.width || defaultWidth;
                const h = iconData.height || defaultHeight;

                el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="1em" height="1em" style="vertical-align:-0.125em;" aria-hidden="true">${iconData.body}</svg>`;
                el.setAttribute('aria-label', iconName);
                el.setAttribute('role', 'img');

                console.debug(`${LOG_PREFIX} [${index}] ✓ Rendered: "${iconName}"`);
                rendered++;
            });

            console.log(
                `%c${LOG_PREFIX} Done — ✓ ${rendered} rendered | ⚠ ${notFound} not found | ⊘ ${skipped} skipped`,
                'color: #22c55e; font-weight: bold;'
            );
            console.timeEnd(`${LOG_PREFIX} Total load time`);
            console.groupEnd();
        })
        .catch(err => {
            console.error(`${LOG_PREFIX} Failed to load "${JSON_URL}":`, err);
            console.timeEnd(`${LOG_PREFIX} Total load time`);
            console.groupEnd();
        });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadSolarIcons());
} else {
    loadSolarIcons();
}
