# Scaffold Frontend

Reusable Vite + React frontend scaffold for product-style applications.

## Overview

This repository is a starter template, not a finished product. It preserves the shared frontend architecture and includes small generic `scopes` and `resources` example modules to demonstrate the intended structure for future features.

## Stack

- Vite 7, React 19, TypeScript strict
- TanStack Router, Query, and Table
- Clerk authentication
- Tailwind CSS 4 and shadcn/ui primitives
- React Hook Form and Zod
- i18next with English and Arabic
- Axios through `src/services/API.ts`
- sonner mutation toasts

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.example` to your local environment file and provide:

```bash
VITE_BE_ENDPOINT=
VITE_CLERK_PUBLISHABLE_KEY=
VITE_ENV=DEV
```

## Verification

```bash
npm run lint
npm run build
```

## Structure

```txt
src/
    components/
        _app/
        empty-states/
        general/
        resources/
        scopes/
        skeleton/
        ui/
    contexts/
    hooks/
        resources/
        scopes/
    lib/
    locales/
    routes/
    services/
        API.ts
        resources/
        scopes/
```

Use the example modules as references for API services, schemas, TanStack Query hooks, forms, tables, mutations, route params, translations, and selected-scope context. Replace them with real project features when starting a new application.
