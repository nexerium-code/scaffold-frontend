# Tooling & environment

The toolchain is fixed. New projects spun up to match this house style should reproduce these settings exactly unless there is an explicit reason to deviate.

## 1 — Build & dev

- **Vite 8** with `@vitejs/plugin-react`, `@tailwindcss/vite`, and `@tanstack/router-plugin/vite` (configured with `target: "react"`, `autoCodeSplitting: true`).
- `vite.config.ts` declares the alias `@ → ./src` via `path.resolve`. The same alias is mirrored in `tsconfig.app.json` `paths`.
- Scripts in `package.json`:
    - `dev` → `vite`
    - `build` → `tsc -b && vite build`
    - `lint` → `eslint .`
    - `preview` → `vite preview`

## 2 — TypeScript (`tsconfig.app.json`)

```jsonc
{
    "compilerOptions": {
        "target": "ES2023",
        "lib": ["ES2023", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "moduleDetection": "force",
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "erasableSyntaxOnly": true,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedSideEffectImports": true,
        "baseUrl": ".",
        "paths": { "@/*": ["./src/*"] }
    },
    "include": ["src"]
}
```

Notes:

- `verbatimModuleSyntax` is intentionally **disabled** because shadcn primitives currently break under it.
- Do not relax `strict` or any `noUnused*` flag.

## 3 — ESLint (`eslint.config.js`)

- Flat config using `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- Globally ignores `dist` and `src/components/ui/**`.
- Custom rules:
    - `@typescript-eslint/no-unused-vars` with `varsIgnorePattern`, `argsIgnorePattern`, `caughtErrorsIgnorePattern` all set to `^_`.
    - `react-refresh/only-export-components` is **off**.
- Don't introduce new ESLint plugins without discussion.

## 4 — Prettier (`.prettierrc`)

```json
{
    "printWidth": 360,
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "singleQuote": false,
    "trailingComma": "none",
    "bracketSpacing": true,
    "arrowParens": "always",
    "plugins": ["prettier-plugin-tailwindcss"],
    "tailwindFunctions": ["tw"]
}
```

- The very wide `printWidth: 360` is intentional. Don't artificially line-wrap to look "narrow".
- Don't hand-sort Tailwind classes; the plugin does it.

## 5 — Environment variables

- All env vars are **client-exposed** (Vite `VITE_*` prefix). Defined in `.env`.
- Conventional names used in this stack (rename per project as needed):
    - `VITE_ENV` — `"PROD"` toggles production endpoints in service files.
    - `VITE_BE_ENDPOINT` — base API URL (a port suffix is conventionally appended in non-prod).
    - `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key.
- Read via `import.meta.env.VITE_*`. Don't introduce a runtime config layer unless explicitly required.

## 6 — Aliases (across all configs)

| Place                      | Mapping                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `tsconfig.app.json`        | `@/* → ./src/*`                                                                                              |
| `vite.config.ts`           | `@` → `path.resolve(__dirname, "./src")`                                                                     |
| `components.json` (shadcn) | `components → @/components`, `ui → @/components/ui`, `utils → @/lib/utils`, `lib → @/lib`, `hooks → @/hooks` |

If you change one, change all three.

## 7 — Package manager

- **npm** is the package manager — always. Lockfile is `package-lock.json`.
- Use `npm install` / `npm install <pkg>` / `npm run <script>`. Never `pnpm`, `yarn`, or `bun`.
- For shadcn primitives, use `npx shadcn@latest add <name>`.

## 8 — Don't do

- Don't add a `postcss.config.js` — Tailwind v4 doesn't need it (it runs through `@tailwindcss/vite`).
- Don't add a `tailwind.config.js` — v4 reads everything from `@theme` directives in `src/index.css`.
- Don't introduce Prettier overrides per-file or per-folder. The repo has one config; keep it that way.
- Don't add a runtime feature-flag system, an analytics SDK, or telemetry without discussion.
