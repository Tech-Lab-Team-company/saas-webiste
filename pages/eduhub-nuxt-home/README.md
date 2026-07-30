# EduHub / Gamma Physics home page for Nuxt

This folder contains the uploaded home page reorganized as Nuxt section components.

## Structure

```text
assets/css/main.css
components/
  ThemeToggle.vue
  home/
    HomeHeader.vue
    HomeHero.vue
    HomeCourses.vue
    HomeNotes.vue
    HomeBlog.vue
    HomeExperience.vue
    HomeStory.vue
    HomeAppStatus.vue
    HomeFaq.vue
    HomeCta.vue
    HomeFooter.vue
composables/useColorTheme.ts
pages/index.vue
plugins/home-motion.client.ts
nuxt.config.ts
```

## SSR decisions

- All visible page content is rendered during SSR.
- Internal navigation uses `NuxtLink`.
- Images use `NuxtImg`.
- Theme state uses a Nuxt cookie/state + `useHead`, so no direct DOM access is needed in the component.
- `window`, `document`, `IntersectionObserver`, and `matchMedia` exist only in `home-motion.client.ts`.
- Motion is progressive enhancement: SSR HTML remains visible even when JavaScript is disabled.
- FAQ uses native `<details>` and `<summary>` instead of client-only state.
- Section-specific CSS is scoped inside each section component. Only tokens, reset, layout primitives, buttons, and motion primitives stay global.

## Public image paths expected

Put the existing assets in `public/` using these names:

```text
public/eslam-salama-logo.webp
public/eslam-salama-teacher-cutout-v2.png
public/eslam-salama-app-screen.webp
```

## Add to an existing Nuxt project

1. Install Nuxt Image if it is not already installed:

```bash
npm i @nuxt/image
```

2. Copy `components/home`, `components/ThemeToggle.vue`, `composables/useColorTheme.ts`, and `plugins/home-motion.client.ts` into the matching folders.
3. Merge the CSS tokens/primitives from `assets/css/main.css` into your global CSS.
4. Add `@nuxt/image` and the CSS entry to your existing `nuxt.config.ts` rather than replacing your whole config.
5. Use `pages/index.vue` as the home page, or copy its component composition into your existing index page.

The original page contained one very large template plus a site-wide style block; the home template itself had no `<script>` block. This version keeps the same home sections while isolating section data and styles into maintainable Nuxt components.
