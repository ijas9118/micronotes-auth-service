import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),
  email: text("email")
    .notNull()
    .unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token")
    .notNull(),
  used: boolean("used").default(false),
  expiresAt: timestamp("expires_at")
    .notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
}, table => ({
  uniqueTokenPerUser: unique().on(table.userId, table.token),
}));

export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type RefreshToken = InferSelectModel<typeof refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;
