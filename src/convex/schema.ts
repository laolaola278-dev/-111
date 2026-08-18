import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  generations: defineTable({
    userId: v.id("users"),
    craft: v.string(),
    prompt: v.string(),
    svg: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
