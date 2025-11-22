import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  balance: integer("balance").default(0),
  phone: text("phone"),
  fullName: text("full_name"),
  role: text("role").default("user"),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  icon: text("icon").default(""),
  image: text("image").default(""),
  category: text("category").notNull(),
  packages: text("packages").default("[]"),
  order: integer("order").default(0),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  productId: varchar("product_id").notNull(),
  productName: text("product_name").notNull(),
  price: integer("price").notNull(),
  selectedPackage: text("selected_package"),
  paymentMethod: text("payment_method").notNull(),
  paymentProofImage: text("payment_proof_image"),
  userPhone: text("user_phone").notNull(),
  userGameId: text("user_game_id").notNull(),
  status: text("status").default("pending"),
  createdAt: text("created_at").default(sql`NOW()`),
});

export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  info: text("info"),
  account: text("account"),
  accountName: text("account_name"),
  wallet: text("wallet"),
  walletName: text("wallet_name"),
});

export const contentPages = pgTable("content_pages", {
  id: varchar("id").primaryKey(),
  section: text("section").notNull(),
  data: text("data").notNull(),
});

export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default("admin"),
  email: text("email").notNull(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(paymentMethods);
export const insertContentSchema = createInsertSchema(contentPages);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type ContentPage = typeof contentPages.$inferSelect;
export type AdminSetting = typeof adminSettings.$inferSelect;
