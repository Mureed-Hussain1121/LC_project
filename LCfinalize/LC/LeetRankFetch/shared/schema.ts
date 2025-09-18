import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  rollNo: text("roll_no").notNull(),
  batch: text("batch").notNull(),
  program: text("program").notNull(),
  skills: jsonb("skills").$type<string[]>().default([]),
  avatarUrl: text("avatar_url"),
  leetcodeUrl: text("leetcode_url").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const leetcodeStats = pgTable("leetcode_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  totalSolved: integer("total_solved").default(0),
  easySolved: integer("easy_solved").default(0),
  mediumSolved: integer("medium_solved").default(0),
  hardSolved: integer("hard_solved").default(0),
  globalRanking: integer("global_ranking"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  lastUpdated: true,
});

export const insertLeetcodeStatsSchema = createInsertSchema(leetcodeStats).omit({
  id: true,
  lastUpdated: true,
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export type InsertLeetcodeStats = z.infer<typeof insertLeetcodeStatsSchema>;
export type LeetcodeStats = typeof leetcodeStats.$inferSelect;

export type StudentWithStats = Student & {
  stats?: LeetcodeStats;
};
