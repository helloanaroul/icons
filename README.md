# ☀ Solar Icons

A lightweight, zero-dependency JavaScript loader that dynamically renders [Solar Icon Set](https://icon-sets.iconify.design/solar/) SVGs using simple `<i>` tags — no build step, no framework required.

> **Author:** Anaroul Hasan  
> **GitHub:** [github.com/helloanaroul/icons](https://github.com/helloanaroul/icons)

---

## 📦 Files

| File | Description |
|---|---|
| `icons.js` | Development version (readable, with comments) |
| `icons.min.js` | Production version (minified) |
| `icons.json` | Solar icon data (SVG bodies + metadata) |

---

## 🚀 Quick Start

**1. Add the script to your HTML:**

```html
<!-- Production (recommended) -->
<script src="icons.min.js"></script>

<!-- Development (for debugging) -->
<script src="icons.js"></script>
```

**2. Use icons anywhere with `<i>` tags:**

```html
<!-- Method 1: Using the name attribute (simplest) -->
<i name="home-bold"></i>

<!-- Method 2: Using prefix + class name -->
<i class="solar-home-bold"></i>

<!-- Method 3: Using exact icon key as class -->
<i class="home-bold"></i>
```

---

## 🎨 Styling Icons

Icons inherit `font-size` and `color` from their parent — style them like text:

```css
i {
    font-size: 24px;      /* controls icon size */
    color: #f97316;       /* controls icon color */
}
```

```html
<!-- Inline style -->
<i name="star-bold" style="font-size: 32px; color: gold;"></i>
```

---

## ⚙️ Icon Name Format

Solar icons follow the pattern: `{name}-{style}`

| Style | Example |
|---|---|
| `bold` | `home-bold` |
| `linear` | `home-linear` |
| `outline` | `home-outline` |
| `broken` | `home-broken` |
| `duotone` | `home-duotone` |
| `bold-duotone` | `home-bold-duotone` |

---

## 🛠 Advanced Usage

You can call `loadSolarIcons()` manually with custom options:

```js
loadSolarIcons({
    url: '/assets/icons.json'   // custom path to icons.json
});
```

---

## 🖥 Console Output

When the script runs, you'll see detailed logs in the browser DevTools console:

```
☀ Solar Icons  v2.0
  Author : Anaroul Hasan
  GitHub : github.com/helloanaroul/icons

▼ [SolarIcons] Initializing...
  [SolarIcons] Found 3 potential icon element(s).
  [SolarIcons] Fetching: icons.json
  [SolarIcons] icons.json loaded (200 OK)
  [SolarIcons] Parsed — 9000 icons, 250 aliases, prefix: "solar"
  [SolarIcons] Done — ✓ 3 rendered | ⚠ 0 not found | ⊘ 0 skipped
  [SolarIcons] Total load time: 42ms
```

> **Tip:** Use `console.debug` in DevTools (enable "Verbose" level) to see per-icon render logs.

---

## ⚡ Performance Notes

- **Early exit:** If no `<i>` elements are found on the page, `icons.json` is never fetched.
- **Selector optimized:** Only `<i>` tags with a `name` or `class` attribute are queried.
- **No dependencies:** Pure vanilla JavaScript — no jQuery, no frameworks.
- **Alias support:** Automatically resolves icon aliases to their parent icon.

---

## 📋 Full HTML Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Solar Icons Demo</title>
    <style>
        body { font-family: sans-serif; padding: 40px; display: flex; gap: 20px; }
        i    { font-size: 32px; color: #f97316; display: inline-flex; align-items: center; }
    </style>
</head>
<body>

    <i name="home-bold"></i>
    <i name="star-linear"></i>
    <i class="solar-heart-bold"></i>
    <i class="settings-broken"></i>

    <script src="icons.min.js"></script>
</body>
</html>
```

---

## 📄 License

MIT — free to use, modify, and distribute.
