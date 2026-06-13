import JobsTable from "@/components/tables/jobs-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
export const dynamic = "force-dynamic"
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string
    city?: string
    location?: string
    status?: string
  }>
}) {
  const params = await searchParams
  return (
    <>
      <div className="text-sm leading-loose">
        <h1 className="mb-2 text-2xl font-medium">Jobs Page</h1>
        <p>This page displays a list of jobs</p>
      </div>
      <Link href="/jobs/add" className="w-full lg:w-1/4">
        <Button className="my-4 w-full cursor-pointer px-2 py-4">
          <Plus /> Add Job
        </Button>
      </Link>
      <JobsTable searchParams={params} />
    </>
  )
}
