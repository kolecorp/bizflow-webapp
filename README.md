# Bizflow

<img width="1536" height="1024" alt="cafe-logo" src="https://github.com/user-attachments/assets/59153a49-2355-4d21-8f1e-c5c88c3f9e65" />

Bizflow is a modern business operations platform for small, medium and large service-based businesses. It brings day-to-day work into one place, including sales, transactions, inventory, services, team management, reporting, printing, customer engagement, and business automation.

The platform is designed for businesses such as printing and photocopying shops, typing and graphics studios, computer service providers, and other growing teams that need a clear view of their operations.

## Architecture

Bizflow uses a clean ports-and-adapters design so the product can support different deployment targets and data providers without coupling the UI to infrastructure:

- `src/lib/api/contracts` defines abstract repository interfaces.
- `src/lib/api/providers` contains adapters for Apps Script, REST, Firebase, and mock data.
- `src/lib/api/factory.ts` selects the provider at runtime through `VITE_API_PROVIDER`.
- `src/lib/api/index.ts` exports a single `api` instance for the UI.

## API Provider Defaults

- `mock` — default for local development (`.env.development`)
- `apps-script` — default for production (`.env.production`)
- `rest` — available for future HTTP backend deployments
- `firebase` — reserved for a future Firebase migration

## Setup

Install dependencies:

```bash
pnpm install
```

Start development:

```bash
pnpm dev
```

Build production:

```bash
pnpm build
```

Build and copy to Apps Script:

```bash
pnpm run build:apps-script
```

## Development

Import the shared API entrypoint from Svelte components or stores:

```ts
import { api } from "$lib/api";

const products = await api.getProducts();
```

The UI layer remains infrastructure-agnostic, with no direct calls to `google.script.run`, `fetch`, or Firebase APIs.

## Notes

- Bizflow is designed as a modular service-management product that can be configured for different customers.
- The current setup supports Apps Script and mock providers, with REST and Firebase available as future migration paths.
