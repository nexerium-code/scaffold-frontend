import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Table } from "@tanstack/react-table";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

function ResourcesTableSearch<TData>({ table }: { table: Table<TData> }) {
    const { t } = useTranslation();

    return (
        <InputGroup className="max-w-sm">
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder={t("search-dots")} value={(table.getColumn("name")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)} />
        </InputGroup>
    );
}

export default ResourcesTableSearch;
