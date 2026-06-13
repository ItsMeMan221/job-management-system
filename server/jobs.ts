"use server"

import db from "@/db/drizzle"
import { cities, Job, jobLog, jobs, peoples } from "@/db/scheme"
import { and, eq, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export async function getJobs(filter?: Partial<Job & { city: string }>) {
  const reporter = alias(peoples, "reporter")
  const editor = alias(peoples, "editor")
  const reporterCity = alias(cities, "reporterCity")
  const editorCity = alias(cities, "editorCity")
  try {
    if (!filter) {
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
      return { data, message: "Jobs fetched successfully" }
    }

    const conditions = []
    if (filter.id) {
      conditions.push(eq(jobs.id, filter.id))
    }
    if (filter.name) {
      conditions.push(sql`${jobs.name} ilike ${`%${filter.name}%`}`)
    }
    if (filter.city) {
      conditions.push(sql`${cities.name} ilike ${`%${filter.city}%`}`)
    }
    if (filter.location) {
      conditions.push(eq(jobs.location, filter.location))
    }
    if (filter.status) {
      conditions.push(eq(jobs.status, filter.status))
    }

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
      .where(conditions.length ? and(...conditions) : undefined)
    return { data, message: "Jobs fetched successfully" }
  } catch (err) {
    console.error("Error fetching jobs:", err)
    return { message: "Failed to fetch jobs" }
  }
}

export async function getJobLogs(jobId: string) {
  try {
    const data = await db
      .select({
        id: jobLog.id,
        jobId: jobLog.jobId,
        previousStatus: jobLog.previousStatus,
        newStatus: jobLog.newStatus,
        createdAt: jobLog.timestamp,
      })
      .from(jobLog)
      .where(eq(jobLog.jobId, jobId))
      .orderBy(sql`${jobLog.timestamp} desc`)
    return { data, message: "Job logs fetched successfully" }
  } catch (err) {
    console.error("Error fetching job logs:", err)
    return { message: "Failed to fetch job logs" }
  }
}

export async function addJob(
  job: Omit<
    Job,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "reporterRate"
    | "reporterRateType"
    | "editorRate"
    | "editorRateType"
    | "status"
    | "reporterId"
    | "editorId"
  >
) {
  try {
    const newJob = await db.insert(jobs).values(job).returning()
    // Log Job
    await db.insert(jobLog).values({
      jobId: newJob[0].id,
      newStatus: newJob[0].status,
    })
    return { data: newJob, message: "Job added successfully" }
  } catch (err) {
    console.error("Error adding job:", err)
    return { message: "Failed to add job" }
  }
}

export async function updateJob(
  id: string,
  job: Partial<
    Omit<
      Job,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "status"
      | "name"
      | "duration"
      | "location"
      | "cityId"
    >
  >
) {
  try {
    const updatedJob = await db

      .update(jobs)
      .set(job)
      .where(eq(jobs.id, id))
      .returning()
    return { data: updatedJob, message: "Job updated successfully" }
  } catch (err) {
    console.error("Error updating job:", err)
    return { message: "Failed to update job" }
  }
}

export async function updateJobStatus(id: string, status: Job["status"]) {
  try {
    const existingJob = await db
      .select({
        status: jobs.status,
      })
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1)

    if (existingJob.length === 0) {
      return { message: "Job not found" }
    }

    const updatedJob = await db
      .update(jobs)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, id))
      .returning()

    await db.insert(jobLog).values({
      jobId: id,
      previousStatus: existingJob?.[0]?.status,
      newStatus: status,
    })

    return {
      data: updatedJob,
      message: "Job status updated successfully",
    }
  } catch (err) {
    console.error("Error updating job status:", err)
    return {
      message: "Failed to update job status",
    }
  }
}

export async function deleteJob(id: string) {
  try {
    await db.delete(jobs).where(eq(jobs.id, id))
    return { message: "Job deleted successfully" }
  } catch (err) {
    console.error("Error deleting job:", err)
    return { message: "Failed to delete job" }
  }
}
