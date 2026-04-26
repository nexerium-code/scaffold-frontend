import { FormInputTypes } from "@/lib/enums";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";

export function ZodSchemaDefaultValues(formFields: Record<string, FormInputSchemaType>) {
    const defaults: Record<string, string | number | string[] | undefined> = {};

    for (const [key, value] of Object.entries(formFields)) {
        if (value.type === FormInputTypes.SHORT_TEXT) defaults[key] = "";
        if (value.type === FormInputTypes.LONG_TEXT) defaults[key] = "";
        if (value.type === FormInputTypes.EMAIL) defaults[key] = "";
        if (value.type === FormInputTypes.NUMBER) defaults[key] = "";
        if (value.type === FormInputTypes.PHONE) defaults[key] = "";
        if (value.type === FormInputTypes.LINK) defaults[key] = "";
        if (value.type === FormInputTypes.RADIO) defaults[key] = "";
        if (value.type === FormInputTypes.SELECT) defaults[key] = "";
        if (value.type === FormInputTypes.CHECKBOX) defaults[key] = undefined;
        if (value.type === FormInputTypes.DATE) defaults[key] = "";
        if (value.type === FormInputTypes.TIME) defaults[key] = "";
        if (value.type === FormInputTypes.DATE_RANGE) defaults[key] = "";
    }

    return defaults;
}
