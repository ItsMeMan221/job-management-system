import { getRecentJobs } from "@/server/dashboard"
import DataTable, { Column } from "../tables/data-table"
import { Badge } from "../ui/badge"

type JobsRow = NonNullable<
  Awaited<ReturnType<typeof getRecentJobs>>["data"]
>[number]

export default async function RecentJob() {
  const data = await getRecentJobs()

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
  ]
  return <DataTable columns={columns} data={data?.data || []}></DataTable>
}
