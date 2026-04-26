# Forms (React Hook Form + Zod + shadcn `Field` primitives)

Every form follows the same skeleton. Mirror it literally.

## 1 — The schema-first contract

For each form, the corresponding schema file (`src/services/<feature>/<Feature>.schemas.ts`) **must** export three things:

```ts
export const WidgetSchema = z.object({ /* ... */ });
export type WidgetSchemaType = z.infer<typeof WidgetSchema>;
export const WidgetSchemaInitData: WidgetSchemaType = { /* ... */ };
```

Form components import all three. Don't re-derive defaults inline; use `WidgetSchemaInitData`.

## 2 — `useForm` setup

```tsx
const form = useForm<WidgetSchemaType>({
    resolver: zodResolver(WidgetSchema),
    defaultValues: WidgetSchemaInitData
});
```

- `shouldUnregister: true` is added when the form contains conditionally-rendered fields (e.g. fields hidden by tab/switch state, or by a discriminated-union type field).
- For multi-step or modal-driven flows, hydrate on data load:
    ```tsx
    useEffect(() => {
        if (data) form.reset(data, { keepDefaultValues: false });
    }, [data, form]);
    ```

## 3 — Field rendering: always `<Controller>` + shadcn `Field` primitives

Never use `register` directly. Every field is a `<Controller>` rendering shadcn's `Field*` primitives:

```tsx
<Controller
    name="email"
    control={form.control}
    render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="widget-email">{t("email")}</FieldLabel>
            <InputGroup>
                <InputGroupAddon>
                    <Mail />
                </InputGroupAddon>
                <InputGroupInput
                    id="widget-email"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("placeholder-email-example")}
                    disabled={loading}
                    {...field}
                />
            </InputGroup>
            <FieldDescription>{t("widget-email-description")}</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    )}
/>
```

Recurring conventions:

- `name` matches the schema path (dotted paths for nested objects: `name="location.url"`, `name="target.flag"`).
- `id` on the input is `<feature>-<field>` (kebab-case): `widget-email`, `widget-name`, `widget-identification`.
- `aria-invalid={fieldState.invalid}` and `data-invalid={fieldState.invalid}` are both set — the first on the input, the second on the wrapping `<Field>`.
- Every field has a `FieldLabel` + `FieldDescription` (translated) + an `{fieldState.invalid && <FieldError errors={[fieldState.error]} />}` line. `FieldError` accepts an array because Zod can produce multiple issues.
- `disabled={loading}` is applied to every interactive control while a mutation is pending.

When the underlying input is uncontrolled or inside a popover/select, **omit** the spread-`...field` and instead wire `value` / `onValueChange` (or `onChange`) explicitly. This applies to `Select`, `DropdownMenu + Command`, `Popover + Calendar`, `Switch`, etc.

## 4 — Layout primitives

- The form body is wrapped in `<FieldGroup>`. Fieldsets use `<FieldSet>` + `<FieldLegend>` + `<FieldDescription>`.
- For toggle-style fields, use `orientation="horizontal"` on `<Field>` and place a `<FieldContent>` (label/description) next to the control.
- For input + description on the same row use `orientation="responsive"`.

## 5 — Submit handling

```tsx
function onSubmit(values: WidgetSchemaType) {
    const finalized = prepareWidgetData(values); // optional, defined in <Feature>.helpers.ts
    createWidget(finalized);                     // returned by useCreateWidget()
}

<form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
```

- The submit button is **at the end of the `<FieldGroup>`**, full-width by default, with `type="submit"` and:
    - Create form: `disabled={loading || !form.formState.isValid}`
    - Update form: `disabled={loading || !form.formState.isValid || !form.formState.isDirty}`
- The button label is `t("submit")` (or a feature-specific equivalent like `t("contact-send")`).

## 6 — Reset on dialog close

Dialog-hosted forms reset on `onCloseAutoFocus`, not `onOpenChange`:

```tsx
function resetState() {
    form.reset(WidgetSchemaInitData);
}

<DialogContent onCloseAutoFocus={resetState}>
```

Update dialogs do not call `resetState` because the next data load re-hydrates the form via the `useEffect` shown above.

## 7 — Dynamic Zod schemas (when forms are metadata-driven)

When a form is built dynamically from a `Record<string, FormInputSchemaType>` (e.g. user-defined custom fields):

- Use `ZodSchemaCreator(formFields)` to build the schema.
- Use `ZodSchemaDefaultValues(formFields)` to build defaults.
- Render fields with the project's `FormFieldsDynamicField` component from `src/components/form-fields/`.
- Extend the dynamic schema with `.extend({ ... })` only for known additional fields (e.g. `picture`).

Skip this section entirely when the project has no dynamic-form feature — don't introduce the abstraction speculatively.

## 8 — File / image fields

- Use the project's shared image picker (commonly `<ProfilePic image={...} setImage={...} />`) from `src/components/general/`.
- The Zod field is a `z.custom` accepting `File`, `string` (existing URL), or `undefined`:
    ```ts
    picture: z.custom(
        (value) => value === undefined || value instanceof File || typeof value === "string",
        { error: "invalid-image" }
    );
    ```
- The API layer uploads `File` instances to a presigned URL inside the `.api.ts` file — the form just hands over the `File`.

## 9 — Don't do

- Don't use `register` instead of `<Controller>`. Every field uses `<Controller>`.
- Don't use plain `<label>`, `<p>`, or `<span>` for field labels/descriptions/errors. Use the shadcn `Field*` primitives.
- Don't mix `react-hook-form`'s `<Form>` provider components from shadcn — use `<Controller>` directly.
- Don't translate validation messages inline; the message is already a translation key, and the toast / `<FieldError>` rendering is responsible for `t()`-wrapping when needed.
- Don't reset the form on `onOpenChange` — that fires before the close animation and causes flicker. Use `onCloseAutoFocus`.
