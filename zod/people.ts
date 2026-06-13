import z from "zod"

const peopleSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .trim(),
  cityId: z.string().min(1, "City is required"),
  rateType: z.enum(["MINUTE", "FLAT"]),
  rate: z.number().int().positive("Rate must be a positive integer"),
  type: z.enum(["REPORTER", "EDITOR"]),
  available: z.boolean(),
})

const filterPeopleSchema = z.object({
  name: z
    .string()
    .max(255, "Name must be less than 255 characters")
    .trim()
    .optional(),
  city: z
    .string()
    .max(255, "City must be less than 255 characters")
    .trim()
    .optional(),
  type: z.string().optional(),
})

export type PeopleInput = z.infer<typeof peopleSchema>
export type FilterPeopleInput = z.infer<typeof filterPeopleSchema>

export default peopleSchema
export { filterPeopleSchema }
