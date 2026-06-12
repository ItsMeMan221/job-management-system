import { getPeople } from "@/server/people"
import DataTable, { Column } from "./data-table"
import formatNumber from "@/utils/general"
import { Badge } from "../ui/badge"
import { Check, Edit, X } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

export default async function PeopleTable() {
  const people = await getPeople()

  type PeopleRow = NonNullable<
    Awaited<ReturnType<typeof getPeople>>["data"]
  >[number]
  const columns: Column<PeopleRow>[] = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "city",
      title: "City",
    },
    {
      key: "rateType",
      title: "Rate Type",
      render: (row) => {
        return row.rateType === "MINUTE" ? "Minute" : "Flat"
      },
    },
    {
      key: "rate",
      title: "Rate",
      render: (row) => {
        return formatNumber(row.rate)
      },
    },
    {
      key: "type",
      title: "Role",
      render: (row) => {
        return row.type === "REPORTER" ? "Reporter" : "Editor"
      },
    },
    {
      key: "available",
      title: "Availability",
      render: (row) => {
        return row.available ? (
          <Badge variant="default">
            <Check className="h-4 w-4" /> Available
          </Badge>
        ) : (
          <Badge variant="destructive">
            <X className="h-4 w-4" /> Unavailable
          </Badge>
        )
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => {
        return (
          <Link href={`/people/${row.id}`}>
            <Button variant="secondary" size="sm">
              <Edit className="h-4 w-4" /> Edit
            </Button>
          </Link>
        )
      },
    },
  ]
  return <DataTable columns={columns} data={people?.data || []}></DataTable>
}
