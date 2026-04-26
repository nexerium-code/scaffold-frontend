import { useTranslation } from 'react-i18next';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, Table as TableType } from '@tanstack/react-table';

function AttendeesTableMain<TData>({ table }: { table: TableType<TData> }) {
    const { t } = useTranslation();
    const isEmpty = table.getRowModel().rows?.length === 0;

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id} className="text-foreground">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            );
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {!isEmpty &&
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                            ))}
                        </TableRow>
                    ))}

                {isEmpty && (
                    <TableRow>
                        <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                            {t("no-results")}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

export default AttendeesTableMain;
