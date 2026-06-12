import { ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Empty, EmptyContent } from "@/components/ui/empty"

export interface Column<T> {
  key: keyof T | string
  title: string
  render?: (row: T) => ReactNode
}

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  emptyMessage?: string
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <Empty>
        <EmptyContent>
          <p>{emptyMessage}</p>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-lg border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={column.title}
                  className="font-semibold whitespace-nowrap"
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                className="border-b last:border-b-0 hover:bg-muted/30"
              >
                {columns.map((column) => (
                  <TableCell key={column.title}>
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T] ?? "-")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {data.map((row) => (
          <div key={row.id} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="space-y-3">
              {columns.map((column) => (
                <div
                  key={column.title}
                  className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="text-sm text-muted-foreground">
                    {column.title}
                  </span>

                  <div className="text-right text-sm font-medium">
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T] ?? "-")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
