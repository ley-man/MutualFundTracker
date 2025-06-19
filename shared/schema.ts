import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const funds = pgTable("funds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  manager: text("manager").notNull(),
  nav: decimal("nav", { precision: 10, scale: 2 }).notNull(),
  yearReturn: text("year_return").notNull(),
  riskLevel: text("risk_level").notNull(),
  minInvestment: integer("min_investment").notNull().default(1000),
  expenseRatio: decimal("expense_ratio", { precision: 4, scale: 2 }).notNull(),
  objective: text("objective"),
  region: text("region").notNull().default("US"),
  aum: text("aum"),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fundId: integer("fund_id").notNull().references(() => funds.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  shares: decimal("shares", { precision: 12, scale: 4 }).notNull(),
  navAtPurchase: decimal("nav_at_purchase", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioHoldings = pgTable("portfolio_holdings", {
  id: serial("id").primaryKey(),
  fundId: integer("fund_id").notNull().references(() => funds.id),
  totalShares: decimal("total_shares", { precision: 12, scale: 4 }).notNull(),
  totalInvested: decimal("total_invested", { precision: 12, scale: 2 }).notNull(),
  averageCost: decimal("average_cost", { precision: 10, scale: 2 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFundSchema = createInsertSchema(funds).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertPortfolioHoldingSchema = createInsertSchema(portfolioHoldings).omit({
  id: true,
  updatedAt: true,
});

export type Fund = typeof funds.$inferSelect;
export type InsertFund = z.infer<typeof insertFundSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type PortfolioHolding = typeof portfolioHoldings.$inferSelect;
export type InsertPortfolioHolding = z.infer<typeof insertPortfolioHoldingSchema>;

export type FundWithHolding = Fund & {
  holding?: PortfolioHolding;
  currentValue?: number;
  gainLoss?: number;
  gainLossPercent?: number;
};

export type PortfolioSummary = {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dailyChange: number;
  dailyChangePercent: number;
  holdingsCount: number;
};
