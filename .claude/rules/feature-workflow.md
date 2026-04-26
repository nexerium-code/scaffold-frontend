# Feature workflow

The canonical Create / Read / Update / Delete flow for any feature. **Stick to this exactly** — every feature follows the same shape so unrelated areas of the app stay legible to the same engineer.

**TanStack Query** is the only layer for server state. UI components never call Axios directly; they consume hooks under `src/hooks/<feature>/`, which wrap the functions in `src/services/<feature>/<Feature>.api.ts`.

---

## 0 — Layout of a feature

For a feature called `widgets`, expect:

```
src/services/widgets/
    Widgets.api.ts        # axios calls + Widget type + ENDPOINT const
    Widgets.schemas.ts    # WidgetSchema, WidgetSchemaType, WidgetSchemaInitData
    Widgets.helpers.ts    # (optional) pure transformers / exporters

src/hooks/widgets/
    useGetAllWidgets.ts   # list query
    useWidgetById.ts      # detail query
    useCreateWidget.ts    # create mutation (uses useIdempotentMutation)
    useUpdateWidget.ts    # update mutation (plain useMutation)
    useDeleteWidget.ts    # delete mutation (plain useMutation)

src/components/widgets/
    CreateWidgetDialog.tsx
    UpdateWidgetDialog.tsx
    WidgetsTable.tsx
    WidgetsTableMain.tsx
    WidgetsTableColumnDefs.tsx
    WidgetsTableSearch.tsx
    WidgetsTableFilter.tsx
    WidgetsTableVisibility.tsx
    WidgetsTableExport.tsx
    WidgetsTablePagination.tsx
    WidgetsTableActionCell.tsx
    WidgetsTableDelete.tsx
    WidgetsTableResetSelection.tsx
```

If a feature does not need every file (e.g. no export, no filter), simply omit it. Don't create empty files.

---

## 1 — `<Feature>.api.ts`

- Single `ENDPOINT` constant at the top, computed from environment variables (production vs. dev base URL):
    ```ts
    const ENDPOINT = import.meta.env.VITE_ENV === "PROD"
        ? `${import.meta.env.VITE_BE_ENDPOINT}/widget`
        : `${import.meta.env.VITE_BE_ENDPOINT}:3000/widget`;
    ```
- Export the entity TS `type` (`Widget`) — this is the API's response shape, **not** derived from Zod.
- Export each call as a `camelCase async function`. Return the parsed response (`API.GET<Widget[]>(...)`).
- Idempotent creates take an `idempotencyKey: string` parameter and forward it as the `"Idempotency-Key"` header. The hook layer (`useIdempotentMutation`) injects the key.
- File-uploading endpoints follow the two-step presigned-URL pattern: `API.POST` to get `{ uploadUrl, imgUrl }`, then `API.PUT` the file to the upload URL, then return the resulting `imgUrl` to the caller. Keep the upload helper as a non-exported function at the bottom of `<Feature>.api.ts`.

---

## 2 — `<Feature>.schemas.ts`

- Always export three things together:
    1. The Zod schema → `WidgetSchema` (PascalCase + `Schema`).
    2. The inferred TS type → `export type WidgetSchemaType = z.infer<typeof WidgetSchema>;`.
    3. The default form values → `export const WidgetSchemaInitData: WidgetSchemaType = { ... };`.
- All Zod errors are **i18n keys** in kebab-case strings — never literal English. Example: `z.string({ error: "name-is-required" }).trim().min(1, { error: "name-can-not-be-empty" })`.
- Use `z.email`, `z.iso.date`, `z.iso.time`, `z.discriminatedUnion`, `z.array(...).superRefine(...)` as needed.
- For dynamic Zod schemas built from form-field metadata, use `@/lib/ZodSchemaCreator` and `@/lib/ZodSchemaDefaultValues` if those helpers exist in the project — do not roll your own.

---

## 3 — Read flow (query hook)

```ts
// src/hooks/widgets/useGetAllWidgets.ts
import { getAllWidgets as getAllWidgetsAPI } from "@/services/widgets/Widgets.api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetAllWidgets(parentId: string) {
    const { data: widgets, isPending: loading, isError } = useQuery({
        queryKey: ["widgets", parentId],
        queryFn: () => getAllWidgetsAPI(parentId),
        placeholderData: keepPreviousData,
        retry: false
    });

    return { widgets, loading, isError };
}
```

Rules:

- **Alias the imported API call** with an `API` suffix (`getAllWidgets as getAllWidgetsAPI`) to avoid colliding with the hook's internal binding name.
- **Rename `data`** to the resource (`widgets`, `widget`, `users`) and **rename `isPending`** to `loading`. Always also expose `isError`.
- `queryKey` is an array starting with the kebab-case resource name, followed by any scoping ids.
- Default options on the read side: `placeholderData: keepPreviousData` for lists, `retry: false` everywhere. Global `QueryClient` defaults (typically `staleTime: 3min`, `refetchInterval: 5min`) live in `main.tsx`.
- For lists that should display newest-first regardless of API order, use `select: (data) => data?.reverse()`.

---

## 4 — Create flow (idempotent mutation)

```ts
// src/hooks/widgets/useCreateWidget.ts
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useIdempotentMutation } from "@/hooks/useIdempotentMutation";
import { createWidget as createWidgetAPI } from "@/services/widgets/Widgets.api";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateWidget(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const { mutate: createWidget, isPending: loading, isSuccess: success, isError, reset } = useIdempotentMutation({
        mutationFn: (payload: object, idempotencyKey) => createWidgetAPI(payload, idempotencyKey),
        onSuccess: (response) => {
            toast.success(t(response || "widget-created-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["widgets"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { createWidget, loading, success, isError, reset };
}
```

Rules:

- Creates use **`useIdempotentMutation`** (from `@/hooks/useIdempotentMutation`), which auto-generates a `crypto.randomUUID()` idempotency key and reuses it across retries.
- Updates and deletes use plain `useMutation` from `@tanstack/react-query`.
- The hook accepts an optional `successCallBack?: () => void` (camelCase, exactly that spelling — kept for consistency).
- Hook return shape: `{ <verb><Resource>, loading, success?, isError, reset }`. Aliases:
    - `mutate` → action name (`createWidget`, `updateWidget`, `deleteWidget`).
    - `isPending` → `loading`.
    - `isSuccess` → `success` (only when needed; otherwise omit).

---

## 5 — Update flow

```ts
// src/hooks/widgets/useUpdateWidget.ts
const { mutate: updateWidget, isPending: loading, isSuccess: success, isError, reset } = useMutation({
    mutationFn: ({ widgetId, payload }: { widgetId: string; payload: object }) => updateWidgetAPI(widgetId, payload),
    onSuccess: (response) => {
        toast.success(t(response || "widget-updated-successfully"), { duration: 5000 });
        queryClient.invalidateQueries({ queryKey: ["widgets"] });
        queryClient.invalidateQueries({ queryKey: ["widget"] });
        successCallBack?.();
    },
    onError: (error) => toast.error(t(error.message || "something-went-wrong-please-try-again-later")),
    onSettled: () => reset()
});
```

- Pass mutation arguments as a **single object** (`{ widgetId, payload }`), never positional.
- Invalidate **every related query key**: list, detail, and any aggregated stats key.

---

## 6 — Delete flow

```ts
const { mutate: deleteWidgets, isPending: loading, isError, isSuccess, reset } = useMutation({
    mutationFn: ({ parentId, widgetIds }: { parentId: string; widgetIds: string[] }) =>
        deleteWidgetsAPI(parentId, widgetIds)
    /* onSuccess / onError / onSettled per the standard pattern */
});
```

- Bulk-delete endpoints accept `{ targets: ids }` in the request body and the hook signature uses `<resource>Ids: string[]`.
- Single-entity deletes pass the id directly (`deleteWidget(parentId, widgetId)`).

---

## 7 — Submission from a component

```tsx
function CreateWidgetDialog({ onClose }: CreateWidgetDialogProps) {
    const { createWidget, loading } = useCreateWidget(() => onClose());
    const form = useForm<WidgetSchemaType>({ resolver: zodResolver(WidgetSchema), defaultValues: WidgetSchemaInitData });

    function onSubmit(values: WidgetSchemaType) {
        createWidget(values);
    }

    function resetState() {
        form.reset(WidgetSchemaInitData);
    }

    return (
        <Dialog defaultOpen onOpenChange={onClose}>
            <DialogContent onCloseAutoFocus={resetState}>
                <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
            </DialogContent>
        </Dialog>
    );
}
```

- Dialogs reset form state on `onCloseAutoFocus`, not on `onOpenChange`.
- Update dialogs hydrate the form with `useEffect(() => { if (data) form.reset(data, { keepDefaultValues: false }); }, [data, form])`.
- The submit button is **disabled when** `loading || !form.formState.isValid` (creates) and additionally `|| !form.formState.isDirty` (updates).
- See `forms.md` for the full Field/FieldGroup/FieldError pattern.

---

## 8 — Mutation lifecycle (toast feedback)

Every mutation hook MUST supply `onSuccess`, `onError`, and `onSettled`:

```ts
onSuccess: (response) => {
    toast.success(t(response || "<feature-success-i18n-key>"), { duration: 5000 });   // duration optional
    queryClient.invalidateQueries({ queryKey: ["..."] });                              // every related key
    successCallBack?.();                                                               // close dialog / redirect
},
onError: (error) => {
    toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
},
onSettled: () => {
    reset();                                                                           // mutation.reset, not form
}
```

Notes:

- Server messages already come through `error.message` (normalized in `API.ts`) and are themselves i18n keys — that's why `t(error.message)` works.
- `something-went-wrong-please-try-again-later` is the canonical fallback. Don't invent a new fallback key.
- Add new success-key strings to **both** `en.json` and `ar.json` in the same change.

---

## 9 — Route-level data fetching pattern

Pages consume hooks and short-circuit in this order:

```tsx
const { widget, loading: loadingWidget } = useWidgetById(scopeId, widgetId);
const { stats, loading: loadingStats } = useGetWidgetStats(scopeId);

if (!scopeId) return <NoScopeSelected />;
if (loadingWidget || loadingStats) return <WidgetsSkeleton />;
if (isError) return <GenericError />;
```

- Empty / no-selection states first.
- Loading second — render a feature-specific skeleton from `components/skeleton/`.
- Error third — render an empty-state from `components/empty-states/`.
- Then the real content.

When forking a hook's `loading` for two simultaneous requests, alias each (`loading: loadingWidget`, `loading: loadingStats`).
