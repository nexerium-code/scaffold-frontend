import { CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormInputTypes } from "@/lib/enums";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";

type FormFieldsDynamicFieldViewProps = {
    field: FormInputSchemaType;
    invalid: boolean;
};

function FormFieldsDynamicFieldView({ field, invalid }: FormFieldsDynamicFieldViewProps) {
    const { t } = useTranslation();

    if (!field) return null;

    if (field.type === FormInputTypes.EMAIL) {
        return <Input type="email" placeholder={t("placeholder-email-example")} aria-invalid={invalid} readOnly />;
    }

    if (field.type === FormInputTypes.SHORT_TEXT) {
        return <Input type="text" placeholder={t("placeholder-enter-answer")} aria-invalid={invalid} readOnly />;
    }

    if (field.type === FormInputTypes.LONG_TEXT) {
        return <Textarea placeholder={t("placeholder-enter-answer")} aria-invalid={invalid} readOnly />;
    }

    if (field.type === FormInputTypes.LINK) {
        return <Input type="url" placeholder={t("placeholder-url-example")} aria-invalid={invalid} readOnly />;
    }

    if (field.type === FormInputTypes.NUMBER) {
        return <Input type="number" placeholder={t("placeholder-number")} aria-invalid={invalid} readOnly />;
    }

    if (field.type === FormInputTypes.PHONE) {
        return <Input type="tel" placeholder={t("placeholder-phone")} aria-invalid={invalid} readOnly />;
    }

    if (field.type === FormInputTypes.CHECKBOX) {
        return (
            <FieldGroup className="gap-2">
                {field.options?.map((option, index) => (
                    <Field key={`${field.titleEN}-${field.type}-${option}-${index}`} orientation="horizontal" data-invalid={invalid}>
                        <Checkbox checked={false} aria-invalid={invalid} />
                        <FieldLabel className="font-normal">{option}</FieldLabel>
                    </Field>
                ))}
            </FieldGroup>
        );
    }

    if (field.type === FormInputTypes.RADIO) {
        return (
            <RadioGroup aria-invalid={invalid} className="gap-2">
                {field.options?.map((option, index) => (
                    <Field key={`${field.titleEN}-${field.type}-${option}-${index}`} orientation="horizontal">
                        <RadioGroupItem value={option} aria-invalid={invalid} />
                        <FieldLabel className="font-normal">{option}</FieldLabel>
                    </Field>
                ))}
            </RadioGroup>
        );
    }

    if (field.type === FormInputTypes.SELECT) {
        return (
            <Select value="form-view-select">
                <SelectTrigger aria-invalid={invalid} aria-readonly className="w-full">
                    {t("placeholder-select-dots")}
                </SelectTrigger>
                <SelectContent>
                    {field.options?.map((el, index) => (
                        <SelectItem key={field.titleEN + field.type + el + index} value={el}>
                            {el}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    if (field.type === FormInputTypes.DATE) {
        return (
            <Button type="button" variant="outline" aria-invalid={invalid} className="bg-transparent font-normal hover:bg-transparent">
                {t("select-date")}
                <CalendarIcon className="ms-auto" />
            </Button>
        );
    }
}

export default FormFieldsDynamicFieldView;
