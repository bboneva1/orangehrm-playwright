# QA Automation Project

A Playwright + TypeScript test automation framework, built against a self-hosted
[OrangeHRM](https://www.orangehrm.com/) instance running locally in Docker.

This is a learning/portfolio project focused on writing a maintainable, real-world
test framework from scratch — page objects, fixtures, CI-friendly config, secret
scanning, and test design decisions explained rather than just implemented.

## Stack

- [Playwright](https://playwright.dev/) + TypeScript
- Docker Compose (OrangeHRM + MariaDB)
- ESLint, Prettier
- Husky + gitleaks (pre-commit secret scanning)

## Getting started

```bash
npm run app:up      # start OrangeHRM (http://localhost:8080)
npm install
npx playwright install chromium
npm test
```

See `CLAUDE.md` for full conventions and available commands.

## Status

🚧 Work in progress — currently building out Phase A (framework scaffold).
