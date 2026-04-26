import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@tanstack/react-table';

function StaffTablePagination<TData>({ table }: { table: Table<TData> }) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
                <p className="text-muted-foreground text-sm">
                    {t("showing-rows", { count: table.getRowModel().rows.length, total: table.getRowCount() })}
                </p>
                <p className="text-sm font-medium">
                    {t("page-of", { current: table.getState().pagination.pageIndex + 1, total: table.getPageCount() === 0 ? 1 : table.getPageCount() })}
                </p>
            </div>
            <div className="flex items-center justify-between gap-4">
                <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
                    <SelectTrigger className="text-muted-foreground h-8 w-36">
                        <SelectValue placeholder={t("page-size", { size: table.getState().pagination.pageSize })} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {t("items-count", { count: pageSize })}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                        <ChevronsLeft className="rtl:rotate-180" />
                    </Button>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        <ChevronLeft className="rtl:rotate-180" />
                    </Button>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <ChevronRight className="rtl:rotate-180" />
                    </Button>
                    <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                        <ChevronsRight className="rtl:rotate-180" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
export default StaffTablePagination;
