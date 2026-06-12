import z from "zod"

export const addJobScheme = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must be less than 255 characters")
      .trim(),
    duration: z.number().int().positive("Duration must be a positive integer"),
    location: z.enum(["REMOTE", "ONSITE"]),
    cityId: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.location === "ONSITE" && !data.cityId) {
      ctx.addIssue({
        path: ["cityId"],
        code: z.ZodIssueCode.custom,
        message: "City is required for onsite jobs",
      })
    }
  })

export type AddJobInput = z.infer<typeof addJobScheme>

export const updateJobScheme = z.object({
  reporterId: z.string().optional().nullable(),
  editorId: z.string().optional().nullable(),
  reporterRateType: z.enum(["MINUTE", "FLAT"]).optional().nullable(),
  reporterRate: z
    .number()
    .int()
    .positive("Reporter rate must be a positive integer")
    .optional()
    .nullable(),
  editorRateType: z.enum(["MINUTE", "FLAT"]).optional().nullable(),
  editorRate: z
    .number()
    .int()
    .positive("Editor rate must be a positive integer")
    .optional()
    .nullable(),
})

export type UpdateJobInput = z.infer<typeof updateJobScheme>

export const updateJobStatusScheme = z.object({
  status: z.enum(["NEW", "ASSIGNED", "TRANSCRIBED", "REVIEWED", "COMPLETED"]),
})

export type UpdateJobStatusInput = z.infer<typeof updateJobStatusScheme>
