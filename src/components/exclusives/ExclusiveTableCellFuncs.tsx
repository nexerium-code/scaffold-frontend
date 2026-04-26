import { format } from "date-fns";
import { CodeXml } from "lucide-react";

import CopyInput from "@/components/general/CopyInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

function FormatPictureCell(src: string, t: (key: string) => string) {
    return (
        <TableRow>
            <TableCell className="font-medium">{t("picture")}</TableCell>
            <TableCell className="font-semibold underline">
                <Avatar className="size-14 rounded-lg">
                    <AvatarImage src={src} alt="profilePic" />
                    <AvatarFallback className="rounded-lg">PP</AvatarFallback>
                </Avatar>
            </TableCell>
        </TableRow>
    );
}

function FormatEmailCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell className="font-semibold underline">{safeValue}</TableCell>
        </TableRow>
    );
}

function FormatShortTextCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell className="w-max max-w-28 truncate">{safeValue}</TableCell>
        </TableRow>
    );
}

function FormatLongTextCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell className="w-max max-w-56 truncate">{safeValue}</TableCell>
        </TableRow>
    );
}

function FormatLinkTextCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{<CopyInput icon={CodeXml} value={safeValue} className="max-w-56" />}</TableCell>
        </TableRow>
    );
}

function FormatNumberCell(key: string, value: unknown) {
    const safeValue = (value as number) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{safeValue}</TableCell>
        </TableRow>
    );
}

function FormatPhoneCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell className="font-semibold italic">{safeValue}</TableCell>
        </TableRow>
    );
}

function FormatCheckboxCell(key: string, value: unknown) {
    const safeValue = (value as string[]) || [];
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    {safeValue.map((el, index) => (
                        <Badge key={el} variant={index % 2 === 0 ? "outline" : "secondary"}>
                            {el}
                        </Badge>
                    ))}
                </div>
            </TableCell>
        </TableRow>
    );
}

function FormatRadioCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>
                <Badge>{safeValue}</Badge>
            </TableCell>
        </TableRow>
    );
}

function FormatSelectCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>
                <Badge variant="outline">{safeValue}</Badge>
            </TableCell>
        </TableRow>
    );
}

function FormatDateCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{format(safeValue, "P")}</TableCell>
        </TableRow>
    );
}

export { FormatPictureCell, FormatEmailCell, FormatShortTextCell, FormatLongTextCell, FormatLinkTextCell, FormatNumberCell, FormatPhoneCell, FormatCheckboxCell, FormatRadioCell, FormatSelectCell, FormatDateCell };
