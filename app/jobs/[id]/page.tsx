import DeleteJobsForm from "@/components/forms/delete-jobs-form"
import { UpdateJobForm } from "@/components/forms/update-job-form"
import { Badge } from "@/components/ui/badge"
import NotFound from "@/components/ui/not-found"
import { getJobLogs, getJobs } from "@/server/jobs"
import { getPeople } from "@/server/people"

interface PageProps {
  params: Promise<{ id: string }>
}
export const dynamic = "force-dynamic"
export default async function Page({ params }: PageProps) {
  const { id } = await params

  const jobData = await getJobs({
    id: id,
  })

  const job = jobData?.data?.[0]

  if (!job) {
    return (
      <NotFound
        title="Job Not found!"
        backHref="/jobs"
        backLabel="Go Back"
        description="Job you are looking for does not exist or has been removed."
      />
    )
  }

  const reporterData = await getPeople(
    {
      type: "REPORTER",
      available: true,
    },
    job?.location === "ONSITE" ? (job?.cityId ?? undefined) : undefined
  )
  const editorData = await getPeople(
    {
      type: "EDITOR",
      available: true,
    },
    job?.location === "ONSITE" ? (job?.cityId ?? undefined) : undefined
  )
  const jobLogData = await getJobLogs(id)

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-2xl font-medium tracking-wider">
              {job.name}
            </h1>
            <p className="tracking-wide text-muted-foreground">
              {job.duration} Minutes - {job.location}
              {job.city && ` - ${job.city}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {job.status === "NEW" && (
              <Badge variant="default" className="px-4 py-2">
                New
              </Badge>
            )}
            {job.status === "ASSIGNED" && (
              <Badge
                variant="default"
                className="bg-yellow-500 px-4 py-2 text-white"
              >
                Assigned
              </Badge>
            )}
            {job.status === "TRANSCRIBED" && (
              <Badge
                variant="default"
                className="bg-blue-500 px-4 py-2 text-white"
              >
                Transcribed
              </Badge>
            )}
            {job.status === "REVIEWED" && (
              <Badge
                variant="default"
                className="bg-purple-500 px-4 py-2 text-white"
              >
                Reviewed
              </Badge>
            )}
            {job.status === "COMPLETED" && (
              <Badge
                variant="default"
                className="bg-green-500 px-4 py-2 text-white"
              >
                Completed
              </Badge>
            )}
            {job.status !== "COMPLETED" && <DeleteJobsForm data={job} />}
          </div>
        </div>

        <div className="mt-4">
          <UpdateJobForm
            reporterData={reporterData?.data || []}
            editorData={editorData?.data || []}
            data={job}
            jobLogData={jobLogData?.data || []}
          />
        </div>
      </div>
    </>
  )
}
