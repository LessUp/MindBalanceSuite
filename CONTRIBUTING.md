# Contributing Guidelines

Thanks for your interest in contributing!

## How to contribute
- Fork the repo and create a feature branch from `main`.
- Keep changes focused and include clear commit messages.
- If adding a new scale, follow the `scales` registry structure in `phq9-app/app.js`:
  - id, title, timeframe
  - questions[]
  - options[] or questionOptions[][]
  - max, severity(total), extras(total, values)
  - (optional) computeTotal(values) for custom/reverse scoring
- Add tests or manual testing notes where relevant.
- Open a Pull Request with a concise description of the change.

## Code style
- Keep vanilla JS/CSS/HTML simple; avoid frameworks unless agreed.
- No data persistence beyond localStorage; do not send data to servers.
- Keep UI accessible and mobile-friendly.

## Reporting issues
- Use GitHub Issues with a clear repro, expected vs actual behavior, and environment.

## License
- By contributing, you agree that your contributions will be licensed under the MIT License.
