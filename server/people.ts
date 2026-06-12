"use server"

import db from "@/db/drizzle"
import { cities, People, peoples } from "@/db/scheme"
import { and, asc, eq, ilike, sql } from "drizzle-orm"

export async function getPeople(
  filter?: Partial<People & { city: string }>,
  preferredCityId?: string
) {
  try {
    const conditions = []

    if (filter?.id) {
      conditions.push(eq(peoples.id, filter.id))
    }

    if (filter?.name) {
      conditions.push(ilike(peoples.name, `%${filter.name}%`))
    }

    if (filter?.city) {
      conditions.push(ilike(cities.name, `%${filter.city}%`))
    }

    if (filter?.type) {
      conditions.push(eq(peoples.type, filter.type))
    }

    if (filter?.available !== undefined) {
      conditions.push(eq(peoples.available, filter.available))
    }

    const query = db
      .select({
        id: peoples.id,
        name: peoples.name,
        cityId: peoples.cityId,
        city: cities.name,
        rateType: peoples.rateType,
        rate: peoples.rate,
        type: peoples.type,
        available: peoples.available,
      })
      .from(peoples)
      .leftJoin(cities, eq(peoples.cityId, cities.id))
      .where(conditions.length ? and(...conditions) : undefined)

    const data = preferredCityId
      ? await query.orderBy(
          sql`
            CASE
              WHEN ${peoples.cityId} = ${preferredCityId} THEN 0
              ELSE 1
            END
          `,
          asc(peoples.name)
        )
      : await query.orderBy(asc(peoples.name))

    return {
      data,
      message: "Peoples fetched successfully",
    }
  } catch (error) {
    console.error("Error fetching peoples:", error)

    return {
      data: [],
      message: "Failed to fetch peoples",
    }
  }
}

export async function addPeople(
  people: Omit<People, "id" | "createdAt" | "updatedAt">
) {
  try {
    const newPeople = await db.insert(peoples).values(people).returning()
    return { data: newPeople, message: "People added successfully" }
  } catch (error) {
    console.error("Error adding people:", error)
    return { message: "Failed to add people" }
  }
}

export async function updatePeople(
  id: string,
  people: Omit<People, "id" | "createdAt" | "updatedAt">
) {
  try {
    const updatedPeople = await db
      .update(peoples)
      .set(people)
      .where(eq(peoples.id, id))
      .returning()
    return { data: updatedPeople, message: "People updated successfully" }
  } catch (error) {
    console.error("Error updating people:", error)
    return { message: "Failed to update people" }
  }
}
