# Inzamam Portfolio

## Project Overview
Single-file static portfolio website (`index.html`) with embedded CSS and JS.

## Key Features
- Custom analog/digital clock in hero section
- Full-width alternating project showcase layout with hover zoom
- Golden ambient blobs animation (CSS-only, soft-light blend)
- Custom cursor, grain texture, scroll reveal animations
- Desktop side rail (section navigation) + mobile bottom dock
- Comnyang interactive desktop pet cat (bottom-right, desktop + mobile)
- Contact form with Web3Forms integration
- Responsive (breakpoints at 768px, 900px)

## Critical Code Locations

### Clock (hero section)
- HTML: `.clock-wrapper` inside `.hero-content` (above name on mobile)
- CSS: Lines ~439-543, responsive at ~1466-1505
- JS: `updateClock()` function, `hourHand`/`minuteHand` IDs

### Projects Showcase
- `.project-showcase` with `.showcase-inner` (alternating `.reverse` for layout)
- Images clickable (wrapped in `<a>` linking to live/github)
- `.showcase-reveal` with IntersectionObserver for scroll animation

### Section Navigation
- Desktop rail: `[data-nav-rail]` - fixed left, shows after 60% scroll
- Mobile dock: `[data-nav-dock]` - fixed bottom, always visible on mobile
- Active state via IntersectionObserver (rootMargin: '-40% 0px -40% 0px')
- Resume link is in the top nav bar (after About), opens Google Drive in new tab

### Contact Form
- Form ID: `contactForm` with name attributes on inputs
- Web3Forms API key: `327a07e4-8c74-48e0-861c-419095716168`

### Comnyang Cat
- Positioned bottom-right: `--cat-top: 70%; --cat-left: 80%` in `cat/renderer/styles.css`
- Visible on mobile (≤900px) with mobile-specific positioning (`--cat-top: 110px; --cat-left: calc(50vw + 130px)`)
- Interactive: follows cursor, reacts to key press, scroll, draggable (desktop + mobile touch)
- Right-click context menu (long-press on mobile): name, color patterns, size, sound toggle
- Stretch SVGs inlined in `renderer.js` via DOMParser (synchronous, no async race on first drag)
- Scripts (in order): `cat/shim.js`, `cat/renderer/cell-mappings.js`, `cat/renderer/renderer.js`
- Mobile size changes work: JS `updateCatTransform()` sets `--cat-size` on all screen sizes

## File Structure
- `index.html` — main portfolio (all HTML + embedded CSS + JS)
- `cat/` — Comnyang desktop pet (SVGs, renderer, shim, presets, assets)
- `assests/` — project screenshots and profile image
- `favicon/` — favicon assets
- `photorestorationFilm/` — separate project (do not modify)

## Dependencies
- Google Fonts: Playfair Display, Satoshi, JetBrains Mono
- Web3Forms API key: `327a07e4-8c74-48e0-861c-419095716168` (free tier, 250 submissions/month)

## Notes
- Custom cursor disabled on mobile via CSS
- Clock parallax effect on scroll (desktop only)
- Skill items use staggered animation on scroll (60ms delay each)
- Cat stores state in localStorage (comnyang_* keys): drag position, size, name, pattern, sound settings
- Nav-dock backdrop-filter removed (was blurring content behind), uses solid rgba(15,15,15,0.98) background

## Session Log (2026-06-16)
- Integrated Comnyang cat from `photorestorationFilm/cat/` → `cat/` (copied folder, added CSS link, cat wrapper HTML, and 3 scripts before `</body>`). Cat positioned at `--cat-top: 70%; --cat-left: 80%`, hidden below 900px.
- Moved Resume link from desktop side rail to top nav bar (after About). Updated rail numbering (Contact 06→05).
- Nav-dock backdrop-filter removed (pre-existing fix from earlier session).
- **Known unresolved issue**: User reports nav-rail/nav-dock positioning bug — mobile dock appears centered instead of at bottom, desktop rail appears centered instead of at left edge. CSS has `left:0` / `bottom:0` with correct fixed positioning; needs on-device debugging.
- ECommerce project link still `#` (user said they'll fix later).

## Session Log (2026-06-17)
- Reverted `index.html` to previous commit (removed cat integration from the page). `cat/` folder and its mobile implementation code kept intact for reuse.
- Created `cat/cat.md` — detailed implementation docs for the mobile cat integration, intended as reference for future projects.

## Session Log (2026-06-18)
- **Inline SVG fix**: Replaced async `<object>`-based stretch SVGs with synchronous DOMParser-parsed inline SVGs in `renderer.js`. Fixes first-drag flash and stretch animation not working on first drag. Sizing quirk: inline SVG `width`/`height` attributes interfere with CSS `aspect-ratio` in Chromium — fixed by removing attributes after import so CSS controls sizing.
- **Mobile context menu Size fix**: Size submenu used `mouseenter`/`mouseleave` (no mobile equivalent). Added `click` handler on Size button with `e.stopPropagation()` to toggle submenu on tap.
- **Mobile size changes fix**: Removed `window.innerWidth > 900` guard in `updateCatTransform()` and hardcoded `width: 80px; height: 80px` in mobile CSS. `--cat-size` now applies on all screen sizes.
- Updated `cat/cat.md` with inline SVG approach docs, mobile context menu fix, and mobile sizing notes.
