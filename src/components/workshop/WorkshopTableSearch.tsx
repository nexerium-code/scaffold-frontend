import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table } from "@tanstack/react-table";

type WorkshopTableSearchProps<TData> = {
    table: Table<TData>;
};

function WorkshopTableSearch<TData>({ table }: WorkshopTableSearchProps<TData>) {
    const { t } = useTranslation();
    const filterValue = (table.getColumn("titleEN")?.getFilterValue() as string) || "";

    function handleSearch(query: string) {
        table.getColumn("titleEN")?.setFilterValue(query);
    }

    return (
        <InputGroup className="max-w-sm">
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder={t("search-dots")} value={filterValue} onChange={(e) => handleSearch(e.target.value)} />
        </InputGroup>
    );
}

export default WorkshopTableSearch;
