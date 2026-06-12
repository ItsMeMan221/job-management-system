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

export type PeopleInput = z.infer<typeof peopleSchema>

export default peopleSchema
