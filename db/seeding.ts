import db from "./drizzle"
import { cities } from "./scheme"

async function seedDatabase() {
  const city: (typeof cities.$inferInsert)[] = [
    {
      name: "Jakarta",
    },
    {
      name: "Surabaya",
    },
    {
      name: "Bandung",
    },
    {
      name: "Medan",
    },
    {
      name: "Semarang",
    },
    {
      name: "Palembang",
    },
  ]

  await db.insert(cities).values(city)
}

seedDatabase().catch((error) => {
  console.error("Error seeding database:", error)
})
