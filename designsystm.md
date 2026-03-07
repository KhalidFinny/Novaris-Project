# Novaris Design System
## Version 1.0 — Scarlet & Ice · Tailwind Edition

> The complete visual, structural, interaction, and copy language for Novaris — written entirely in Tailwind CSS utility classes. Every token, every component, every section pattern documented as class strings ready to drop into your markup. Uses Tailwind v3/v4 with a custom `tailwind.config.js` that registers the Novaris token set.

---

## Table of Contents

1. [Tailwind Config](#1-tailwind-config)
2. [Brand Foundation](#2-brand-foundation)
3. [Design Principles](#3-design-principles)
4. [Color Tokens → Tailwind Classes](#4-color-tokens--tailwind-classes)
5. [Typography → Tailwind Classes](#5-typography--tailwind-classes)
6. [Spacing & Grid → Tailwind Classes](#6-spacing--grid--tailwind-classes)
7. [Border Radius & Shape](#7-border-radius--shape)
8. [Elevation & Depth Philosophy](#8-elevation--depth-philosophy)
9. [Page Architecture](#9-page-architecture)
10. [Section: Navigation](#10-section-navigation)
11. [Section: Hero](#11-section-hero)
12. [Section: Problem](#12-section-problem)
13. [Section: Solution & Features](#13-section-solution--features)
14. [Section: Quote](#14-section-quote)
15. [Section: Benefits](#15-section-benefits)
16. [Section: Pricing Tease](#16-section-pricing-tease)
17. [Section: Contact / CTA](#17-section-contact--cta)
18. [Section: Footer](#18-section-footer)
19. [Components Library](#19-components-library)
20. [Motion & Animation](#20-motion--animation)
21. [Ambient & Texture Effects](#21-ambient--texture-effects)
22. [Dark Mode](#22-dark-mode)
23. [Responsive Patterns](#23-responsive-patterns)
24. [Accessibility](#24-accessibility)
25. [Cursor System](#25-cursor-system)
26. [Copy & Voice Guidelines](#26-copy--voice-guidelines)
27. [Design Don'ts](#27-design-donts)
28. [Quick Reference](#28-quick-reference)

---

## 1. Tailwind Config

All Novaris tokens live in `tailwind.config.js`. This extends Tailwind's defaults — existing utilities still work. The Novaris scale prefixes all custom values with the design token name.

```js
// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}'],
  darkMode: 'class', // toggled via class="dark" on <html>
  theme: {
    extend: {

      // ── COLORS ───────────────────────────────────────
      colors: {
        // Scarlet accent
        scarlet: {
          DEFAULT: '#cc1f2e',   // light mode primary
          dark:    '#a8192a',   // light mode hover
          bright:  '#f03347',   // dark mode primary
          hover:   '#c92036',   // dark mode hover
        },
        // Steel blue (secondary, gradient ends only)
        steel: {
          DEFAULT: '#2d5f8a',
          bright:  '#5b99c9',
        },
        // Arctic white backgrounds (light mode)
        arctic: {
          DEFAULT: '#f4f7fb',   // primary bg
          soft:    '#edf0f6',   // alternate section bg
        },
        // Ink (light mode text base)
        ink: {
          DEFAULT: '#080e1c',
        },
        // Near-black (dark mode bg)
        void: {
          DEFAULT: '#090b10',
          soft:    '#0e1018',
        },
        // Off-white (dark mode text base)
        frost: {
          DEFAULT: '#e6eaf8',
        },
      },

      // ── TYPOGRAPHY ───────────────────────────────────
      fontFamily: {
        fraunces: ['Fraunces', ...fontFamily.serif],
        sans:     ['DM Sans', ...fontFamily.sans],
        mono:     ['IBM Plex Mono', ...fontFamily.mono],
      },

      fontSize: {
        // Mono label sizes
        'label-xs':  ['8.5px', { letterSpacing: '.05em' }],
        'label-sm':  ['9px',   { letterSpacing: '.24em' }],
        'label':     ['9.5px', { letterSpacing: '.06em' }],
        'label-md':  ['10px',  { letterSpacing: '.12em' }],
        // Body sizes
        'body-xs':   ['12px', { lineHeight: '1.60' }],
        'body-sm':   ['13px', { lineHeight: '1.68' }],
        'body':      ['14px', { lineHeight: '1.78' }],
        'body-lg':   ['15px', { lineHeight: '1.75' }],
        // UI sizes
        'cta':       ['11.5px', { letterSpacing: '.07em' }],
        'nav-link':  ['13px',   { letterSpacing: '.01em' }],
        // Display sizes (pair with font-fraunces)
        'h3':        ['17px',  { lineHeight: '1.2',  letterSpacing: '-.01em' }],
        'h3-lg':     ['20px',  { lineHeight: '1.2',  letterSpacing: '-.01em' }],
        'h2-sm':     ['30px',  { lineHeight: '1.06', letterSpacing: '-.02em' }],
        'h2':        ['40px',  { lineHeight: '1.06', letterSpacing: '-.02em' }],
        'h2-lg':     ['50px',  { lineHeight: '1.06', letterSpacing: '-.02em' }],
        'stat-sm':   ['28px',  { lineHeight: '1',    letterSpacing: '-.02em' }],
        'stat':      ['32px',  { lineHeight: '1',    letterSpacing: '-.02em' }],
        'stat-lg':   ['38px',  { lineHeight: '1',    letterSpacing: '-.02em' }],
        'benefit':   ['42px',  { lineHeight: '1',    letterSpacing: '-.02em' }],
        'hero-sm':   ['52px',  { lineHeight: '.92',  letterSpacing: '-.03em' }],
        'hero-lg':   ['114px', { lineHeight: '.92',  letterSpacing: '-.03em' }],
        'quote-sm':  ['18px',  { lineHeight: '1.46', letterSpacing: '-.01em' }],
        'quote-lg':  ['27px',  { lineHeight: '1.46', letterSpacing: '-.01em' }],
        'ghost-sm':  ['80px',  { lineHeight: '1',    letterSpacing: '-.04em' }],
        'ghost-lg':  ['200px', { lineHeight: '1',    letterSpacing: '-.04em' }],
      },

      // ── SPACING ──────────────────────────────────────
      // Novaris uses 4px base. Tailwind's default scale covers this.
      // Custom additions for section-level values:
      spacing: {
        '18': '72px',   // two-col gap
        '26': '104px',  // section vertical
        '28': '112px',  // section vertical lg
      },

      // ── MAX WIDTH ────────────────────────────────────
      maxWidth: {
        'content': '1100px',
        'quote':   '760px',
        'hero':    '900px',
        'hero-sub':'440px',
        'stat-strip': '720px',
      },

      // ── BORDER RADIUS ────────────────────────────────
      borderRadius: {
        'card': '6px',   // --r
        'badge': '4px',  // --r-sm
        // 'none' already in Tailwind (0px rows/dividers)
      },

      // ── ANIMATION ────────────────────────────────────
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '40%':      { transform: 'translate(-14px,22px) scale(1.04)' },
          '70%':      { transform: 'translate(16px,-14px) scale(.97)' },
        },
      },
      animation: {
        'fade-up':     'fadeUp .6s cubic-bezier(.22,1,.36,1) both',
        'fade-up-slow':'fadeUp .8s cubic-bezier(.22,1,.36,1) both',
        'orb-float':   'orbFloat 11s ease-in-out infinite',
        'orb-float-alt':'orbFloat 14s ease-in-out infinite reverse',
      },

      // ── TRANSITION TIMING ────────────────────────────
      transitionTimingFunction: {
        'spring': 'cubic-bezier(.22,1,.36,1)',
        'spring-bounce': 'cubic-bezier(.34,1.56,.64,1)',
      },
      transitionDuration: {
        'theme': '520ms',
      },

      // ── BACKDROP BLUR ────────────────────────────────
      backdropBlur: {
        'nav': '20px',
      },
    },
  },
  plugins: [],
}
```

### 1.1 Google Fonts Import

Place in your `<head>` or global CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?
  family=Fraunces:ital,opsz,wght@
    0,9..144,300;0,9..144,600;0,9..144,700;
    1,9..144,300;1,9..144,600;1,9..144,700
  &family=DM+Sans:opsz,wght@
    9..40,300;9..40,400;9..40,500;9..40,600
  &family=IBM+Plex+Mono:wght@400;500
  &display=swap" rel="stylesheet">
```

### 1.2 Base CSS (add to your global stylesheet)

A few things Tailwind utilities don't cover — grain overlay, custom cursor, CSS variables for opacity-based colors, and dark mode transitions.

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Novaris base layer */
@layer base {
  :root {
    /* Opacity-alpha text helpers — used with Tailwind arbitrary values */
    --ink: 8 14 28;        /* RGB channels for ink color */
    --frost: 230 234 248;  /* RGB channels for frost color */
  }

  html { scroll-behavior: smooth; }

  body {
    -webkit-font-smoothing: antialiased;
    cursor: none;
  }

  /* Grain overlay */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 900;
    opacity: .15;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.05'/%3E%3C/svg%3E");
  }

  /* Smooth theme transitions */
  *, *::before, *::after {
    transition-property: background-color, border-color, color;
    transition-duration: 520ms;
    transition-timing-function: cubic-bezier(.22,1,.36,1);
  }
  /* Override for elements that shouldn't all transition */
  button, a, [class*="transition"] {
    transition-property: none; /* re-apply specific transitions per component */
  }
}

/* Scroll reveal utility */
@layer utilities {
  .rev { opacity: 0; transform: translateY(20px); }
  .rev.vis {
    opacity: 1;
    transform: translateY(0);
    transition: opacity .68s cubic-bezier(.22,1,.36,1),
                transform .68s cubic-bezier(.22,1,.36,1);
  }
  .delay-1 { transition-delay: 60ms; }
  .delay-2 { transition-delay: 130ms; }
  .delay-3 { transition-delay: 200ms; }
  .delay-4 { transition-delay: 270ms; }
}
```

---

## 2. Brand Foundation

### 2.1 Name Rules
- ✅ `Novaris` — title case in all UI
- ✅ `novaris.com` — lowercase in URLs only
- ❌ `NOVARIS` — too aggressive
- ❌ `novaris` — never lowercase in prose

### 2.2 Logo Mark

```html
<!-- Logo: Fraunces + scarlet dot -->
<div class="flex items-center gap-[7px]">
  <div class="w-[7px] h-[7px] rounded-full bg-scarlet dark:bg-scarlet-bright shrink-0"></div>
  <span class="font-fraunces text-[18px] font-bold tracking-[-0.01em] text-ink dark:text-frost
               transition-colors duration-theme ease-spring">
    Novaris
  </span>
</div>
```

### 2.3 Brand Personality → Design Translation

| Trait | Tailwind Expression |
|-------|-------------------|
| Professional | `font-fraunces`, clean grid, `text-ink` |
| Smart | Stats everywhere, `font-mono` labels |
| Energetic | `bg-scarlet`, bold weight contrast |
| Approachable | `font-sans font-light`, warm backgrounds |
| Creative | Swiss asymmetry, `text-[clamp(...)]` hero scale |

---

## 3. Design Principles

These five rules govern every Tailwind class choice. When picking between options, run it through these.

| # | Principle | In Practice |
|---|-----------|-------------|
| P1 | **Swiss Precision** | `max-w-content mx-auto`, consistent `px-[52px]`, deliberate `gap-18` |
| P2 | **Typography Dominates** | `font-fraunces` leads every section, color/weight contrast before decoration |
| P3 | **Flat, Not Layered** | Zero `shadow-*` on cards. Use `gap-px bg-[var(--line)]` grid technique |
| P4 | **Seamless Flow** | `bg-arctic` → `bg-arctic-soft` alternation, gradient dividers not hard borders |
| P5 | **UX Before Aesthetics** | If a class doesn't aid comprehension or conversion, remove it |

---

## 4. Color Tokens → Tailwind Classes

### 4.1 Background Classes

| Token | Light class | Dark class | Section |
|-------|-------------|------------|---------|
| Primary bg | `bg-arctic` | `dark:bg-void` | Hero, Problem, Benefits, Footer |
| Alt bg | `bg-arctic-soft` | `dark:bg-void-soft` | Solution, Quote, Pricing |
| Contact bg | `bg-scarlet` | `dark:bg-scarlet-dark` | Contact only |

### 4.2 Text Classes

```
Primary text:    text-ink        dark:text-frost
Secondary text:  text-ink/50     dark:text-frost/50
Tertiary text:   text-ink/30     dark:text-frost/28
Accent text:     text-scarlet    dark:text-scarlet-bright
Secondary acc:   text-steel      dark:text-steel-bright
```

### 4.3 Border / Line Classes

```
Hairline:       border-ink/[.09]    dark:border-frost/[.08]
Strong border:  border-ink/[.16]    dark:border-frost/[.15]
```

### 4.4 Accent Fill Classes

```
Accent bg:      bg-scarlet          dark:bg-scarlet-bright
Accent hover:   hover:bg-scarlet-dark   dark:hover:bg-scarlet-hover
Featured tint:  bg-scarlet/[.07]    dark:bg-scarlet-bright/[.09]
Featured badge: bg-scarlet/[.14]    dark:bg-scarlet-bright/[.14]
```

### 4.5 Ambient / Glow

```
Orb 1 (scarlet):   bg-scarlet/[.08]      dark:bg-scarlet-bright/[.14]
Orb 2 (steel):     bg-steel/[.07]        dark:bg-steel-bright/[.10]
```

---

## 5. Typography → Tailwind Classes

### 5.1 Hero Headline

Three lines, one font, weight/color contrast only:

```html
<h1 class="max-w-hero mx-auto mb-8 text-center">
  <!-- Line A: light weight -->
  <span class="block font-fraunces font-light text-[clamp(52px,8vw,114px)]
               leading-[.92] tracking-[-0.03em] text-ink dark:text-frost">
    Know the
  </span>
  <!-- Line B: bold + accent -->
  <span class="block font-fraunces font-bold text-[clamp(52px,8vw,114px)]
               leading-[.92] tracking-[-0.03em] text-scarlet dark:text-scarlet-bright">
    risk.
  </span>
  <!-- Line C: light weight -->
  <span class="block font-fraunces font-light text-[clamp(52px,8vw,114px)]
               leading-[.92] tracking-[-0.03em] text-ink dark:text-frost">
    Win anyway.
  </span>
</h1>
```

**Rule:** One font (Fraunces), max two style changes per headline. Never switch to DM Sans in a display headline.

### 5.2 Section H2

```html
<!-- Standard -->
<h2 class="font-fraunces font-semibold text-[clamp(30px,3.6vw,50px)]
           leading-[1.06] tracking-[-0.02em] text-ink dark:text-frost">
  Most businesses are <em class="italic font-normal text-scarlet dark:text-scarlet-bright not-italic">flying blind.</em>
</h2>

<!-- With steel accent -->
<h2 class="font-fraunces font-semibold text-[clamp(30px,3.6vw,50px)]
           leading-[1.06] tracking-[-0.02em] text-ink dark:text-frost">
  Built for <span class="text-steel dark:text-steel-bright">how you work.</span>
</h2>
```

### 5.3 Section Eyebrow

```html
<div class="flex items-center gap-[10px] mb-[18px]
            font-mono text-[9px] tracking-[.24em] uppercase
            text-scarlet dark:text-scarlet-bright">
  <span class="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"></span>
  The problem
</div>
```

### 5.4 Body Text

```html
<!-- Standard body -->
<p class="font-sans font-light text-body text-ink/50 dark:text-frost/50 leading-[1.78]">

<!-- Large body (hero sub) -->
<p class="font-sans font-light text-body-lg text-ink/50 dark:text-frost/50 leading-[1.75]
          max-w-hero-sub mx-auto text-center">

<!-- Small body (card descriptions) -->
<p class="font-sans font-light text-body-sm text-ink/50 dark:text-frost/50 leading-[1.68]">
```

### 5.5 Stat Numbers

```html
<!-- Hero stat -->
<div class="font-fraunces font-semibold text-stat leading-none tracking-[-0.02em]
            text-scarlet dark:text-scarlet-bright">
  50%
</div>

<!-- Problem section stat (larger) -->
<div class="font-fraunces font-semibold text-[clamp(28px,3vw,38px)] leading-none
            tracking-[-0.02em] text-scarlet dark:text-scarlet-bright">
  87%
</div>

<!-- Benefit card number (large ghost) -->
<div class="font-fraunces font-semibold text-benefit leading-none
            tracking-[-0.02em] text-ink/[.16] dark:text-frost/[.15]
            group-hover:text-scarlet dark:group-hover:text-scarlet-bright
            transition-colors duration-300 ease-spring">
  01
</div>
```

### 5.6 Mono Labels

```html
<!-- Data source citation -->
<span class="font-mono text-[8.5px] tracking-[.05em] text-ink/30 dark:text-frost/28">
  US Bureau of Labor Statistics
</span>

<!-- Feature row index -->
<span class="font-mono text-[9.5px] tracking-[.06em] text-ink/30 dark:text-frost/28
             group-hover:text-scarlet dark:group-hover:text-scarlet-bright
             transition-colors duration-200">
  01
</span>

<!-- Badge -->
<span class="font-mono text-[9px] tracking-[.12em] uppercase
             px-[8px] py-[3px] rounded-badge
             bg-ink/[.05] text-ink/30 dark:bg-frost/[.05] dark:text-frost/28">
  Free to try
</span>
```

### 5.7 Quote Text

```html
<blockquote class="font-fraunces font-light italic
                   text-[clamp(18px,2.2vw,27px)] leading-[1.46] tracking-[-0.01em]
                   text-ink dark:text-frost mb-5">
  Risk isn't the enemy of ambition.
  <strong class="font-semibold not-italic text-scarlet dark:text-scarlet-bright">
    Unmanaged risk is.
  </strong>
  The businesses that win aren't the ones that avoided risk — they're the ones
  who understood it well enough to move faster than everyone else.
</blockquote>
```

---

## 6. Spacing & Grid → Tailwind Classes

### 6.1 Page Layout Shell

```html
<!-- Outer section wrapper -->
<section class="px-[52px] py-[100px] bg-arctic dark:bg-void
                max-sm:px-6 max-sm:py-[72px]
                transition-colors duration-theme ease-spring">

  <!-- Inner max-width container -->
  <div class="max-w-content mx-auto">
    <!-- content -->
  </div>

</section>

<!-- Alt background section -->
<section class="px-[52px] py-[100px] bg-arctic-soft dark:bg-void-soft ...">
```

### 6.2 Two-Column Grid

```html
<!-- Standard 2-col (problem, solution, pricing, contact) -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-18 items-start">
  <div><!-- left --></div>
  <div><!-- right --></div>
</div>
```

### 6.3 Flat Three-Column Grid (the key pattern)

No card borders or shadows. The `gap-px` + `bg-[...]` technique creates hairline dividers.

```html
<!-- 3-col flat grid — gap becomes the border -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px
            bg-ink/[.09] dark:bg-frost/[.08]
            border border-ink/[.09] dark:border-frost/[.08]
            rounded-card overflow-hidden">

  <!-- Each child restores its own background -->
  <div class="bg-arctic dark:bg-void p-8 ...">card content</div>
  <div class="bg-arctic dark:bg-void p-8 ...">card content</div>
  <div class="bg-arctic dark:bg-void p-8 ...">card content</div>

</div>

<!-- In alt sections (--bg-s background) -->
<div class="grid ... bg-ink/[.09] ... border ...">
  <div class="bg-arctic-soft dark:bg-void-soft p-8 ...">...</div>
</div>
```

### 6.4 Internal Spacing Reference

| Context | Tailwind class |
|---------|---------------|
| Eyebrow → H2 | `mb-[18px]` on eyebrow |
| H2 → body text | `mb-4` or `mb-[18px]` on H2 |
| Body → button | `mb-7` on paragraph |
| Card padding | `p-8` (32px all) or `px-7 py-8` |
| Feature row | `py-4 border-b border-ink/[.09] dark:border-frost/[.08]` |
| Stat row | `py-5 border-b border-ink/[.09] dark:border-frost/[.08]` |
| Plan item | `py-5 px-[22px]` |
| Chip | `py-[7px] px-[14px]` |
| Hero stat | `py-[22px]` per stat item |

---

## 7. Border Radius & Shape

```
Cards, buttons, chips:   rounded-card   (6px)
Badges, small tags:      rounded-badge  (4px)
Rows, dividers, grids:   rounded-none   (0px — always sharp)
```

**Rule:** Row-based elements (feature rows, stat rows, plan stacks) are always `rounded-none`. Only contained surfaces get rounding.

---

## 8. Elevation & Depth Philosophy

**No shadows. Ever on cards.**

| Effect needed | Tailwind solution |
|--------------|------------------|
| Card separation | `gap-px` + `bg-ink/[.09]` on grid container |
| Section break | `bg-arctic` → `bg-arctic-soft` alternation |
| Active/hover | `hover:bg-arctic dark:hover:bg-void` (from alt bg) |
| Emphasis | Fraunces weight contrast, `font-bold` vs `font-light` |
| CTA hierarchy | `bg-scarlet` vs transparent border button |

**Exceptions:**
- Nav scroll: `backdrop-blur-nav` — functional legibility, not decorative
- Contact aside: `backdrop-blur-sm` over solid red bg

```html
<!-- Nav scrolled state — only frosted glass allowed -->
<nav class="... data-[scrolled=true]:bg-arctic/[.88] dark:data-[scrolled=true]:bg-void/[.88]
            data-[scrolled=true]:backdrop-blur-nav
            data-[scrolled=true]:border-b data-[scrolled=true]:border-ink/[.09]">
```

---

## 9. Page Architecture

Section order and background assignments:

```
Nav          transparent → bg-arctic/88 frosted
Hero         bg-arctic       dark:bg-void
Problem      bg-arctic       dark:bg-void
Solution     bg-arctic-soft  dark:bg-void-soft
Quote        bg-arctic-soft  dark:bg-void-soft
Benefits     bg-arctic       dark:bg-void
Pricing      bg-arctic-soft  dark:bg-void-soft
Contact      bg-scarlet      dark:bg-scarlet-dark
Footer       bg-arctic       dark:bg-void
```

Between sections of the same background, a soft gradient divider line marks the transition:

```html
<!-- Section divider (place between same-bg sections) -->
<div class="h-px mx-[52px]
            bg-[linear-gradient(to_right,transparent_0%,rgb(8_14_28/.09)_10%,rgb(8_14_28/.09)_90%,transparent_100%)]
            dark:bg-[linear-gradient(to_right,transparent_0%,rgb(230_234_248/.08)_10%,rgb(230_234_248/.08)_90%,transparent_100%)]">
</div>
```

---

## 10. Section: Navigation

```html
<nav id="nav"
     class="fixed top-0 left-0 right-0 z-[200]
            flex items-center justify-between
            px-[52px] py-[18px]
            transition-all duration-theme ease-spring
            max-md:px-6">

  <!-- Logo -->
  <div class="flex items-center gap-[7px]">
    <div class="w-[7px] h-[7px] rounded-full bg-scarlet dark:bg-scarlet-bright
                transition-colors duration-theme ease-spring shrink-0"></div>
    <span class="font-fraunces font-bold text-[18px] tracking-[-0.01em]
                 text-ink dark:text-frost transition-colors duration-theme ease-spring">
      Novaris
    </span>
  </div>

  <!-- Center links (absolute to stay true-center) -->
  <ul class="hidden md:flex gap-7 list-none absolute left-1/2 -translate-x-1/2">
    <li><a href="#" class="font-sans text-nav-link font-normal text-ink/50 dark:text-frost/50
                           hover:text-ink dark:hover:text-frost
                           transition-colors duration-200 no-underline">Platform</a></li>
    <li><a href="#" class="font-sans text-nav-link font-normal text-ink/50 dark:text-frost/50
                           hover:text-ink dark:hover:text-frost
                           transition-colors duration-200 no-underline">Solutions</a></li>
    <li><a href="#" class="font-sans text-nav-link font-normal text-ink/50 dark:text-frost/50
                           hover:text-ink dark:hover:text-frost
                           transition-colors duration-200 no-underline">Pricing</a></li>
    <li><a href="#" class="font-sans text-nav-link font-normal text-ink/50 dark:text-frost/50
                           hover:text-ink dark:hover:text-frost
                           transition-colors duration-200 no-underline">About</a></li>
  </ul>

  <!-- Right: toggle + CTA -->
  <div class="flex items-center gap-[14px]">
    <!-- Theme toggle -->
    <button id="tog"
            class="w-[38px] h-[22px] rounded-full relative cursor-pointer
                   bg-ink/[.04] dark:bg-frost/[.04]
                   border border-ink/[.16] dark:border-frost/[.15]
                   transition-colors duration-theme ease-spring">
      <div class="absolute top-[3px] left-[3px] w-3 h-3 rounded-full
                  bg-scarlet dark:bg-scarlet-bright
                  transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]
                  dark:translate-x-4">
      </div>
    </button>

    <!-- CTA -->
    <button class="font-sans font-semibold text-cta uppercase tracking-[.07em]
                   px-5 py-2 rounded-card
                   bg-scarlet dark:bg-scarlet-bright text-white
                   hover:bg-scarlet-dark dark:hover:bg-scarlet-hover
                   hover:-translate-y-px
                   transition-all duration-200 ease-spring cursor-pointer border-0">
      Get Access
    </button>
  </div>
</nav>
```

**Nav scroll JS:**
```javascript
const nav = document.getElementById('nav')
window.addEventListener('scroll', () => {
  nav.dataset.scrolled = scrollY > 30 ? 'true' : 'false'
})
```

---

## 11. Section: Hero

```html
<section class="min-h-screen flex flex-col items-center justify-center text-center
                px-[5%] pt-[120px] pb-16
                bg-arctic dark:bg-void relative overflow-hidden
                transition-colors duration-theme ease-spring">

  <!-- Ambient orbs -->
  <div class="absolute inset-0 pointer-events-none
              bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgb(204_31_46/.08)_0%,transparent_70%),radial-gradient(ellipse_40%_35%_at_80%_80%,rgb(45_95_138/.07)_0%,transparent_60%)]
              dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgb(240_51_71/.14)_0%,transparent_70%),radial-gradient(ellipse_40%_35%_at_80%_80%,rgb(91_153_201/.10)_0%,transparent_60%)]">
  </div>

  <!-- Vertical rule anchor -->
  <div class="w-px h-[60px] mx-auto mb-7
              bg-[linear-gradient(to_bottom,transparent,rgb(8_14_28/.16))]
              dark:bg-[linear-gradient(to_bottom,transparent,rgb(230_234_248/.15))]
              animate-fade-up [animation-delay:50ms]">
  </div>

  <!-- Eyebrow -->
  <div class="flex items-center gap-[10px] mb-8
              font-mono text-[9.5px] tracking-[.24em] uppercase
              text-scarlet dark:text-scarlet-bright
              animate-fade-up [animation-delay:120ms]
              transition-colors duration-theme ease-spring">
    <span class="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"></span>
    Risk Intelligence Platform
  </div>

  <!-- Headline -->
  <h1 class="max-w-hero mx-auto mb-8 animate-fade-up-slow [animation-delay:200ms]">
    <span class="block font-fraunces font-light text-[clamp(52px,8vw,114px)]
                 leading-[.92] tracking-[-0.03em] text-ink dark:text-frost
                 transition-colors duration-theme ease-spring">
      Know the
    </span>
    <span class="block font-fraunces font-bold text-[clamp(52px,8vw,114px)]
                 leading-[.92] tracking-[-0.03em] text-scarlet dark:text-scarlet-bright
                 transition-colors duration-theme ease-spring">
      risk.
    </span>
    <span class="block font-fraunces font-light text-[clamp(52px,8vw,114px)]
                 leading-[.92] tracking-[-0.03em] text-ink dark:text-frost
                 transition-colors duration-theme ease-spring">
      Win anyway.
    </span>
  </h1>

  <!-- Subtext -->
  <p class="max-w-hero-sub mx-auto mb-9 font-sans font-light text-body-lg
            text-ink/50 dark:text-frost/50 leading-[1.75]
            animate-fade-up [animation-delay:300ms]
            transition-colors duration-theme ease-spring">
    Novaris gives business owners a live, structured view of every risk that matters —
    so decisions land with conviction, not guesswork.
  </p>

  <!-- CTA buttons -->
  <div class="flex gap-3 items-center justify-center mb-[72px]
              animate-fade-up [animation-delay:380ms]">

    <!-- Primary -->
    <button class="font-sans font-semibold text-cta uppercase tracking-[.07em]
                   px-7 py-3 rounded-card
                   bg-scarlet dark:bg-scarlet-bright text-white
                   hover:bg-scarlet-dark dark:hover:bg-scarlet-hover
                   hover:-translate-y-0.5
                   transition-all duration-200 ease-spring border-0 cursor-pointer">
      Start Free Trial
    </button>

    <!-- Ghost -->
    <button class="font-sans font-normal text-[13px] text-ink/30 dark:text-frost/28
                   bg-transparent border-0 cursor-pointer flex items-center gap-1
                   hover:text-ink dark:hover:text-frost transition-colors duration-200">
      See how it works →
    </button>

  </div>

  <!-- Stat strip -->
  <div class="flex items-stretch w-full max-w-stat-strip mx-auto
              border-t border-b border-ink/[.09] dark:border-frost/[.08]
              animate-fade-up [animation-delay:480ms]
              transition-colors duration-theme ease-spring
              max-sm:flex-col">

    <div class="flex-1 py-[22px] flex flex-col items-center gap-1
                border-r border-ink/[.09] dark:border-frost/[.08]
                max-sm:border-r-0 max-sm:border-b max-sm:border-ink/[.09]">
      <div class="font-fraunces font-semibold text-stat leading-none tracking-[-0.02em]
                  text-scarlet dark:text-scarlet-bright transition-colors duration-theme ease-spring">
        50%
      </div>
      <div class="font-sans text-[11.5px] text-ink/50 dark:text-frost/50 text-center max-w-[130px] leading-[1.3]">
        of businesses fail by year five
      </div>
      <div class="font-mono text-[9px] tracking-[.06em] text-ink/30 dark:text-frost/28">
        US Bureau of Labor Statistics
      </div>
    </div>

    <div class="flex-1 py-[22px] flex flex-col items-center gap-1
                border-r border-ink/[.09] dark:border-frost/[.08]
                max-sm:border-r-0 max-sm:border-b max-sm:border-ink/[.09]">
      <div class="font-fraunces font-semibold text-stat leading-none tracking-[-0.02em]
                  text-scarlet dark:text-scarlet-bright transition-colors duration-theme ease-spring">73%</div>
      <div class="font-sans text-[11.5px] text-ink/50 dark:text-frost/50 text-center max-w-[130px] leading-[1.3]">
        cite economic uncertainty as #1 risk
      </div>
      <div class="font-mono text-[9px] tracking-[.06em] text-ink/30 dark:text-frost/28">Gitnux Report 2024</div>
    </div>

    <div class="flex-1 py-[22px] flex flex-col items-center gap-1">
      <div class="font-fraunces font-semibold text-stat leading-none tracking-[-0.02em]
                  text-scarlet dark:text-scarlet-bright transition-colors duration-theme ease-spring">11%</div>
      <div class="font-sans text-[11.5px] text-ink/50 dark:text-frost/50 text-center max-w-[130px] leading-[1.3]">
        use risk management strategically
      </div>
      <div class="font-mono text-[9px] tracking-[.06em] text-ink/30 dark:text-frost/28">PwC Pulse Survey 2024</div>
    </div>

  </div>
</section>
```

---

## 12. Section: Problem

```html
<section class="px-[52px] py-[100px] bg-arctic dark:bg-void
                transition-colors duration-theme ease-spring max-sm:px-6 max-sm:py-[72px]">
  <div class="max-w-content mx-auto">

    <!-- Top 2-col grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-18 items-start mb-12 rev">

      <!-- Left: headline + body -->
      <div>
        <!-- Eyebrow -->
        <div class="flex items-center gap-[10px] mb-[18px]
                    font-mono text-[9px] tracking-[.24em] uppercase
                    text-scarlet dark:text-scarlet-bright">
          <span class="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"></span>
          The problem
        </div>
        <h2 class="font-fraunces font-semibold text-[clamp(30px,3.6vw,50px)]
                   leading-[1.06] tracking-[-0.02em] text-ink dark:text-frost mb-4">
          Most businesses are
          <em class="italic font-normal text-scarlet dark:text-scarlet-bright">flying blind.</em>
        </h2>
        <p class="font-sans font-light text-body text-ink/50 dark:text-frost/50 leading-[1.78] max-w-[380px]">
          You're making high-stakes decisions every day. Without a structured view of risk,
          you're operating on instinct alone. That's not strategy. That's exposure.
        </p>
      </div>

      <!-- Right: stat rows (no cards — pure typography) -->
      <div class="flex flex-col">

        <!-- Stat row pattern (repeat × 3) -->
        <div class="grid grid-cols-[80px_1fr] gap-5 items-start
                    py-5 border-b border-ink/[.09] dark:border-frost/[.08]
                    first:border-t first:border-ink/[.09] dark:first:border-t dark:first:border-frost/[.08]">
          <div class="font-fraunces font-semibold text-[clamp(28px,3vw,38px)] leading-none
                      tracking-[-0.02em] text-scarlet dark:text-scarlet-bright">
            87%
          </div>
          <div>
            <p class="font-sans font-medium text-[13.5px] text-ink dark:text-frost leading-[1.38] mb-[3px]">
              of risk professionals say processes aren't acted on inside their company.
            </p>
            <span class="font-mono text-[8.5px] tracking-[.05em] text-ink/30 dark:text-frost/28">
              Gitnux Risk Management Report
            </span>
          </div>
        </div>

        <div class="grid grid-cols-[80px_1fr] gap-5 items-start
                    py-5 border-b border-ink/[.09] dark:border-frost/[.08]">
          <div class="font-fraunces font-semibold text-[clamp(28px,3vw,38px)] leading-none
                      tracking-[-0.02em] text-scarlet dark:text-scarlet-bright">33%</div>
          <div>
            <p class="font-sans font-medium text-[13.5px] text-ink dark:text-frost leading-[1.38] mb-[3px]">
              of organizations have no Chief Risk Officer — leaving decisions to chance.
            </p>
            <span class="font-mono text-[8.5px] tracking-[.05em] text-ink/30 dark:text-frost/28">
              Gitnux Risk Management Report
            </span>
          </div>
        </div>

        <div class="grid grid-cols-[80px_1fr] gap-5 items-start
                    py-5 border-b border-ink/[.09] dark:border-frost/[.08]">
          <div class="font-fraunces font-semibold text-[clamp(28px,3vw,38px)] leading-none
                      tracking-[-0.02em] text-scarlet dark:text-scarlet-bright">40%</div>
          <div>
            <p class="font-sans font-medium text-[13.5px] text-ink dark:text-frost leading-[1.38] mb-[3px]">
              of executives cite cyber attacks as serious risk, yet most SMBs lack a response plan.
            </p>
            <span class="font-mono text-[8.5px] tracking-[.05em] text-ink/30 dark:text-frost/28">
              PwC Pulse Survey 2024
            </span>
          </div>
        </div>

      </div>
    </div>

    <!-- 3-col flat problem cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-px
                bg-ink/[.09] dark:bg-frost/[.08]
                border border-ink/[.09] dark:border-frost/[.08]
                rounded-card overflow-hidden rev">

      <!-- Card pattern (repeat × 3) -->
      <div class="bg-arctic dark:bg-void p-8 cursor-default
                  hover:bg-arctic-soft dark:hover:bg-void-soft
                  transition-colors duration-200 ease-spring">
        <div class="font-mono text-[9px] tracking-[.18em] uppercase
                    text-scarlet dark:text-scarlet-bright mb-4">
          01 — Reactive
        </div>
        <h3 class="font-fraunces font-semibold text-[19px] leading-[1.2] tracking-[-0.01em]
                   text-ink dark:text-frost mb-[10px]">
          You find out too late.
        </h3>
        <p class="font-sans font-light text-body-sm text-ink/50 dark:text-frost/50 leading-[1.68]">
          By the time most businesses notice a risk, it's already a problem. Reactive management
          is expensive management.
        </p>
      </div>

      <div class="bg-arctic dark:bg-void p-8 cursor-default
                  hover:bg-arctic-soft dark:hover:bg-void-soft
                  transition-colors duration-200 ease-spring">
        <div class="font-mono text-[9px] tracking-[.18em] uppercase text-scarlet dark:text-scarlet-bright mb-4">02 — Scattered</div>
        <h3 class="font-fraunces font-semibold text-[19px] leading-[1.2] tracking-[-0.01em] text-ink dark:text-frost mb-[10px]">Risk lives in a spreadsheet. If at all.</h3>
        <p class="font-sans font-light text-body-sm text-ink/50 dark:text-frost/50 leading-[1.68]">Across emails, docs, and gut feel — risk is buried, siloed, never in one place. Nobody has the full picture.</p>
      </div>

      <div class="bg-arctic dark:bg-void p-8 cursor-default
                  hover:bg-arctic-soft dark:hover:bg-void-soft
                  transition-colors duration-200 ease-spring">
        <div class="font-mono text-[9px] tracking-[.18em] uppercase text-scarlet dark:text-scarlet-bright mb-4">03 — Complex</div>
        <h3 class="font-fraunces font-semibold text-[19px] leading-[1.2] tracking-[-0.01em] text-ink dark:text-frost mb-[10px]">Tools built for enterprises, not owners.</h3>
        <p class="font-sans font-light text-body-sm text-ink/50 dark:text-frost/50 leading-[1.68]">Most risk platforms are built for 500-person compliance teams — slow, painful, wrong pace for business owners.</p>
      </div>

    </div>
  </div>
</section>
```

---

## 13. Section: Solution & Features

```html
<section class="px-[52px] py-[100px] bg-arctic-soft dark:bg-void-soft
                transition-colors duration-theme ease-spring max-sm:px-6">
  <div class="max-w-content mx-auto">

    <!-- 2-col grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-18 items-start mb-12">

      <!-- Left -->
      <div class="rev">
        <div class="flex items-center gap-[10px] mb-[18px] font-mono text-[9px]
                    tracking-[.24em] uppercase text-scarlet dark:text-scarlet-bright">
          <span class="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"></span>
          The solution
        </div>
        <h2 class="font-fraunces font-semibold text-[clamp(30px,3.6vw,50px)]
                   leading-[1.06] tracking-[-0.02em] text-ink dark:text-frost mb-4">
          Risk management built for
          <span class="text-steel dark:text-steel-bright">how you work.</span>
        </h2>
        <p class="font-sans font-light text-body text-ink/50 dark:text-frost/50 leading-[1.78] max-w-[360px] mb-7">
          Novaris connects to your tools, maps your exposure automatically, and surfaces
          only what needs your attention — without demanding your time every day.
        </p>
        <button class="font-sans font-semibold text-cta uppercase tracking-[.07em]
                       px-7 py-3 rounded-card
                       bg-scarlet dark:bg-scarlet-bright text-white
                       hover:bg-scarlet-dark dark:hover:bg-scarlet-hover hover:-translate-y-0.5
                       transition-all duration-200 ease-spring border-0 cursor-pointer">
          Explore the Platform
        </button>
      </div>

      <!-- Right: feature rows -->
      <div class="flex flex-col rev delay-2">

        <!-- Feature row pattern (group for hover) — repeat × 5 -->
        <div class="group grid grid-cols-[28px_1fr_16px] gap-[14px] items-start
                    py-4 border-b border-ink/[.09] dark:border-frost/[.08]
                    first:border-t first:border-ink/[.09] dark:first:border-t dark:first:border-frost/[.08]
                    cursor-pointer">
          <!-- Index -->
          <span class="font-mono text-[9.5px] tracking-[.06em] text-ink/30 dark:text-frost/28 pt-[2px]
                       group-hover:text-scarlet dark:group-hover:text-scarlet-bright transition-colors duration-200">
            01
          </span>
          <!-- Text -->
          <div>
            <div class="font-sans font-medium text-[13.5px] text-ink dark:text-frost mb-[2px]">
              Operational Risk Mapping
            </div>
            <div class="font-sans font-light text-[12px] text-ink/30 dark:text-frost/28 leading-[1.55]">
              Identify weak points before they become incidents.
            </div>
          </div>
          <!-- Arrow -->
          <span class="font-sans text-[12px] text-scarlet dark:text-scarlet-bright pt-[2px]
                       opacity-0 -translate-x-1
                       group-hover:opacity-100 group-hover:translate-x-0
                       transition-all duration-200 ease-spring">
            →
          </span>
        </div>

        <!-- Repeat pattern for 02–05 (Financial Exposure Tracking, Compliance Engine,
             Smart Alert Routing, Scenario Modeling) -->

      </div>
    </div>

    <!-- Chip scroll strip -->
    <div class="flex overflow-x-auto gap-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rev">
      <!-- Chip pattern — repeat for each capability -->
      <div class="flex-none font-mono text-[9.5px] tracking-[.1em] uppercase
                  text-ink/50 dark:text-frost/50 py-[7px] px-[14px]
                  rounded-card border border-ink/[.09] dark:border-frost/[.08]
                  bg-transparent whitespace-nowrap cursor-pointer
                  hover:bg-scarlet dark:hover:bg-scarlet-bright hover:text-white
                  hover:border-scarlet dark:hover:border-scarlet-bright
                  transition-all duration-200 ease-spring">
        Integrations
      </div>
      <!-- API Access · Team Collaboration · Custom Dashboards · Incident Playbooks
           Audit Trails · Role-based Access · Mobile Ready -->
    </div>

  </div>
</section>
```

---

## 14. Section: Quote

```html
<section class="px-[52px] py-[88px] bg-arctic-soft dark:bg-void-soft
                transition-colors duration-theme ease-spring max-sm:px-6">
  <div class="max-w-content mx-auto">
    <div class="max-w-quote rev">

      <!-- Quote mark + text -->
      <div class="grid grid-cols-[40px_1fr] gap-7 items-start">

        <!-- Quote mark -->
        <div class="font-fraunces font-bold text-[56px] leading-[.7]
                    text-scarlet dark:text-scarlet-bright transition-colors duration-theme ease-spring">
          "
        </div>

        <!-- Text + attribution -->
        <div>
          <blockquote class="font-fraunces font-light italic
                             text-[clamp(18px,2.2vw,27px)] leading-[1.46] tracking-[-0.01em]
                             text-ink dark:text-frost mb-5
                             transition-colors duration-theme ease-spring">
            Risk isn't the enemy of ambition.
            <strong class="font-semibold not-italic text-scarlet dark:text-scarlet-bright">
              Unmanaged risk is.
            </strong>
            The businesses that win aren't the ones that avoided risk — they're the ones
            who understood it well enough to move faster than everyone else.
          </blockquote>
          <div class="flex items-center gap-[10px]
                      font-sans text-[11px] text-ink/30 dark:text-frost/28 tracking-[.06em]
                      transition-colors duration-theme ease-spring">
            <span class="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"></span>
            Aon Risk Solutions — 2024 Global Risk Management Report
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
```

---

## 15. Section: Benefits

```html
<section class="px-[52px] py-[100px] bg-arctic dark:bg-void
                transition-colors duration-theme ease-spring max-sm:px-6">
  <div class="max-w-content mx-auto">

    <!-- Header row -->
    <div class="flex items-end justify-between gap-8 mb-12
                max-lg:flex-col max-lg:items-start rev">
      <h2 class="font-fraunces font-semibold text-[clamp(30px,3.6vw,50px)]
                 leading-[1.06] tracking-[-0.02em] text-ink dark:text-frost">
        What changes when<br>you use Novaris.
      </h2>
      <p class="max-w-[230px] font-sans font-light text-[13px] text-ink/30 dark:text-frost/28
                leading-[1.65] pl-6 border-l border-ink/[.09] dark:border-frost/[.08]
                max-lg:border-l-0 max-lg:pl-0 max-lg:border-t max-lg:border-ink/[.09] max-lg:pt-4
                transition-colors duration-theme ease-spring">
        Not a feature list. Real shifts in how your business operates day to day.
      </p>
    </div>

    <!-- 3-col flat benefit cards (group enables hover children) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px
                bg-ink/[.09] dark:bg-frost/[.08]
                border border-ink/[.09] dark:border-frost/[.08]
                rounded-card overflow-hidden">

      <!-- Benefit card (group + relative for ::before gradient bar simulation) -->
      <div class="group relative bg-arctic-soft dark:bg-void-soft p-8 cursor-pointer overflow-hidden
                  hover:bg-arctic dark:hover:bg-void transition-colors duration-200 ease-spring rev delay-1">

        <!-- Top accent bar (scale-x on hover via pseudo) -->
        <!-- Tailwind can't target ::before directly, use a div instead -->
        <div class="absolute top-0 left-0 right-0 h-[2px]
                    bg-gradient-to-r from-scarlet to-steel
                    scale-x-0 group-hover:scale-x-100 origin-left
                    transition-transform duration-[380ms] ease-spring">
        </div>

        <!-- Number -->
        <div class="font-fraunces font-semibold text-benefit leading-none tracking-[-0.02em] mb-[18px]
                    text-ink/[.16] dark:text-frost/[.15]
                    group-hover:text-scarlet dark:group-hover:text-scarlet-bright
                    transition-colors duration-300 ease-spring">
          01
        </div>
        <h3 class="font-fraunces font-semibold text-[17px] leading-[1.2] tracking-[-0.01em]
                   text-ink dark:text-frost mb-[10px]">
          Decisions land with conviction
        </h3>
        <p class="font-sans font-light text-body-sm text-ink/50 dark:text-frost/50 leading-[1.7]">
          With a clear risk picture, second-guessing turns into momentum.
          Clarity is a competitive advantage — treat it that way.
        </p>
      </div>

      <!-- Repeat for 02 "Catch problems before they cost you" -->
      <!-- Repeat for 03 "Risk management stops being a job" -->

    </div>
  </div>
</section>
```

---

## 16. Section: Pricing Tease

```html
<section class="px-[52px] py-[100px] bg-arctic-soft dark:bg-void-soft relative overflow-hidden
                transition-colors duration-theme ease-spring max-sm:px-6">

  <!-- Ghost background text -->
  <div class="absolute right-[-10px] bottom-[-24px] pointer-events-none select-none
              font-fraunces font-bold text-[clamp(80px,12vw,180px)] leading-none tracking-[-0.04em]
              text-transparent [-webkit-text-stroke:1px_rgb(8_14_28/.09)]
              dark:[-webkit-text-stroke:1px_rgb(230_234_248/.08)]">
    PLANS
  </div>

  <div class="max-w-content mx-auto relative z-[2]">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-18 items-center">

      <!-- Left: copy -->
      <div class="rev">
        <div class="flex items-center gap-[10px] mb-[18px] font-mono text-[9px]
                    tracking-[.24em] uppercase text-scarlet dark:text-scarlet-bright">
          <span class="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"></span>
          Pricing
        </div>
        <h2 class="font-fraunces font-semibold text-[clamp(30px,3.6vw,50px)]
                   leading-[1.06] tracking-[-0.02em] text-ink dark:text-frost mb-4">
          Plans that
          <em class="italic font-normal text-scarlet dark:text-scarlet-bright">scale with you.</em>
        </h2>
        <p class="font-sans font-light text-body text-ink/50 dark:text-frost/50 leading-[1.78] max-w-[340px] mb-7">
          Whether you're running a lean team or a complex portfolio — there's a plan
          that fits where you are. No bloated contracts.
        </p>
        <div class="flex gap-[10px] items-center">
          <button class="font-sans font-semibold text-cta uppercase tracking-[.07em]
                         px-7 py-3 rounded-card bg-scarlet dark:bg-scarlet-bright text-white
                         hover:bg-scarlet-dark hover:-translate-y-0.5
                         transition-all duration-200 ease-spring border-0 cursor-pointer">
            See Full Pricing
          </button>
          <button class="font-sans font-normal text-[13px] text-ink/30 dark:text-frost/28
                         bg-transparent border-0 cursor-pointer flex items-center gap-1
                         hover:text-ink dark:hover:text-frost transition-colors duration-200">
            Talk to us →
          </button>
        </div>
      </div>

      <!-- Right: plan stack -->
      <div class="flex flex-col gap-px bg-ink/[.09] dark:bg-frost/[.08]
                  border border-ink/[.09] dark:border-frost/[.08]
                  rounded-card overflow-hidden rev delay-2">

        <!-- Plan item — standard -->
        <div class="group flex items-center justify-between px-[22px] py-5
                    bg-arctic-soft dark:bg-void-soft cursor-pointer
                    hover:bg-arctic dark:hover:bg-void transition-colors duration-200 ease-spring">
          <div>
            <div class="font-fraunces font-semibold text-[16px] tracking-[-0.01em]
                        text-ink dark:text-frost">Starter</div>
            <div class="font-sans text-[12px] text-ink/30 dark:text-frost/28 mt-[2px]">
              For solo owners and small teams
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-mono text-[9px] tracking-[.1em] uppercase px-[8px] py-[3px]
                         rounded-badge bg-ink/[.05] dark:bg-frost/[.05] text-ink/30 dark:text-frost/28">
              Free to try
            </span>
            <span class="font-sans text-[12px] text-scarlet dark:text-scarlet-bright
                         opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
                         transition-all duration-200 ease-spring">→</span>
          </div>
        </div>

        <!-- Plan item — featured (Growth) -->
        <div class="group flex items-center justify-between px-[22px] py-5 cursor-pointer
                    bg-scarlet/[.07] dark:bg-scarlet-bright/[.09]
                    hover:bg-scarlet/[.10] dark:hover:bg-scarlet-bright/[.12]
                    transition-colors duration-200 ease-spring">
          <div>
            <div class="font-fraunces font-semibold text-[16px] tracking-[-0.01em]
                        text-scarlet dark:text-scarlet-bright">Growth</div>
            <div class="font-sans text-[12px] text-ink/30 dark:text-frost/28 mt-[2px]">
              For scaling businesses, full feature set
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-mono text-[9px] tracking-[.1em] uppercase px-[8px] py-[3px]
                         rounded-badge bg-scarlet/[.14] dark:bg-scarlet-bright/[.14]
                         text-scarlet dark:text-scarlet-bright">
              Most popular
            </span>
            <span class="font-sans text-[12px] text-scarlet dark:text-scarlet-bright
                         opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
                         transition-all duration-200 ease-spring">→</span>
          </div>
        </div>

        <!-- Plan item — Enterprise -->
        <div class="group flex items-center justify-between px-[22px] py-5
                    bg-arctic-soft dark:bg-void-soft cursor-pointer
                    hover:bg-arctic dark:hover:bg-void transition-colors duration-200 ease-spring">
          <div>
            <div class="font-fraunces font-semibold text-[16px] tracking-[-0.01em]
                        text-ink dark:text-frost">Enterprise</div>
            <div class="font-sans text-[12px] text-ink/30 dark:text-frost/28 mt-[2px]">
              Custom integrations, dedicated support
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-mono text-[9px] tracking-[.1em] uppercase px-[8px] py-[3px]
                         rounded-badge bg-ink/[.05] dark:bg-frost/[.05] text-ink/30 dark:text-frost/28">
              Contact us
            </span>
            <span class="font-sans text-[12px] text-scarlet dark:text-scarlet-bright
                         opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
                         transition-all duration-200 ease-spring">→</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
```

---

## 17. Section: Contact / CTA

```html
<section class="px-[52px] py-[100px] bg-scarlet dark:bg-[#8a1520] relative overflow-hidden
                max-sm:px-6">

  <!-- Metallic shimmer top line -->
  <div class="absolute top-0 left-0 right-0 h-px
              bg-[linear-gradient(to_right,transparent_5%,rgba(210,225,240,.3)_25%,rgba(255,255,255,.55)_50%,rgba(210,225,240,.3)_75%,transparent_95%)]">
  </div>

  <!-- Ghost text -->
  <div class="absolute right-[-8px] bottom-[-40px] pointer-events-none select-none
              font-fraunces font-bold text-[clamp(90px,13vw,200px)] leading-none
              tracking-[-0.04em] text-white/[.04] whitespace-nowrap">
    NOVARIS
  </div>

  <div class="max-w-content mx-auto relative z-[2]">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">

      <!-- Left -->
      <div>
        <div class="font-mono text-[9px] tracking-[.22em] uppercase
                    text-white/35 mb-[18px]">
          No credit card needed · Setup in under 10 minutes
        </div>
        <h2 class="font-fraunces font-semibold italic
                   text-[clamp(32px,4.8vw,62px)] leading-[.98] tracking-[-0.025em]
                   text-white mb-4">
          Less worry.<br>
          <span class="font-light not-italic text-white/45">More momentum.</span>
        </h2>
        <p class="font-sans font-light text-[14px] leading-[1.72] text-white/42
                  max-w-[340px] mb-[30px]">
          Join thousands of business owners who've moved from reactive to ready.
          Start free, upgrade when it makes sense.
        </p>
        <div class="flex gap-[10px] items-center">
          <!-- White primary -->
          <button class="font-sans font-bold text-[11px] uppercase tracking-[.08em]
                         px-[26px] py-3 rounded-card bg-white text-scarlet
                         hover:opacity-90 hover:-translate-y-0.5
                         transition-all duration-200 ease-spring border-0 cursor-pointer">
            Start Free Trial
          </button>
          <!-- Outline -->
          <button class="font-sans text-[12px] text-white/42
                         bg-transparent border border-white/20 rounded-card
                         px-5 py-[11px] cursor-pointer
                         hover:border-white/50 hover:text-white/70
                         transition-all duration-200">
            Book a Demo
          </button>
        </div>
      </div>

      <!-- Right: feature checklist aside -->
      <div class="min-w-[200px] rounded-card
                  bg-white/[.07] border border-white/[.10]
                  backdrop-blur-sm p-6">
        <div class="font-mono text-[8.5px] tracking-[.16em] uppercase
                    text-white/32 mb-4">
          What you get on day one
        </div>
        <!-- Row with green dot -->
        <div class="flex items-center gap-[10px] font-sans text-[12.5px] text-white/52
                    py-[7px] border-b border-white/[.07] last:border-0">
          <div class="w-[5px] h-[5px] rounded-full bg-[#6fcf97] shrink-0"></div>
          Live risk dashboard
        </div>
        <div class="flex items-center gap-[10px] font-sans text-[12.5px] text-white/52
                    py-[7px] border-b border-white/[.07]">
          <div class="w-[5px] h-[5px] rounded-full bg-[#6fcf97] shrink-0"></div>
          Operational risk map
        </div>
        <div class="flex items-center gap-[10px] font-sans text-[12.5px] text-white/52
                    py-[7px] border-b border-white/[.07]">
          <div class="w-[5px] h-[5px] rounded-full bg-[#6fcf97] shrink-0"></div>
          Compliance monitoring
        </div>
        <div class="flex items-center gap-[10px] font-sans text-[12.5px] text-white/52
                    py-[7px] border-b border-white/[.07]">
          <div class="w-[5px] h-[5px] rounded-full bg-[#6fcf97] shrink-0"></div>
          Smart alert routing
        </div>
        <!-- Grey dot — Growth+ -->
        <div class="flex items-center gap-[10px] font-sans text-[12.5px] text-white/52
                    py-[7px] border-b border-white/[.07]">
          <div class="w-[5px] h-[5px] rounded-full bg-white/25 shrink-0"></div>
          Scenario modeling (Growth+)
        </div>
        <div class="flex items-center gap-[10px] font-sans text-[12.5px] text-white/52
                    py-[7px]">
          <div class="w-[5px] h-[5px] rounded-full bg-white/25 shrink-0"></div>
          Team access (Growth+)
        </div>
      </div>

    </div>
  </div>
</section>
```

---

## 18. Section: Footer

```html
<footer class="px-[52px] py-7 border-t border-ink/[.09] dark:border-frost/[.08]
               bg-arctic dark:bg-void
               flex items-center justify-between flex-wrap gap-3
               transition-colors duration-theme ease-spring max-sm:px-6">

  <span class="font-fraunces font-semibold text-[15px] text-ink/30 dark:text-frost/28">
    Novaris
  </span>

  <span class="font-mono text-[9.5px] tracking-[.05em] text-ink/30 dark:text-frost/28">
    © 2025 Novaris Inc. — All rights reserved.
  </span>

  <div class="flex gap-5">
    <a href="#" class="font-sans text-[12px] text-ink/30 dark:text-frost/28
                       hover:text-ink dark:hover:text-frost no-underline transition-colors duration-200">
      Privacy
    </a>
    <a href="#" class="font-sans text-[12px] text-ink/30 dark:text-frost/28
                       hover:text-ink dark:hover:text-frost no-underline transition-colors duration-200">
      Terms
    </a>
    <a href="#" class="font-sans text-[12px] text-ink/30 dark:text-frost/28
                       hover:text-ink dark:hover:text-frost no-underline transition-colors duration-200">
      Contact
    </a>
  </div>

</footer>
```

---

## 19. Components Library

### 19.1 Primary Button
```html
<button class="font-sans font-semibold text-[11.5px] uppercase tracking-[.07em]
               px-7 py-3 rounded-card bg-scarlet dark:bg-scarlet-bright text-white
               hover:bg-scarlet-dark dark:hover:bg-scarlet-hover hover:-translate-y-0.5
               transition-all duration-200 ease-spring border-0 cursor-pointer">
  Start Free Trial
</button>
```

### 19.2 Ghost / Text Button
```html
<button class="font-sans font-normal text-[13px] text-ink/30 dark:text-frost/28
               bg-transparent border-0 cursor-pointer flex items-center gap-1
               hover:text-ink dark:hover:text-frost transition-colors duration-200">
  See how it works →
</button>
```

### 19.3 Eyebrow Label
```html
<div class="flex items-center gap-[10px] mb-[18px]
            font-mono text-[9px] tracking-[.24em] uppercase
            text-scarlet dark:text-scarlet-bright
            transition-colors duration-theme ease-spring">
  <span class="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0 transition-colors duration-theme ease-spring"></span>
  Section label
</div>
```

### 19.4 Feature Row (with group hover)
```html
<div class="group grid grid-cols-[28px_1fr_16px] gap-[14px] items-start
            py-4 border-b border-ink/[.09] dark:border-frost/[.08]
            first:border-t cursor-pointer">
  <span class="font-mono text-[9.5px] text-ink/30 dark:text-frost/28 pt-[2px]
               group-hover:text-scarlet dark:group-hover:text-scarlet-bright transition-colors duration-200">01</span>
  <div>
    <div class="font-sans font-medium text-[13.5px] text-ink dark:text-frost mb-[2px]">Feature Name</div>
    <div class="font-sans font-light text-[12px] text-ink/30 dark:text-frost/28 leading-[1.55]">Description.</div>
  </div>
  <span class="font-sans text-[12px] text-scarlet dark:text-scarlet-bright pt-[2px]
               opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
               transition-all duration-200 ease-spring">→</span>
</div>
```

### 19.5 Chip
```html
<div class="flex-none font-mono text-[9.5px] tracking-[.1em] uppercase
            text-ink/50 dark:text-frost/50 py-[7px] px-[14px]
            rounded-card border border-ink/[.09] dark:border-frost/[.08]
            bg-transparent whitespace-nowrap cursor-pointer
            hover:bg-scarlet dark:hover:bg-scarlet-bright hover:text-white
            hover:border-scarlet dark:hover:border-scarlet-bright
            transition-all duration-200 ease-spring">
  Integrations
</div>
```

### 19.6 Stat Row
```html
<div class="grid grid-cols-[80px_1fr] gap-5 items-start
            py-5 border-b border-ink/[.09] dark:border-frost/[.08]">
  <div class="font-fraunces font-semibold text-[clamp(28px,3vw,38px)] leading-none
              tracking-[-0.02em] text-scarlet dark:text-scarlet-bright">87%</div>
  <div>
    <p class="font-sans font-medium text-[13.5px] text-ink dark:text-frost leading-[1.38] mb-[3px]">
      Stat description text.
    </p>
    <span class="font-mono text-[8.5px] tracking-[.05em] text-ink/30 dark:text-frost/28">
      Source name
    </span>
  </div>
</div>
```

### 19.7 Section Divider
```html
<!-- Between sections of same bg -->
<div class="h-px mx-[52px]
            bg-[linear-gradient(to_right,transparent_0%,rgb(8_14_28/.09)_10%,rgb(8_14_28/.09)_90%,transparent_100%)]
            dark:bg-[linear-gradient(to_right,transparent_0%,rgb(230_234_248/.08)_10%,rgb(230_234_248/.08)_90%,transparent_100%)]
            transition-[background] duration-theme ease-spring">
</div>
```

---

## 20. Motion & Animation

### 20.1 Hero Stagger (inline delay utilities)

Tailwind's `[animation-delay:Xms]` arbitrary variant applies delays:

```html
<div class="animate-fade-up [animation-delay:50ms]">  <!-- rule -->
<div class="animate-fade-up [animation-delay:120ms]"> <!-- eyebrow -->
<h1  class="animate-fade-up-slow [animation-delay:200ms]"> <!-- headline -->
<p   class="animate-fade-up [animation-delay:300ms]"> <!-- sub -->
<div class="animate-fade-up [animation-delay:380ms]"> <!-- CTAs -->
<div class="animate-fade-up [animation-delay:480ms]"> <!-- stats -->
```

All start at `opacity-0` — the animation handles reveal.

### 20.2 Scroll Reveal

Add `.rev` class to any element. JS adds `.vis` when the element enters the viewport.

```html
<div class="rev">Revealed on scroll</div>
<div class="rev delay-1">Staggered +60ms</div>
<div class="rev delay-2">Staggered +130ms</div>
<div class="rev delay-3">Staggered +200ms</div>
```

```javascript
const io = new IntersectionObserver(entries =>
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
  }), { threshold: .07 }
)
document.querySelectorAll('.rev').forEach(el => io.observe(el))
```

### 20.3 Hover State Reference

| Component | Tailwind hover classes |
|-----------|----------------------|
| Primary button | `hover:bg-scarlet-dark hover:-translate-y-0.5` |
| Feature row index | `group-hover:text-scarlet` |
| Feature row arrow | `group-hover:opacity-100 group-hover:translate-x-0` |
| Benefit card number | `group-hover:text-scarlet` |
| Benefit top bar | `group-hover:scale-x-100` |
| Chip | `hover:bg-scarlet hover:text-white hover:border-scarlet` |
| Plan item | `hover:bg-arctic dark:hover:bg-void` |
| Problem card | `hover:bg-arctic-soft dark:hover:bg-void-soft` |

### 20.4 Theme Toggle

```javascript
document.getElementById('tog').addEventListener('click', () =>
  document.documentElement.classList.toggle('dark')
)
```

### 20.5 Nav Scroll State

```javascript
const nav = document.getElementById('nav')
window.addEventListener('scroll', () =>
  nav.dataset.scrolled = scrollY > 30 ? 'true' : 'false'
)
```

### 20.6 Reduced Motion

```html
<!-- Wrap animated elements or add to globals.css -->
<style>
@media (prefers-reduced-motion: reduce) {
  .animate-fade-up, .animate-fade-up-slow, .animate-orb-float, .animate-orb-float-alt {
    animation: none !important;
    opacity: 1 !important;
  }
  .rev { opacity: 1 !important; transform: none !important; transition: none !important; }
}
</style>
```

---

## 21. Ambient & Texture Effects

### 21.1 Grain Overlay
Defined in `globals.css` via `body::after` (see §1.2). No Tailwind class needed — always on.

### 21.2 Hero Orbs
Applied via the hero section's pseudo background (see §11). The radial gradients use Tailwind arbitrary `bg-[...]` values.

### 21.3 Ghost Background Type (Pricing & Contact)

```html
<!-- Pricing section ghost -->
<div class="absolute right-[-10px] bottom-[-24px] pointer-events-none select-none
            font-fraunces font-bold leading-none tracking-[-0.04em] whitespace-nowrap
            text-[clamp(80px,12vw,180px)] text-transparent
            [-webkit-text-stroke:1px_rgb(8_14_28/.09)]
            dark:[-webkit-text-stroke:1px_rgb(230_234_248/.08)]">
  PLANS
</div>

<!-- Contact section ghost (white, lower opacity) -->
<div class="absolute right-[-8px] bottom-[-40px] pointer-events-none select-none
            font-fraunces font-bold leading-none tracking-[-0.04em] whitespace-nowrap
            text-[clamp(90px,13vw,200px)] text-white/[.04]">
  NOVARIS
</div>
```

---

## 22. Dark Mode

### 22.1 Setup

Tailwind dark mode is controlled by the `dark` class on `<html>`:

```javascript
// Toggle
document.documentElement.classList.toggle('dark')

// Check state
document.documentElement.classList.contains('dark')
```

```js
// tailwind.config.js
darkMode: 'class'  // already set in §1
```

### 22.2 Dark Mode Class Pairs

Every color utility used has a `dark:` counterpart. Pattern:

```
bg-arctic           dark:bg-void
bg-arctic-soft      dark:bg-void-soft
text-ink            dark:text-frost
text-ink/50         dark:text-frost/50
text-ink/30         dark:text-frost/28
text-scarlet        dark:text-scarlet-bright
bg-scarlet          dark:bg-scarlet-bright
hover:bg-scarlet-dark  dark:hover:bg-scarlet-hover
border-ink/[.09]    dark:border-frost/[.08]
border-ink/[.16]    dark:border-frost/[.15]
bg-ink/[.05]        dark:bg-frost/[.05]
```

### 22.3 Why Two Accent Values

- `#cc1f2e` (light) — deep scarlet. Contrast 5.4:1 on `#f4f7fb` ✅
- `#f03347` (dark) — bright scarlet. Contrast 5.1:1 on `#090b10` ✅
- Original burgundy `#7c2d3e` on `#090b10` — only 3.2:1 ❌ — this is why it was replaced.

---

## 23. Responsive Patterns

### 23.1 Breakpoints (Tailwind defaults used)

```
sm:   640px
md:   768px
lg:   1024px  ← Primary layout collapse point
xl:   1280px
```

### 23.2 Key Responsive Classes

| Element | Default (mobile) | lg: |
|---------|-----------------|-----|
| 2-col grids | `grid-cols-1` | `lg:grid-cols-2` |
| 3-col grids | `grid-cols-1` | `lg:grid-cols-3` |
| Section padding x | `px-6` | `lg:px-[52px]` |
| Nav links | `hidden` | `md:flex` |
| Hero stat strip | `flex-col` | `sm:flex-row` |
| Stat strip dividers | `border-b` (no right) | `sm:border-r sm:border-b-0` |
| Benefits aside | `border-t pt-4` | `lg:border-l pl-6 border-t-0 pt-0` |
| Contact grid | `grid-cols-1` | `lg:grid-cols-[1fr_auto]` |
| Ghost text | `hidden` (optional) | `lg:block` |

### 23.3 Fluid Type (clamp)

```html
<!-- Hero: 52px mobile → 114px desktop -->
text-[clamp(52px,8vw,114px)]

<!-- H2: 30px → 50px -->
text-[clamp(30px,3.6vw,50px)]

<!-- Stat: 28px → 38px -->
text-[clamp(28px,3vw,38px)]

<!-- Quote: 18px → 27px -->
text-[clamp(18px,2.2vw,27px)]
```

---

## 24. Accessibility

### 24.1 Focus Styles
Add to `globals.css`:
```css
@layer base {
  :focus-visible {
    outline: 2px solid theme('colors.scarlet.DEFAULT');
    outline-offset: 3px;
    border-radius: theme('borderRadius.card');
  }
  .dark :focus-visible {
    outline-color: theme('colors.scarlet.bright');
  }
}
```

### 24.2 Contrast Ratios

| Pair | Ratio | WCAG |
|------|-------|------|
| `text-scarlet` on `bg-arctic` | 5.4:1 | ✅ AA |
| `text-scarlet-bright` on `bg-void` | 5.1:1 | ✅ AA |
| `text-ink` on `bg-arctic` | 17.9:1 | ✅ AAA |
| `text-frost` on `bg-void` | 14.2:1 | ✅ AAA |
| `text-ink/50` on `bg-arctic` | 6.8:1 | ✅ AA |

### 24.3 Touch Targets
All buttons have `py-3` minimum (12px) + `px-7` (28px). Meets 44×44px minimum.

### 24.4 Screen Reader Notes
```html
<!-- Eyebrow decorative line — hide from SR -->
<span class="w-4 h-px ... shrink-0" aria-hidden="true"></span>

<!-- Ghost background text — decorative -->
<div class="... text-transparent ..." aria-hidden="true">PLANS</div>

<!-- Cursor elements -->
<div id="cur" aria-hidden="true"></div>
<div id="cur-r" aria-hidden="true"></div>
```

---

## 25. Cursor System

```html
<div id="cur" aria-hidden="true"
     class="fixed w-[7px] h-[7px] rounded-full pointer-events-none z-[9000]
            bg-scarlet dark:bg-scarlet-bright
            -translate-x-1/2 -translate-y-1/2
            transition-transform duration-[80ms]">
</div>
<div id="cur-r" aria-hidden="true"
     class="fixed w-[26px] h-[26px] rounded-full pointer-events-none z-[9000]
            border border-scarlet dark:border-scarlet-bright opacity-30
            -translate-x-1/2 -translate-y-1/2">
</div>
```

```javascript
const cur = document.getElementById('cur'), curR = document.getElementById('curR')
let mx=0, my=0, rx=0, ry=0
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY })
;(function tick() {
  rx += (mx-rx)*.12; ry += (my-ry)*.12
  cur.style.left=mx+'px';  cur.style.top=my+'px'
  curR.style.left=rx+'px'; curR.style.top=ry+'px'
  requestAnimationFrame(tick)
})()

document.querySelectorAll('a,button,.feat-row,.ben-card,.plan-item,.chip').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(2)'
    curR.style.width = curR.style.height = '42px'
  })
  el.addEventListener('mouseleave', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(1)'
    curR.style.width = curR.style.height = '26px'
  })
})
```

```css
/* Add to globals.css */
@media (hover: none) {
  #cur, #cur-r { display: none; }
  body { cursor: auto; }
}
```

---

## 26. Copy & Voice Guidelines

### 26.1 Headlines
- Max 6 words per line
- Pair a light/italic line with a bold line
- ✅ "Know the risk. Win anyway."
- ❌ "Comprehensive risk management solutions for modern businesses!"

### 26.2 Body
- Address the owner: "you", "your"
- Real sourced statistics
- Short sentences
- Never claim metrics that aren't true — use industry reports instead

### 26.3 CTA Labels
- "Start Free Trial" not "Get Started"
- "Book a Demo" not "Contact Us"
- "Explore the Platform" not "Learn More"
- "See Full Pricing" not "Pricing"

### 26.4 Sourced Statistics

| Stat | Source |
|------|--------|
| 50% fail by year 5 | US Bureau of Labor Statistics |
| 73% cite economic uncertainty | Gitnux 2024 |
| 11% use risk strategically | PwC Pulse 2024 |
| 87% processes not acted on | Gitnux |
| 33% no Chief Risk Officer | Gitnux |
| 40% cite cyber attacks | PwC Pulse 2024 |
| $2.66M savings with IR plans | IBM Cost of Breach 2023 |

---

## 27. Design Don'ts

### Typography
- ❌ Never `font-[Inter]`, `font-[Roboto]`, or system fonts in display
- ❌ Never `font-fraunces` on body text elements
- ❌ Never `italic` with DM Sans
- ❌ Never more than 2 typefaces in one component
- ❌ Never more than 2 weight changes in one headline

### Color
- ❌ Never `bg-[#7c2d3e]` (old burgundy — fails dark mode)
- ❌ Never `bg-white` as page background — use `bg-arctic`
- ❌ Never `bg-steel` as a primary CTA fill
- ❌ Never add a third accent color to the palette
- ❌ Never red for error/warning — use amber

### Layout & Elevation
- ❌ Never `shadow-*` on cards
- ❌ Never `drop-shadow-*` for depth
- ❌ Never a full-width solid `<hr>` between sections
- ❌ Never center-align body paragraphs (hero sub is the exception)

### Components
- ❌ Never show actual pricing numbers in the pricing tease section
- ❌ Never fake testimonial quotes — source industry reports
- ❌ Never emoji in UI text
- ❌ Never `rounded-2xl` or larger on cards
- ❌ Never `rounded-full` on anything except the logo dot, toggle, and cursor

---

## 28. Quick Reference

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOVARIS DESIGN SYSTEM v1.0 — SCARLET & ICE
Tailwind Edition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FONTS
  font-fraunces     Fraunces (display)
  font-sans         DM Sans (body/UI)
  font-mono         IBM Plex Mono (labels)

BACKGROUNDS
  Light primary:    bg-arctic       (#f4f7fb)
  Light alt:        bg-arctic-soft  (#edf0f6)
  Dark primary:     dark:bg-void    (#090b10)
  Dark alt:         dark:bg-void-soft (#0e1018)
  Contact:          bg-scarlet      (#cc1f2e)

TEXT
  Primary:    text-ink dark:text-frost
  Secondary:  text-ink/50 dark:text-frost/50
  Tertiary:   text-ink/30 dark:text-frost/28
  Accent:     text-scarlet dark:text-scarlet-bright

BUTTONS
  Primary:    bg-scarlet text-white rounded-card
              hover:bg-scarlet-dark hover:-translate-y-0.5
  Ghost:      text-ink/30 hover:text-ink

RADIUS
  rounded-card    6px (cards, buttons, chips)
  rounded-badge   4px (badges, tags)
  rounded-none    0   (rows, dividers)

GRID
  2-col:    grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-18
  Flat 3:   grid-cols-1 lg:grid-cols-3 gap-px
            bg-ink/[.09] border border-ink/[.09]
            rounded-card overflow-hidden

SECTION SHELL
  px-[52px] py-[100px] max-sm:px-6
  max-w-content mx-auto (inner)

EASING
  ease-spring         cubic-bezier(.22,1,.36,1)
  ease-spring-bounce  cubic-bezier(.34,1.56,.64,1)

ANIMATIONS
  animate-fade-up       hero elements
  animate-fade-up-slow  hero headline
  animate-orb-float     ambient orbs
  .rev + .vis           scroll reveal
  .delay-1/2/3/4        stagger delays
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```