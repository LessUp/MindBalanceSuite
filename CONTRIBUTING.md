# Contributing Guidelines

Thanks for your interest in contributing!

## How to contribute
- Fork this repo and create a feature branch from `main`.
- The main actively maintained frontend is in the repo root (`src/`) (React + TypeScript + Vite).
- Use `pnpm` by default:
  - `pnpm install`
  - `pnpm dev`

### Adding or updating a scale
- Edit `src/data/scales.ts`.
- Follow the `Scale` interface defined at the top of that file:
  - `id`, `title`, `timeframe`
  - `questions[]`
  - `options[]` or `questionOptions[][]`
  - `max`, `severity(total, values)`
  - optional: `computeTotal(values)` and `extras(total, values)` for custom / reverse scoring or extra notes.
- Keep naming and labels in **简体中文** and, where possible, consistent with the original scale literature.

### Before opening a Pull Request
- Make sure the app builds and basic checks pass (from repo root):
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm build`
- Keep changes focused and include clear, descriptive commit messages.
- Open a Pull Request with a concise description of the change and how you tested it.

## Code style
- Use React + TypeScript for new UI code in `src/`.
- Prefer small, focused components with a single responsibility.
- Prefer functional components and hooks over class components.
- Do not send assessment data to remote servers; only browser-local storage (e.g. `localStorage`) is allowed.
- Keep the UI accessible and mobile-friendly.

## Reporting issues
- Use GitHub Issues with a clear repro, expected vs actual behavior, and environment.

## License
- By contributing, you agree that your contributions will be licensed under the MIT License.

