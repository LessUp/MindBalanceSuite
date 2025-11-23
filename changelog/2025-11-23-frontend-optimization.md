# Changelog

## [Unreleased] - 2025-11-23

### Added
- Added `framer-motion` for animations.
- Added `clsx` and `tailwind-merge` for better class management.
- Added `tailwindcss-animate` plugin.
- Added `src/lib/utils.ts` utility.
- Added `ScaleCard` component with hover effects.
- Added step-by-step wizard mode to `Assessment` page.
- Added mobile-responsive navigation menu.
- Added printing support for assessment results.

### Changed
- Refactored `Home.tsx` with modern UI design, hero section, and feature grid.
- Refactored `Assessment.tsx` to use a wizard interface instead of a single long form.
- Updated `Layout.tsx` to use Tailwind CSS directly and added mobile responsiveness.
- Updated `tailwind.config.js` to support CSS variables for theming.
- Updated `index.css` with improved global styles and CSS variables for light/dark modes.
- Removed custom CSS from `App.css` in favor of Tailwind utility classes.
