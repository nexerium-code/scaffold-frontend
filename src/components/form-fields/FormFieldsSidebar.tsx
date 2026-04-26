import { Blocks, Plus } from "lucide-react";
import { UseFieldArrayAppend } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { FormInputTypes, FormInputTypesIcons } from "@/lib/enums";
import { AttendanceFormFieldsAttendeesSchemaType, AttendanceFormFieldsExclusivesSchemaType } from "@/services/attendance/Attendance.formFields.schemas";

type FormFieldsSidebarProps<T extends AttendanceFormFieldsAttendeesSchemaType | AttendanceFormFieldsExclusivesSchemaType> = {
    addField: UseFieldArrayAppend<T>;
};

function FormFieldsSidebar<T extends AttendanceFormFieldsAttendeesSchemaType | AttendanceFormFieldsExclusivesSchemaType>({ addField }: FormFieldsSidebarProps<T>) {
    const { t, i18n } = useTranslation();

    return (
        <Sidebar className="top-12 h-[calc(100vh-3rem)]" side={i18n.language === "en-US" ? "left" : "right"}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2 p-2">
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                            <Blocks className="size-4" />
                        </div>
                        <div className="grid flex-1 text-sm leading-tight">
                            <span className="truncate font-semibold">{t("form-builder")}</span>
                            <span className="truncate text-xs">{t("customize")}</span>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("fields")}</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton type="button" tooltip={t("short-text")} onClick={() => addField({ titleEN: "", titleAR: "", type: FormInputTypes.SHORT_TEXT, unique: false, required: true } as never)}>
                                {<FormInputTypesIcons.ShortText />}
                                <span className="me-auto">{t("short-text")}</span>
                                <Plus />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton type="button" tooltip={t("long-text")} onClick={() => addField({ titleEN: "", titleAR: "", type: FormInputTypes.LONG_TEXT, unique: false, required: true } as never)}>
                                {<FormInputTypesIcons.LongText />}
                                <span className="me-auto">{t("long-text")}</span>
                                <Plus />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton type="button" tooltip={t("link")} onClick={() => addField({ titleEN: "", titleAR: "", type: FormInputTypes.LINK, unique: false, required: true } as never)}>
                                {<FormInputTypesIcons.Link />}
                                <span className="me-auto">{t("link")}</span>
                                <Plus />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("digits")}</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton type="button" tooltip={t("number")} onClick={() => addField({ titleEN: "", titleAR: "", type: FormInputTypes.NUMBER, unique: false, required: true } as never)}>
                                {<FormInputTypesIcons.Number />}
                                <span className="me-auto">{t("number")}</span>
                                <Plus />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton type="button" tooltip={t("phone")} onClick={() => addField({ titleEN: "", titleAR: "", type: FormInputTypes.PHONE, unique: true, required: true } as never)}>
                                {<FormInputTypesIcons.Phone />}
                                <span className="me-auto">{t("phone")}</span>
                                <Plus />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("options")}</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton type="button" tooltip={t("checkbox")} onClick={() => addField({ titleEN: "", titleAR: "", type: FormInputTypes.CHECKBOX, unique: false, required: true, options: ["OP1", "OP2", "OP3"] } as never)}>
                                {<FormInputTypesIcons.Checkbox />}
                                <span className="me-auto">{t("checkbox")}</span>
                                <Plus />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton type="button" tooltip={t("radio")} onClick={() => addField({ titleEN: "", titleAR: "", type: FormInputTypes.RADIO, unique: false, required: true, options: ["OP1", "OP2", "OP3"] } as never)}>
                                {<FormInputTypesIcons.Radio />}
                                <span className="me-auto">{t("radio")}</span>
                                <Plus />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton type="button" tooltip={t("select")} onClick={() => addField({ titleEN: "", titleAR: "", type: FormInputTypes.SELECT, unique: false, required: true, options: ["OP1", "OP2", "OP3"] } as never)}>
                                {<FormInputTypesIcons.Select />}
                                <span className="me-auto">{t("select")}</span>
                                <Plus />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("dates")}</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton type="button" tooltip={t("date")} onClick={() => addField({ titleEN: "", titleAR: "", type: FormInputTypes.DATE, unique: false, required: true } as never)}>
                                {<FormInputTypesIcons.Date />}
                                <span className="me-auto">{t("date")}</span>
                                <Plus />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail type="button" />
        </Sidebar>
    );
}

export default FormFieldsSidebar;
