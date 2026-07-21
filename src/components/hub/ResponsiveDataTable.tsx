import * as React from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ResponsiveDataTableColumn<TRow> {
  key: string;
  header: string;
  render: (row: TRow) => React.ReactNode;
  className?: string;
  /** Rendered as the card title in the mobile stacked layout. Only the first primary column is used. */
  isPrimary?: boolean;
}

export interface ResponsiveDataTableProps<TRow> {
  columns: ResponsiveDataTableColumn<TRow>[];
  rows: TRow[];
  getRowKey: (row: TRow) => string;
  onRowClick?: (row: TRow) => void;
  emptyState?: React.ReactNode;
  className?: string;
}

/** Presentational data table — a real table on desktop, stacked cards on mobile. */
export function ResponsiveDataTable<TRow>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  emptyState,
  className,
}: ResponsiveDataTableProps<TRow>) {
  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  const primaryColumn = columns.find((column) => column.isPrimary) ?? columns[0];
  const secondaryColumns = columns.filter((column) => column.key !== primaryColumn?.key);

  return (
    <div className={cn(className)}>
      {/* Desktop table */}
      <div className="hidden rounded-[16px] border border-white/5 bg-background/40 backdrop-blur-xl md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={getRowKey(row)}
                className={cn("border-white/5", onRowClick && "cursor-pointer")}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile stacked cards */}
      <div className="space-y-2 md:hidden">
        {rows.map((row) => (
          <div
            key={getRowKey(row)}
            onClick={() => onRowClick?.(row)}
            className={cn(
              "rounded-[16px] border border-white/5 bg-background/40 p-4 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)]",
              onRowClick && "cursor-pointer",
            )}
          >
            {primaryColumn && (
              <div className="mb-2 text-sm font-medium text-foreground">{primaryColumn.render(row)}</div>
            )}
            <dl className="grid grid-cols-2 gap-2 text-xs">
              {secondaryColumns.map((column) => (
                <div key={column.key} className="min-w-0 space-y-0.5">
                  <dt className="text-muted-foreground">{column.header}</dt>
                  <dd className="truncate text-foreground">{column.render(row)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
