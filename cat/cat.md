# Comnyang Cat — Integration Guide

Comnyang is a pixel-art desktop pet cat originally built as an Electron app. This folder adapts it for the browser (no Electron dependencies). The cat follows the cursor, reacts to keyboard/scroll, can be dragged around, shows a stretch/bounce animation, and displays speech bubbles.

---

## File Structure

```
cat/
  shim.js                          # Web bridge: replaces Electron IPC with DOM + localStorage
  renderer/
    styles.css                     # All cat visual styles
    cell-mappings.js               # Pixel cell mappings for SVG rendering
    renderer.js                    # Core renderer: animation loops, drag physics, SVG management
  svg/
    cat-idle-follow-v2.svg         # Default idle cat (loaded via <object>)
    stretch-end.svg                # Stretched pose during drag (⚠️ DISK COPY — NOT USED AT RUNTIME)
    stretch-start.svg              # Stretch start reference (⚠️ DISK COPY — NOT USED AT RUNTIME)
    stretch-pose-default.svg       # Idle stretch animation pose
    stretch-pose-ing.svg           # Active stretch animation pose
    press-left.svg                 # Key press pose (left)
    press-right.svg                # Key press pose (right)
    scroll-unroll.svg              # Scroll reaction pose
    jump-start.svg                 # Jump start pose
    jump-ing.svg                   # Mid-jump pose
  presets/patterns/
    black-cat.json, white-cat.json, cheese-cat.json, siamese-cat.json,
    mackerel-tabby.json, calico-cat.json, rusian-blue.json  # Color presets
  assets/svg/
    heart.svg                      # Purr hearts
  assets/img/presets/              # Thumbnails for context menu
```

---

## Integration Steps

### 1. Copy the `cat/` folder into your project root.

> **Important:** `stretch-end.svg` and `stretch-start.svg` on disk are **reference copies only**. At runtime, these SVGs are embedded as JS string constants inside `renderer.js` and injected as inline `<svg>` elements via `DOMParser`. See [Inline SVG Approach](#inline-svg-approach). If you modify the SVG files on disk, you must also update the corresponding strings in `renderer.js`.

### 2. Add the stylesheet in `<head>`:

```html
<link rel="stylesheet" href="cat/renderer/styles.css" />
```

### 3. Add the cat wrapper HTML before `</body>`:

```html
<div id="cat-wrapper">
  <div id="drag-handle"></div>
  <div id="share-name-badge"></div>
  <div id="cat-speech-bubble"></div>
  <div id="cat-thinking-dots" aria-label="thinking"><span>.</span><span>.</span><span>.</span></div>
  <button id="reminder-clock-button" type="button" aria-label="Open reminders" style="display:none">...</button>
  <section id="reminder-panel" aria-label="Reminders" style="display:none">...</section>
  <form id="cat-name-editor">...</form>
  <form id="user-name-editor">...</form>
  <form id="fixed-message-editor">...</form>
  <form id="pomodoro-focus-editor" style="display:none">...</form>
  <form id="share-duration-editor" style="display:none">...</form>
  <object id="cat" type="image/svg+xml" data="cat/svg/cat-idle-follow-v2.svg" aria-label="cat"></object>
  <div id="purr-hearts" aria-hidden="true"><span></span><span></span><span></span></div>
  <div id="heat-steam">...</div>
  <object id="press-left" type="image/svg+xml" data="cat/svg/press-left.svg" aria-label="cat-typing-left"></object>
  <object id="press-right" type="image/svg+xml" data="cat/svg/press-right.svg" aria-label="cat-typing-right"></object>
  <object id="scroll-unroll" type="image/svg+xml" data="cat/svg/scroll-unroll.svg" aria-label="cat-unrolling-paper"></object>
  <object id="jump-start" type="image/svg+xml" data="cat/svg/jump-start.svg" aria-label="cat-jump-start"></object>
  <object id="jump-ing" type="image/svg+xml" data="cat/svg/jump-ing.svg" aria-label="cat-jumping"></object>
  <object id="stretch-svg-end" type="image/svg+xml" data="cat/svg/stretch-end.svg" aria-label="stretch"></object>
  <object id="stretch-pose-default" type="image/svg+xml" data="cat/svg/stretch-pose-default.svg" aria-label="stretching-default"></object>
  <object id="stretch-pose-ing" type="image/svg+xml" data="cat/svg/stretch-pose-ing.svg" aria-label="stretching-active"></object>
</div>
```

(You can omit the reminder/pomodoro/name-editor forms if unused — they are hidden by default.)

### 4. Add scripts in order before `</body>`:

```html
<script src="cat/shim.js"></script>
<script src="cat/renderer/cell-mappings.js"></script>
<script src="cat/renderer/renderer.js"></script>
```

**Order matters.** `shim.js` must load first because it defines `window.electronAPI` (the bridge the renderer expects).

---

## How It Works

### Architecture

The original Comnyang is an Electron app. The renderer (`renderer.js`) calls `window.electronAPI.*` for all platform APIs — drag, storage, context menu, audio, window management. `shim.js` replaces every Electron call with plain DOM APIs:

| Electron API | Web Shim Replacement |
|---|---|
| `dragWindow(dx, dy)` | Translates `#cat-wrapper` via `transform: translate()` |
| `dragWindowEnded()` | Saves position to localStorage |
| `setStretchMode()` | No-op (CSS handles stretch visibility) |
| `setMouseEventsEnabled()` | Toggles `pointer-events` on wrapper |
| `onCursorPos(cb)` | `document mousemove` → calculates delta from cat center |
| `onMouseWheel(cb)` | `wheel` event + `scroll` event fallback for mobile |
| `onKeyPressed(cb)` | `keydown` event |
| `catNameGet/Set` | localStorage `comnyang_catName` |
| `patternGet/Set` | localStorage `comnyang_pattern` (color preset JSON) |
| `soundMutedGet/Set` | localStorage `comnyang_soundMuted` / `comnyang_soundVolume` |
| `showContextMenu()` | Custom right-click menu DOM |
| `onAiTaskNotification(cb)` | 30s idle timer → begs for attention |

### Drag Physics (Desktop)

The renderer has its own spring-physics drag system:

1. `mousedown` on `#drag-handle` → saves initial position in `X`
2. `mousemove` on `window` with `buttons: 1` → when movement exceeds 4px threshold, calls `Ai(X, e)` to initiate drag
3. `Ai()` → sets `x = true`, adds `body.dragging` class, starts `kr()` animation loop
4. On each `mousemove`: calls `dragWindow(n, r)` (translates wrapper), pushes spring force `G[0] -= n * hi`
5. `kr()` loop: processes spring array `G[]` into displacement array `R[]`, calls `_e()` to update SVG segment transforms
6. `mouseup`: if `P > 0` (cat was dragged upward), runs throw/bounce (`Y = true`). Otherwise removes `body.dragging` immediately.

### SVG Display State Machine

CSS controls which SVG is visible based on body classes/datasets:

- Default: `#cat` (idle SVG) shown, others `display: none`
- `body.dragging` → `#stretch-svg-end` shown, all others hidden
- `body[data-stretching]` → `#stretch-pose-default` shown (idle stretch animation)
- `body[data-press="left/right"]` → `#press-left` / `#press-right`
- `body[data-scroll]` → `#scroll-unroll`
- `body[data-jump]` → `#jump-start` / `#jump-ing`
- `body[data-hunting]` → `#cat` with hunting animations

---

## Mobile Implementation

### Enabling the Cat on Mobile

By default the cat is hidden below 900px in the CSS. To show it:

1. Remove or modify the `@media (max-width: 900px) { #cat-wrapper { display: none; } }` rule
2. Add mobile-specific sizing/positioning:

```css
@media (max-width: 900px) {
  #cat-wrapper {
    --cat-top: 110px;              /* Fixed position below header */
    --cat-left: calc(50vw + 130px); /* Beside the clock/hero */
    --cat-size: 80px;              /* Smaller on mobile */
    z-index: 10001;                /* Above custom cursor */
  }
  #cat-wrapper #drag-handle,
  #cat-wrapper #cat {
    width: 80px;
    height: 80px;
  }
  #cat-speech-bubble {
    max-width: min(75vw, 240px);
    font-size: 11px;
    padding: 5px 10px;
    white-space: normal;
    overflow-wrap: break-word;
  }
}
```

Key: The JS `updateCatTransform()` sets `--cat-size` on all screen sizes. The mobile CSS `--cat-size: 80px` on `#cat-wrapper` serves as the default; JS overrides it when the user changes size via the context menu.

**`--cat-size` defaults:**
| Scope | Value | Where set |
|---|---|---|
| Desktop | `calc(100vh / 4.8)` | `:root` in `styles.css` |
| Mobile (≤900px) | `80px` | `#cat-wrapper` inside `@media (max-width: 900px)` |
| After user change | `catSize` px (40–400) | JS `updateCatTransform()` sets inline on `#drag-handle` |

### Mobile Context Menu (Long-press)

On mobile, the browser natively fires a `contextmenu` event on **long-press** (no extra code needed). The custom right-click menu in `shim.js` already listens for `contextmenu` on `document`, so it works on mobile out of the box (lines 582-584).

The Size submenu originally relied on `mouseenter`/`mouseleave` (no mobile equivalent). Fixed by adding a `click` handler on the Size button that toggles the submenu with `e.stopPropagation()`. See [Mobile Context Menu & Size](#mobile-context-menu--size).

### Touch Event Handling (shim.js lines 289-375)

Mobile uses synthetic mouse events to piggyback on the renderer's existing drag physics:

**Touch → Mouse Event Mapping:**

| Touch Event | Synthetic Mouse Event | Target | Purpose |
|---|---|---|---|
| `touchstart` (on handle) | `mousedown` with `buttons: 1` | `#drag-handle` | Initiates drag physics (`Ai()` in renderer) |
| `touchmove` (past threshold) | `mousemove` with `buttons: 1` | `window` | Drives spring physics, stretch, wrapper movement |
| `touchend` | `mouseup` | `window` | Ends drag, triggers throw/bounce |

**Key implementation details:**

```javascript
// Threshold to distinguish tap vs drag
var DRAG_THRESHOLD = 5;  // pixels

// touchstart: dispatch mousedown to trigger renderer's drag init
handle.dispatchEvent(new MouseEvent('mousedown', {
  button: 0, buttons: 1, cancelable: true,
  clientX: touch.clientX, clientY: touch.clientY,
  screenX: touch.screenX, screenY: touch.screenY
}));

// touchmove: dispatch mousemove with buttons:1 so renderer sees active drag
window.dispatchEvent(new MouseEvent('mousemove', {
  button: 0, buttons: 1, cancelable: true,
  clientX: touch.clientX, clientY: touch.clientY,
  screenX: touch.screenX, screenY: touch.screenY
}));
```

**Important:** 
- `touchstart` listener is `{ passive: true }` — allows page to scroll if touch is outside cat
- `touchmove` listener is `{ passive: false }` — calls `e.preventDefault()` when drag is detected to prevent scroll interference. But `preventDefault` is only called AFTER the threshold is crossed, so initial finger movement still scrolls naturally
- `mousemove` is dispatched on `window` (NOT the handle) because the renderer listens on `window` for drag mousemove
- `mouseup` is dispatched on `window` for the same reason

### Tap vs Drag Detection

A 5px deadzone threshold differentiates taps from drags:

```javascript
if (!moved && (Math.abs(touch.screenX - startX) > DRAG_THRESHOLD || 
    Math.abs(touch.screenY - startY) > DRAG_THRESHOLD)) {
  moved = true;  // This is a drag, not a tap
}
```

- **Drag** (`moved = true`): Synthetic mousemove events drive the renderer's physics
- **Tap** (`moved = false` on touchend): Triggers the purr/love animation via `document.body.dataset.purring = '1'`

### localStorage Separation

Mobile and desktop store drag positions separately to prevent the cat from being off-screen when switching:

```javascript
// Save
var mobile = window.innerWidth <= 900;
set(mobile ? 'dragX_mobile' : 'dragX', dragX);
set(mobile ? 'dragY_mobile' : 'dragY', dragY);

// Restore on load
dragX = get(mobile ? 'dragX_mobile' : 'dragX', 0);
dragY = get(mobile ? 'dragY_mobile' : 'dragY', 0);
```

### Scroll Animation on Mobile

The `shim.js` `onMouseWheel` implementation includes an rAF-throttled scroll event listener as a fallback for mobile (where `wheel` events are unreliable):

```javascript
onMouseWheel: function (cb) {
  document.addEventListener('wheel', function (e) {
    cb({ rotation: Math.sign(e.deltaY) * 120 });
  });
  // Mobile: trigger on touch scroll
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        cb({ rotation: 120 });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
},
```

---

## CSS Custom Properties

| Property | Default | Purpose |
|---|---|---|
| `--cat-top` | `70%` | Vertical position of cat (from top) |
| `--cat-left` | `80%` | Horizontal position (from left) |
| `--cat-size` | `calc(100vh / 4.8)` | Size of the cat (applied to width, aspect-ratio handles height) |
| `--steam-opacity` | `0` | Controlled by JS for heat steam effect |
| `--cat-color` | Set by JS | Dynamic cat color from preset |
| `--cat-outline` | Set by JS | Outline color |

---

## LocalStorage Keys

All keys prefixed with `comnyang_`:

| Key | Type | Purpose |
|---|---|---|
| `comnyang_dragX` | number | Desktop horizontal offset |
| `comnyang_dragY` | number | Desktop vertical offset |
| `comnyang_dragX_mobile` | number | Mobile horizontal offset |
| `comnyang_dragY_mobile` | number | Mobile vertical offset |
| `comnyang_catSize` | number | Cat size in px (40-400) |
| `comnyang_catName` | string | Cat's name (max 24 chars) |
| `comnyang_catNameVisible` | boolean | Show name badge |
| `comnyang_userName` | string | User's name |
| `comnyang_fixedMessage` | string | Fixed speech bubble message |
| `comnyang_pattern` | object | Color pattern data (JSON) |
| `comnyang_presetId` | string | Active preset ID |
| `comnyang_soundMuted` | boolean | Sound muted state |
| `comnyang_soundVolume` | number | Volume 0-1 |
| `comnyang_language` | string | 'en' or other |

---

## Known Issues & Gotchas

1. **Stretch SVG loading race**: On first drag after page load, `stretch-start.svg` is fetched asynchronously. The renderer's spring loop (`kr()`) bails out if `se` (segment data) isn't loaded yet. This means the first drag may briefly show the default stretched SVG state then collapse. Subsequent drags work perfectly. See `renderer.js` line 2370-2390 for the `kr()` bail-out logic.

2. **Stretch only on up-drag**: The `P` (stretch progress) value only increases when dragging UP (negative screenY). Sideways or downward drags keep `P = 0`. This is by design — `P = max(0, min(1, (vr - screenY) / 140))` where `vr` is the touchstart Y.

3. **Z-index conflicts**: On mobile, the cat needs `z-index: 10001` to stay above custom cursor dots and other UI elements.

4. **SVG load timing**: All SVG `<object>` elements load asynchronously. The `renderer.js` handles this with `load` event listeners and a `wt`/`z[]` handoff mechanism. The `stretch-end.svg` and `stretch-start.svg` must both load before the stretch pose system initializes.

5. **Touch scroll through**: The `touchstart` handler uses `{ passive: true }` so scrolling works when touching outside the cat. Only `touchmove` after the drag threshold uses `preventDefault()`.

6. **Context menu**: Right-click context menu is implemented as a custom DOM menu (not the native browser menu). On mobile, long-press is handled by the browser — the custom context menu is desktop-only unless you add a long-press handler.

7. **Sound**: Audio is loaded but may be blocked by browsers before user interaction. The `shim.js` wraps `window.Audio` to fix relative paths.

---

## Inline SVG Approach

The original Comnyang loads stretch SVGs via `<object>` elements (async). This caused two bugs on first drag after page reload: (1) flash of the stretched frame before settling, (2) stretch animation not working at all. Root cause: the renderer's `Tr()` and `kr()` functions depend on `se` (stretch segment data), which was populated asynchronously after both `stretch-start.svg` and `stretch-end.svg` finished loading via `fetch()` + load events. On first drag, `se` was still `null`, so the animation loop bailed.

### Solution: Inline SVG with DOMParser

Both SVGs are embedded as JS string constants in `renderer.js` and parsed synchronously with `DOMParser`:

```javascript
var _se = '<svg ...>...</svg>',
    _ed = new DOMParser().parseFromString(_se, "image/svg+xml"),
    _es = _ed.documentElement;
var _ei = document.importNode(_es, true);
_ec.parentNode.replaceChild(_ei, _ec);
```

This eliminates the async race — `se` is populated before any user interaction.

### Why Inline SVG Over Alternatives

| Approach | Problem |
|---|---|
| CSS guard (hide stretch until ready) | No visual feedback during first drag |
| Mimic drag after load (fake a drag tick) | Brittle, adds complexity |
| Preload SVGs with `<link rel="preload">` | Still async, race remains in theory |
| Inline SVG (chosen) | Synchronous, no race, no flash |

### Sizing Quirk (Critical)

Inline `<svg>` elements differ from `<object>` in how SVG width/height attributes interact with CSS:

- **`<object>`**: SVG attributes live in a separate contentDocument. CSS on the `<object>` element fully controls box sizing. Setting `width="80"` inside the SVG has no effect on the `<object>`'s CSS box.

- **Inline `<svg>`**: SVG `width`/`height` attributes are **presentation attributes** that map to CSS properties. Chromium has a bug where these attributes interfere with `aspect-ratio` calculation — the browser may use the attribute value (e.g. `40px`) instead of the CSS `calc(...)` value.

**Fix**: Remove `width` and `height` attributes from the imported SVG element so CSS has full control:

```javascript
_ei.removeAttribute("width");
_ei.removeAttribute("height");
// CSS handles sizing via #stretch-svg-end {
//   width: calc(var(--cat-size) * 1.5);
//   aspect-ratio: 80 / 148;
// }
```

Also, `Tr()` should NOT call `setAttribute("width", "80")` on the SVG — the viewBox and preserveAspectRatio are sufficient.

### Trade-offs

- **Pro**: No async race, stretch works on first drag every time
- **Pro**: Simpler code — no fetch(), no load event listeners
- **Con**: SVG markup is embedded in JS bundle (bundle size increase)
- **Con**: No browser caching for SVGs (parsed fresh each load)
- **Con**: SVGs can't be opened directly in an editor from the page
- **Con**: DOMParser parsing adds small synchronous cost (negligible for small SVGs)

---

## Mobile Context Menu & Size

### Size Submenu on Mobile

The Size submenu in the right-click context menu originally used `mouseenter`/`mouseleave` to show/hide, which don't fire on mobile touch. Tapping "Size" would close the whole menu because the click propagated to a document-level `click` listener.

**Fix**: Added a `click` handler on the Size button that calls `e.stopPropagation()` and toggles the submenu open/closed. Desktop hover behavior is preserved.

Location: `shim.js` — the IIFE starting at line 447.

### Mobile Size Changes

The cat size context menu (Size submenu or +/- buttons) now works on mobile. Previously two things blocked it:

1. **`shim.js` `updateCatTransform()`**: Had a `window.innerWidth > 900` guard that skipped setting `--cat-size` inline on mobile. Removed — JS now sets `--cat-size` on all screen sizes.

2. **`styles.css` mobile `@media`**: Had explicit `width: 80px; height: 80px;` on `#cat-wrapper #drag-handle, #cat-wrapper #cat`, hardcoding the mobile size regardless of `--cat-size`. Removed — mobile now sizes from `--cat-size` like desktop.

The mobile CSS retains `--cat-size: 80px` on `#cat-wrapper` as the default, so the cat starts at 80px on mobile until the user changes it.
