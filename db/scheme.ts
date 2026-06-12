import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core"

export const rateTypeEnum = pgEnum("rate_type", ["MINUTE", "FLAT"])
export const statusEnum = pgEnum("status", [
  "NEW",
  "ASSIGNED",
  "TRANSCRIBED",
  "REVIEWED",
  "COMPLETED",
])
export const locationEnum = pgEnum("location", ["REMOTE", "ONSITE"])
export const peopleTypeEnum = pgEnum("people_type", ["REPORTER", "EDITOR"])

export const cities = pgTable("cities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
export type City = typeof cities.$inferSelect

export const peoples = pgTable("peoples", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  cityId: uuid("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "restrict", onUpdate: "cascade" }),
  rateType: rateTypeEnum("rate_type").notNull(),
  rate: integer("rate").notNull(),
  type: peopleTypeEnum("people_type").notNull(),
  available: boolean("available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type People = typeof peoples.$inferSelect

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  duration: integer("duration").notNull(),
  location: locationEnum("location").notNull(),
  cityId: uuid("city_id").references(() => cities.id, {
    onDelete: "restrict",
    onUpdate: "cascade",
  }),
  editorId: uuid("editor_id").references(() => peoples.id, {
    onDelete: "restrict",
    onUpdate: "cascade",
  }),
  reporterId: uuid("reporter_id").references(() => peoples.id, {
    onDelete: "restrict",
    onUpdate: "cascade",
  }),
  reporterRate: integer("reporter_rate"),
  editorRate: integer("editor_rate"),
  reporterRateType: rateTypeEnum("reporter_rate_type"),
  editorRateType: rateTypeEnum("editor_rate_type"),
  status: statusEnum("status").notNull().default("NEW"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type Job = typeof jobs.$inferSelect

export const jobLog = pgTable("job_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  previousStatus: statusEnum("previous_status"),
  newStatus: statusEnum("new_status").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
})

export type JobLog = typeof jobLog.$inferSelect
