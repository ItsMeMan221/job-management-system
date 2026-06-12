import db from "@/db/drizzle"
import { cities } from "@/db/scheme"

export async function getCities() {
  try {
    const data = await db
      .select({
        value: cities.id,
        label: cities.name,
      })
      .from(cities)
    return { data, message: "Cities fetched successfully" }
  } catch (error) {
    console.error("Error fetching cities:", error)
    return { message: "Failed to fetch cities" }
  }
}
