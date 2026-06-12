import { getTopCardData } from "@/server/dashboard"

import { DashboardStatCard } from "./stat-card"
import formatNumber from "@/utils/general"

export async function TopCard() {
  const data = await getTopCardData()

  console.log("Top card data:", data)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard title="Total Jobs" value={data.totalJobs as number} />
      <DashboardStatCard
        title="Active Jobs"
        value={data.totalActiveJobs as number}
      />
      <DashboardStatCard
        title="Completed Jobs"
        value={data.completedJobs as number}
      />
      <DashboardStatCard
        title="Total Payment"
        value={`Rp. ${formatNumber(data.totalPayment as number)}`}
      />
    </div>
  )
}
