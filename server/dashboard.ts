import db from "@/db/drizzle"
import { cities, jobLog, jobs, peoples } from "@/db/scheme"
import { and, eq, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export async function getTopCardData() {
  try {
    const totalJobs = await db
      .select({ count: sql`COUNT(*)` })
      .from(jobs)
      .execute()
    const totalActiveJobs = await db
      .select({ count: sql`COUNT(*)` })
      .from(jobs)
      .where(sql`${jobs.status} <> 'COMPLETED'`)
      .execute()
    const completedJobs = await db
      .select({ count: sql`COUNT(*)` })
      .from(jobs)
      .where(sql`${jobs.status} = 'COMPLETED'`)
      .execute()
    const totalPayment = await db
      .select({
        total: sql`SUM(CASE WHEN ${jobs.status} = 'COMPLETED' THEN ${jobs.editorRate} + ${jobs.reporterRate} ELSE 0 END)`,
      })
      .from(jobs)
      .execute()

    return {
      totalJobs: totalJobs[0]?.count || 0,
      totalActiveJobs: totalActiveJobs[0]?.count || 0,
      completedJobs: completedJobs[0]?.count || 0,
      totalPayment: totalPayment[0]?.total || 0,
    }
  } catch (err) {
    console.error("Error fetching top card data:", err)
    return { message: "Failed to fetch top card data" }
  }
}

export async function getBarStatusJobChart() {
  try {
    const data = await db
      .select({
        status: jobs.status,
        count: sql<number>`COUNT(*)`,
      })
      .from(jobs)
      .groupBy(jobs.status)

    return {
      data: data.map((item) => ({
        status: item.status,
        count: item.count,
      })),
      message: "Bar status job chart data fetched successfully",
    }
  } catch (err) {
    console.error("Error fetching bar status job chart data:", err)
    return { message: "Failed to fetch bar status job chart data" }
  }
}

export async function getMonthlyPayoutChart() {
  try {
    const currentYear = new Date().getFullYear()

    const result = await db
      .select({
        month: sql<string>`TO_CHAR(${jobLog.timestamp}, 'Mon')`,
        monthNumber: sql<number>`EXTRACT(MONTH FROM ${jobLog.timestamp})`,
        payout: sql<number>`
          SUM(
            COALESCE(${jobs.reporterRate}, 0) +
            COALESCE(${jobs.editorRate}, 0)
          )
        `,
      })
      .from(jobLog)
      .innerJoin(jobs, eq(jobLog.jobId, jobs.id))
      .where(
        and(
          eq(jobLog.newStatus, "COMPLETED"),
          sql`EXTRACT(YEAR FROM ${jobLog.timestamp}) = ${currentYear}`
        )
      )
      .groupBy(
        sql`EXTRACT(MONTH FROM ${jobLog.timestamp})`,
        sql`TO_CHAR(${jobLog.timestamp}, 'Mon')`
      )
      .orderBy(sql`EXTRACT(MONTH FROM ${jobLog.timestamp})`)

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]

    const data = months.map((month, index) => {
      const found = result.find((r) => Number(r.monthNumber) === index + 1)

      return {
        month,
        payout: Number(found?.payout ?? 0),
      }
    })

    return {
      data,
      message: "Monthly payout chart fetched successfully",
    }
  } catch (err) {
    console.error("Error fetching monthly payout chart:", err)

    return {
      message: "Failed to fetch monthly payout chart",
    }
  }
}

export async function getRecentJobs() {
  const reporter = alias(peoples, "reporter")
  const editor = alias(peoples, "editor")
  const reporterCity = alias(cities, "reporterCity")
  const editorCity = alias(cities, "editorCity")
  try {
    const data = await db
      .select({
        id: jobs.id,
        name: jobs.name,
        duration: jobs.duration,
        location: jobs.location,
        cityId: jobs.cityId,
        city: cities.name,
        editorId: jobs.editorId,
        editorRateType: jobs.editorRateType,
        editorRate: jobs.editorRate,
        editor: editor.name,
        editorCityId: editor.cityId,
        editorCity: editorCity.name,
        reporterId: jobs.reporterId,
        reporter: reporter.name,
        reporterRateType: jobs.reporterRateType,
        reporterRate: jobs.reporterRate,
        reporterCityId: reporter.cityId,
        reporterCity: reporterCity.name,
        status: jobs.status,
      })
      .from(jobs)
      .leftJoin(cities, eq(jobs.cityId, cities.id))
      .leftJoin(editor, eq(jobs.editorId, editor.id))
      .leftJoin(reporter, eq(jobs.reporterId, reporter.id))
      .leftJoin(reporterCity, eq(reporter.cityId, reporterCity.id))
      .leftJoin(editorCity, eq(editor.cityId, editorCity.id))
      .orderBy(sql`${jobs.createdAt} DESC`)
      .limit(5)
    return { data, message: "Jobs fetched successfully" }
  } catch (err) {
    console.error("Error fetching recent jobs:", err)
    return { message: "Failed to fetch recent jobs" }
  }
}
