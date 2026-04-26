# Translation process rules

These rules define how translations **must** be managed.

## 1 — Supported languages

- **English (`en-US`)** and **Arabic (`ar-SA`)** only. No other locales.
- The detection order is `localStorage` only (configured in `src/locales/i18n.ts`). Document `lang` and `dir` attributes are toggled side-effect-style on language change — that infrastructure is in place; never reimplement it.
- Arabic forces `dir="rtl"`; English forces `dir="ltr"`. RTL handling cascades through the shadcn `<DirectionProvider>` mounted at `__root.tsx` — see `styling.md`.

## 2 — File locations

| Language  | File                  |
| --------- | --------------------- |
| English   | `src/locales/en.json` |
| Arabic    | `src/locales/ar.json` |
| i18n init | `src/locales/i18n.ts` |

## 3 — Structure: flat object only

- All translation keys live in a **single flat object**.
- **No nesting** — no `{ "auth": { "signIn": "..." } }`.
- Use a single level of key-value pairs.

```json
// ✅ GOOD
{
  "sign-in": "Sign In",
  "forgot-password": "Forgot Password",
  "email-is-required": "Email is required."
}

// ❌ BAD
{
  "auth": {
    "signIn": "Sign In",
    "forgotPassword": "Forgot Password"
  }
}
```

## 4 — Key naming: kebab-case

- All keys **must** use `kebab-case`.
- Words are lowercase and separated by hyphens.

```json
// ✅ GOOD
"confirm-password"
"email-is-required"
"select-date-range"

// ❌ BAD
"confirmPassword"
"email_is_required"
"SelectDateRange"
```

## 5 — Naming: clear and context-relevant

- Keys should be **descriptive** and reflect where they are used.
- Prefer specificity over brevity when it clarifies context.
- Use suffixes for variants when needed (e.g. `-q` for question, `-dots` for placeholder).

| Context         | Example Key          | Example Value         |
| --------------- | -------------------- | --------------------- |
| Button label    | `sign-in`            | "Sign In"             |
| Form validation | `email-is-required`  | "Email is required."  |
| Placeholder     | `search-widget-dots` | "Search widget..."    |
| Question        | `forgot-password-q`  | "Forgot Password?"    |

### 5.1 — Breadcrumb & route segment keys

- **Use segment names directly as keys** — No `breadcrumb-` or other prefix.
- The breadcrumb hook returns segment names. These names **are** the translation keys.
- Use `t(el.name)` and `t(active.name)` directly in the component.

```tsx
// ✅ GOOD
<Link to={el.path}>{t(el.name)}</Link>
<BreadcrumbPage>{t(active.name)}</BreadcrumbPage>

// ❌ BAD
<Link to={el.path}>{t(`breadcrumb-${el.name}`)}</Link>
```

### 5.2 — Singular vs plural

- Use **singular** when the context is about one item (selecting, searching, displaying one).
- Use **plural** when the context is about many items (list heading, "no items found" for an empty list).

| Context                          | Key                  | Example Value      |
| -------------------------------- | -------------------- | ------------------ |
| Placeholder: select one widget   | `select-widget-dots` | "Select widget..." |
| Placeholder: search one widget   | `search-widget-dots` | "Search widget..." |
| Empty state: no widget selected  | `no-widget-found`    | "No widget found"  |
| Empty state: no widgets in list  | `no-widgets-found`   | "No widgets found" |
| List/group heading               | `widgets`            | "Widgets"          |

### 5.3 — Reuse keys across contexts

- When the same word appears in multiple places (nav label, breadcrumb, tooltip) with the **same value**, use a **single key**.
- Do not create context-specific keys (e.g. `breadcrumb-dashboard` vs `dashboard`) when the translation value is identical.

```json
// ✅ GOOD — one key for "Dashboard" everywhere
"dashboard": "Dashboard"

// ❌ BAD — redundant keys for same value
"dashboard": "Dashboard",
"breadcrumb-dashboard": "Dashboard"
```

### 5.4 — Do not internationalise `alt` text

- **Do not** use `t()` or locale keys for HTML **`alt`** attributes on images (or other elements that use `alt`).
- Keep `alt` as a **static string** in the component (concise English is fine), or use **`alt=""`** when the image is purely decorative and accessibility guidance allows it.
- **Do not** add translation keys whose sole purpose is `alt` copy.

```tsx
// ✅ GOOD
<img src={url} alt="Avatar" />

// ❌ BAD
<img src={url} alt={t("avatar-alt")} />
```

### 5.5 — Zod errors are translation keys

- Every Zod `error` value is a **kebab-case translation key**, never literal English:
    ```ts
    z.string({ error: "name-is-required" }).trim().min(1, { error: "name-can-not-be-empty" });
    z.email({ error: "email-is-required" });
    ```
- The matching key must exist in **both** `en.json` and `ar.json`. The mutation `onError` already wraps the message in `t(...)`, so the i18n key surfaces correctly in toasts.
- Reuse generic keys across schemas (`name-is-required`, `name-can-not-be-empty`, `email-is-required`, `phone-is-required`, `this-field-is-required`, `this-field-can-not-be-empty`, `invalid-field-entry`, `something-went-wrong-please-try-again-later`) instead of inventing per-field copies.

### 5.6 — Server response strings are also translation keys

- The backend conventionally returns plain-text codes that are themselves kebab-case i18n keys. The mutation hook calls `t(response || "<fallback-key>")`, so any new server-side string must also be added to **both** `en.json` and `ar.json`.

## 6 — Adding or modifying keys

- Add or modify keys in **both** `en.json` and `ar.json` in the same change.
- Keep keys **alphabetically sorted** for easier maintenance.
- Never leave a key in one file without its counterpart in the other.
- No duplicate keys allowed. Always make sure of that.

## 7 — Do not modify

- **Never modify** `src/components/ui/` — shadcn/ui components are managed by the CLI; do not edit them manually.
