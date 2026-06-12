import { getJobLogs, getJobs, updateJobStatus } from "@/server/jobs"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import DataTable, { Column } from "../tables/data-table"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Spinner } from "../ui/spinner"
import { ArrowLeft } from "lucide-react"

type statusEnum = "NEW" | "ASSIGNED" | "TRANSCRIBED" | "REVIEWED" | "COMPLETED"

interface UpdateStatusFormProps {
  data?: NonNullable<Awaited<ReturnType<typeof getJobs>>["data"]>[number]
  jobLogData?: Awaited<ReturnType<typeof getJobLogs>>["data"]
}
export default function UpdateStatusForm({
  data,
  jobLogData,
}: UpdateStatusFormProps) {
  const router = useRouter()
  type JobLogRow = NonNullable<
    Awaited<ReturnType<typeof getJobLogs>>["data"]
  >[number]

  const currentStatus = data?.status
  const statusOptions = [
    { value: "NEW", label: "New" },
    { value: "ASSIGNED", label: "Assigned" },
    { value: "TRANSCRIBED", label: "Transcribed" },
    { value: "REVIEWED", label: "Reviewed" },
    { value: "COMPLETED", label: "Completed" },
  ]

  const columns: Column<JobLogRow>[] = [
    {
      key: "newStatus",
      title: "Status",
    },
    {
      key: "createdAt",
      title: "Changed At",
      render: (row) => {
        return new Date(row.createdAt).toLocaleString()
      },
    },
  ]

  const nextStatusIndex =
    currentStatus &&
    statusOptions.findIndex((s) => s.value === currentStatus) + 1

  const previousStatusIndex =
    currentStatus &&
    statusOptions.findIndex((s) => s.value === currentStatus) - 1

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newStatus: statusEnum) => {
      return await updateJobStatus(data?.id as string, newStatus)
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Status updated successfully")
      router.refresh()
    },
    onError: (err) => {
      toast.error("Failed to update status")
    },
  })

  const onMoveStatus = async (newStatus: statusEnum) => {
    if (data?.status === "NEW" && !data.reporterId) {
      toast.error("Cannot move to ASSIGNED status without a reporter assigned")
      return
    } else if (data?.status === "TRANSCRIBED" && !data.editorId) {
      toast.error(
        "Cannot move to TRANSCRIBED status without an editor assigned"
      )
      return
    }
    await mutateAsync(newStatus)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium tracking-wide">Update Status</h2>
        </CardHeader>
        <CardContent>
          {previousStatusIndex !== -1 && previousStatusIndex! >= 0 ? (
            <Button
              disabled={isPending}
              variant="destructive"
              className="mx-2"
              onClick={() =>
                onMoveStatus(
                  statusOptions[previousStatusIndex!].value as statusEnum
                )
              }
            >
              {isPending && <Spinner />}
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {statusOptions[previousStatusIndex!].label}
            </Button>
          ) : null}
          {nextStatusIndex !== -1 && nextStatusIndex! < statusOptions.length ? (
            <Button
              disabled={isPending}
              variant="default"
              onClick={() =>
                onMoveStatus(
                  statusOptions[nextStatusIndex!].value as statusEnum
                )
              }
            >
              {isPending && <Spinner />}
              <ArrowLeft className="mr-2 h-4 w-4 rotate-180" />
              Move to {statusOptions[nextStatusIndex!].label}
            </Button>
          ) : null}

          <div className="mt-4">
            <DataTable columns={columns} data={jobLogData || []} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
