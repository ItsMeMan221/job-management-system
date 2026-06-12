import JobsTable from "@/components/tables/jobs-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
export const dynamic = "force-dynamic"
export default function Page() {
  return (
    <>
      <div className="text-sm leading-loose">
        <h1 className="mb-2 text-2xl font-medium">Jobs Page</h1>
        <p>This page displays a list of jobs</p>
      </div>
      <Link href="/jobs/add">
        <Button className="my-4 w-full px-2 py-4 lg:w-1/4">
          <Plus /> Add Job
        </Button>
      </Link>
      <JobsTable />
    </>
  )
}
