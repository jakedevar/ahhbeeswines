# Parallax Hero Banners + Region Dropdown Nav — Implementation Plan

## Overview

Add two visual enhancements to ahhbeeswines.com:
1. **Parallax scroll effect** on region hero banner images (Option B — JS `translateY` approach)
2. **Dropdown region selector** in the navbar under a "Regions" trigger

Both features are pure HTML/CSS/JS with zero dependencies, consistent with the site's no-build-step architecture.

## Current State

- **Hero banners**: 6 region pages each have `<div class="region-hero">` with an `<img class="region-hero__bg">` absolutely positioned at `z-index: -2`, covered by a gradient `::after` overlay at `z-index: -1`. Height is 300px (220px on mobile).
- **Navbar**: Flat `<ul class="nav__links">` with no nested menus. "Regions" is a plain anchor link to `index.html#regions`. Mobile hamburger toggle is 18 lines in `main.js`.
- **Files touched**: All 6 region HTML pages share identical nav/hero markup. `index.html` has a different nav (About/Regions/Discover) and no region hero.

## What We're NOT Doing

- No parallax on the homepage hero (it's a gradient, not a photo)
- No JS framework or library additions
- No changes to wine tables, educational blocks, or footer
- No restructuring of the `<img>` tag approach (keeping the existing `<img>` elements)

## Phase 1: Parallax Hero Banners (JS translateY approach)

### Overview
Make region hero background images scroll at ~50% speed relative to the page, creating a subtle depth effect. GPU-accelerated via CSS `transform`, disabled on mobile for performance.

### Changes Required:

#### 1. CSS — `css/styles.css`

**Add `will-change` and expand image height for translation room** (insert after line 333, within the `.region-hero__bg` block):

Replace the existing `.region-hero__bg` rule (lines 326-333):
```css
.region-hero__bg {
  position: absolute;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: -2;
}
```

With:
```css
.region-hero__bg {
  position: absolute;
  inset: -20% 0;        /* extend 20% above and below for parallax room */
  object-fit: cover;
  width: 100%;
  height: 140%;          /* taller than container so translateY has room */
  z-index: -2;
  will-change: transform;
}
```

**Key decisions:**
- `inset: -20% 0` positions the image starting 20% above the container top, giving room for downward translation
- `height: 140%` ensures the image fully covers even when shifted
- `will-change: transform` promotes to GPU compositor layer for smooth animation

#### 2. JavaScript — `js/main.js`

**Add parallax scroll handler** (append after the existing DOMContentLoaded block):

```javascript
// Parallax hero banners — only on desktop (skip touch/mobile for perf)
(function () {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  var heroes = document.querySelectorAll('.region-hero__bg');
  if (!heroes.length) return;

  var ticking = false;

  function updateParallax() {
    var scrollY = window.scrollY;
    heroes.forEach(function (img) {
      var parent = img.parentElement;
      var rect = parent.getBoundingClientRect();
      // Only animate if hero is in/near viewport
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
      var offset = scrollY * 0.4;
      img.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
    });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();
```

**Key decisions:**
- `requestAnimationFrame` + `ticking` flag ensures max 1 update per frame (no jank)
- `{ passive: true }` on the scroll listener tells the browser we won't call `preventDefault`, enabling scroll optimizations
- `translate3d` (not `translateY`) forces GPU compositing
- Skip entirely on mobile via `matchMedia` — parallax on small screens is disorienting and costly
- Viewport bounds check (`rect.bottom < -100`) avoids unnecessary work when hero is scrolled past

#### 3. HTML — No changes needed
The existing `<img class="region-hero__bg">` structure works as-is.

### Success Criteria:

#### Automated Verification:
- [ ] All 6 region pages load without console errors
- [ ] `main.js` has no syntax errors (can verify via browser console)
- [ ] Parallax code doesn't execute on pages without `.region-hero__bg` (homepage)

#### Manual Verification:
- [ ] Scrolling on a region page shows the hero image moving at ~50% scroll speed
- [ ] Effect is smooth (no jank or stutter)
- [ ] Image fully covers the hero area at all scroll positions (no gaps/seams)
- [ ] Effect is disabled on mobile (< 768px)
- [ ] Hero title text remains readable and properly centered
- [ ] Color overlay gradient still renders correctly over the image

---

## Phase 2: Region Dropdown in Navbar

### Overview
Replace the flat "Regions" link with a hover-activated dropdown (desktop) / click-activated accordion (mobile) listing all 6 region pages. The `Regions` text itself remains a link to `index.html#regions` as a fallback.

### Changes Required:

#### 1. HTML — All 7 files (index.html + 6 region pages)

**In each region page** (`california.html`, `washington.html`, `spain.html`, `crete.html`, `germany.html`, `portugal.html`), replace:
```html
<li><a href="index.html#regions">Regions</a></li>
```

With:
```html
<li class="nav__dropdown">
  <a href="index.html#regions" class="nav__dropdown-trigger" aria-haspopup="true" aria-expanded="false">Regions <span class="nav__dropdown-arrow">&#9662;</span></a>
  <ul class="nav__dropdown-menu">
    <li><a href="california.html">California</a></li>
    <li><a href="washington.html">Washington</a></li>
    <li><a href="spain.html">Spain</a></li>
    <li><a href="crete.html">Crete</a></li>
    <li><a href="germany.html">Germany</a></li>
    <li><a href="portugal.html">Portugal</a></li>
  </ul>
</li>
```

**In `index.html`**, replace:
```html
<li><a href="#regions">Regions</a></li>
```

With the same structure but using `#regions` as the trigger href:
```html
<li class="nav__dropdown">
  <a href="#regions" class="nav__dropdown-trigger" aria-haspopup="true" aria-expanded="false">Regions <span class="nav__dropdown-arrow">&#9662;</span></a>
  <ul class="nav__dropdown-menu">
    <li><a href="california.html">California</a></li>
    <li><a href="washington.html">Washington</a></li>
    <li><a href="spain.html">Spain</a></li>
    <li><a href="crete.html">Crete</a></li>
    <li><a href="germany.html">Germany</a></li>
    <li><a href="portugal.html">Portugal</a></li>
  </ul>
</li>
```

**Key decisions:**
- `aria-haspopup="true"` and `aria-expanded="false"` for screen reader accessibility
- The trigger `<a>` still links to `#regions` / `index.html#regions` so it works as a normal link on middle-click or if JS fails
- `&#9662;` (▾) is a small down-pointing triangle — visually clear, no icon library needed

#### 2. CSS — `css/styles.css`

**Add dropdown styles** (insert after the `.nav__toggle` block, around line 121):

```css
/* ---------- Nav Dropdown ---------- */
.nav__dropdown {
  position: relative;
}

.nav__dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav__dropdown-arrow {
  font-size: 0.7em;
  transition: transform 0.2s;
}

.nav__dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #e8e4df;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  padding: 0.5rem 0;
  min-width: 180px;
  list-style: none;
  z-index: 200;
}

.nav__dropdown-menu li a {
  display: block;
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  color: #4a4a4a;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.nav__dropdown-menu li a:hover {
  background: #f8f6f3;
  color: #7b2d42;
}

/* Show on hover (desktop) */
.nav__dropdown:hover .nav__dropdown-menu,
.nav__dropdown.open .nav__dropdown-menu {
  display: block;
}

.nav__dropdown:hover .nav__dropdown-arrow,
.nav__dropdown.open .nav__dropdown-arrow {
  transform: rotate(180deg);
}
```

**Add mobile overrides inside the existing `@media (max-width: 768px)` block** (after the `.nav__toggle { display: block; }` rule):

```css
  .nav__dropdown-menu {
    position: static;
    transform: none;
    box-shadow: none;
    border: none;
    border-radius: 0;
    padding: 0 0 0 1rem;
    min-width: 0;
  }

  .nav__dropdown-menu li a {
    padding: 0.4rem 0;
    font-size: 0.9rem;
  }
```

**Key decisions:**
- Desktop: dropdown appears on `:hover` — immediate, familiar pattern for nav menus
- `left: 50%; transform: translateX(-50%)` centers the dropdown under its trigger
- Mobile: dropdown collapses inline (no absolute positioning) and nests inside the hamburger menu with left padding
- `.nav__dropdown.open` class provides JS toggle fallback for touch devices that don't hover
- `z-index: 200` ensures dropdown renders above sticky nav (z-index 100) and hero content

#### 3. JavaScript — `js/main.js`

**Add dropdown toggle for touch/mobile** (append to the DOMContentLoaded block or add a new IIFE):

```javascript
// Dropdown toggle for touch devices
(function () {
  var dropdown = document.querySelector('.nav__dropdown');
  var trigger = document.querySelector('.nav__dropdown-trigger');
  if (!dropdown || !trigger) return;

  trigger.addEventListener('click', function (e) {
    // On mobile, toggle the dropdown instead of navigating
    if (window.innerWidth <= 768) {
      e.preventDefault();
      dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded',
        dropdown.classList.contains('open') ? 'true' : 'false'
      );
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
})();
```

**Key decisions:**
- On mobile (<=768px), clicking "Regions" toggles the dropdown open/closed instead of navigating — since the full region list is more useful than jumping to the homepage
- On desktop, click behavior is left as default (link navigation), while hover handles the dropdown
- `aria-expanded` is updated dynamically for screen readers
- Click-outside handler closes the dropdown cleanly

### Success Criteria:

#### Automated Verification:
- [ ] All 7 HTML files have the updated nav markup (no broken tags)
- [ ] No console errors on any page
- [ ] `aria-haspopup` and `aria-expanded` attributes present on all triggers

#### Manual Verification:
- [ ] Desktop: hovering "Regions" shows dropdown with all 6 region links
- [ ] Desktop: clicking a dropdown link navigates to the correct region page
- [ ] Desktop: dropdown arrow rotates on hover
- [ ] Desktop: dropdown disappears when mouse leaves
- [ ] Mobile: tapping hamburger shows nav; tapping "Regions" expands sub-links inline
- [ ] Mobile: tapping a region link navigates correctly
- [ ] Mobile: tapping outside closes the dropdown
- [ ] The "Regions" link still works as a regular link (middle-click opens in new tab)
- [ ] Homepage dropdown works (links to `#regions` vs `index.html#regions`)

---

## Testing Strategy

### Browser Testing:
- Chrome/Firefox/Safari desktop (hover dropdown behavior)
- Chrome/Safari mobile (touch dropdown, parallax disabled)
- Resize browser window to verify 768px breakpoint transition

### Edge Cases:
- Page load at scroll position > 0 (e.g., browser back-button restore) — parallax should calc correct initial offset
- Rapid scrolling — should remain smooth thanks to rAF throttle
- Keyboard navigation — dropdown should be reachable via Tab and openable via Enter/Space

### Performance:
- Parallax uses single `scroll` listener with `passive: true` and `requestAnimationFrame` — no layout thrashing
- `will-change: transform` on images promotes to compositor layer
- Mobile gets zero parallax overhead (early return)

## File Change Summary

| File | Phase | Type of Change |
|------|-------|---------------|
| `css/styles.css` | 1 & 2 | Modify `.region-hero__bg`, add dropdown styles, mobile overrides |
| `js/main.js` | 1 & 2 | Add parallax IIFE, add dropdown toggle IIFE |
| `index.html` | 2 | Replace Regions `<li>` with dropdown markup |
| `california.html` | 2 | Replace Regions `<li>` with dropdown markup |
| `washington.html` | 2 | Replace Regions `<li>` with dropdown markup |
| `spain.html` | 2 | Replace Regions `<li>` with dropdown markup |
| `crete.html` | 2 | Replace Regions `<li>` with dropdown markup |
| `germany.html` | 2 | Replace Regions `<li>` with dropdown markup |
| `portugal.html` | 2 | Replace Regions `<li>` with dropdown markup |

**Total new code**: ~90-100 lines (CSS + JS). **HTML changes**: repetitive across 7 files but identical.
