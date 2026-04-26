import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";

export function ZodSchemaInitValues(formFields: Record<string, FormInputSchemaType>, formData: Record<string, string | number | string[] | Date>) {
    const defaults: Record<string, string | number | string[] | Date> = {};

    for (const [key, _value] of Object.entries(formFields)) {
        defaults[key] = formData[key];
    }

    return defaults;
}
