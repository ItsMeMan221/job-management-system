import DataTable, { Column } from "./data-table"
import { Badge } from "../ui/badge"
import { Edit } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { getJobs } from "@/server/jobs"

export default async function JobsTable() {
  const jobs = await getJobs()

  type JobsRow = NonNullable<
    Awaited<ReturnType<typeof getJobs>>["data"]
  >[number]
  const columns: Column<JobsRow>[] = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "duration",
      title: "Duration (mins)",
    },
    {
      key: "location",
      title: "Location",
    },
    {
      key: "city",
      title: "City",
      render: (row) => {
        return row.city || "N/A"
      },
    },
    {
      key: "reporter",
      title: "Reporter",
      render: (row) => {
        return row.reporter || "N/A"
      },
    },
    {
      key: "editor",
      title: "Editor",
      render: (row) => {
        return row.editor || "N/A"
      },
    },
    {
      key: "status",
      title: "Status",
      render: (row) => {
        if (row.status === "NEW") {
          return <Badge variant="default">New</Badge>
        }
        if (row.status === "ASSIGNED") {
          return <Badge className="bg-yellow-500 text-white">Assigned</Badge>
        }
        if (row.status === "TRANSCRIBED") {
          return <Badge className="bg-blue-500 text-white">Transcribed</Badge>
        }
        if (row.status === "REVIEWED") {
          return <Badge className="bg-purple-500 text-white">Reviewed</Badge>
        }
        if (row.status === "COMPLETED") {
          return <Badge className="bg-green-500 text-white">Completed</Badge>
        }
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => {
        return (
          <Link href={`/jobs/${row.id}`}>
            <Button variant="secondary" size="sm">
              <Edit className="h-4 w-4" /> Edit
            </Button>
          </Link>
        )
      },
    },
  ]
  return <DataTable columns={columns} data={jobs?.data || []}></DataTable>
}
