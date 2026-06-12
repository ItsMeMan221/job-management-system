import MonthlyPayoutChart from "@/components/dashboard/monthly-payout-chart"
import RecentJob from "@/components/dashboard/recent-job"
import StatusChart from "@/components/dashboard/status-chart"

import { TopCard } from "@/components/dashboard/top-card"
import { Button } from "@/components/ui/button"
import { getBarStatusJobChart, getMonthlyPayoutChart } from "@/server/dashboard"
import { Plus } from "lucide-react"
import Link from "next/link"
export const dynamic = "force-dynamic"

export default async function Page() {
  const dataStatusChart = await getBarStatusJobChart()
  const monthlyPayoutChart = await getMonthlyPayoutChart()
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-sm leading-loose">
          <h1 className="mb-2 text-2xl font-medium">Dashboard</h1>
          <p>Welcome to your dashboard!</p>
        </div>
        <Link href="/jobs/add">
          <Button size="sm">
            <Plus className="mr-2" />
            Add Job
          </Button>
        </Link>
      </div>

      <TopCard />

      <div className="mt-8">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Job Status
            </h2>
            <StatusChart data={dataStatusChart} />
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Monthly Payout
            </h2>
            <MonthlyPayoutChart data={monthlyPayoutChart} />
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Recent Jobs</h2>
        <Link href="/jobs">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <RecentJob />
    </>
  )
}
