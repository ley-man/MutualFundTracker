import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";
import { analyzeFunds, type FundAnalysisRequest } from "./ai-agent";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all funds
  app.get("/api/funds", async (req, res) => {
    try {
      const funds = await storage.getAllFunds();
      res.json(funds);
    } catch (error) {
      console.error("Error fetching funds:", error);
      res.status(500).json({ message: "Failed to fetch funds" });
    }
  });

  // Get fund by ID
  app.get("/api/funds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const fund = await storage.getFund(id);
      
      if (!fund) {
        return res.status(404).json({ message: "Fund not found" });
      }
      
      res.json(fund);
    } catch (error) {
      console.error("Error fetching fund:", error);
      res.status(500).json({ message: "Failed to fetch fund" });
    }
  });

  // Create transaction (buy fund)
  app.post("/api/transactions", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertTransactionSchema.parse(req.body);
      
      // Check if fund exists
      const fund = await storage.getFund(validatedData.fundId);
      if (!fund) {
        return res.status(404).json({ message: "Fund not found" });
      }
      
      // Create transaction
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid transaction data", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Get all transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Get portfolio summary
  app.get("/api/portfolio/summary", async (req, res) => {
    try {
      const summary = await storage.getPortfolioSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching portfolio summary:", error);
      res.status(500).json({ message: "Failed to fetch portfolio summary" });
    }
  });

  // Get portfolio holdings
  app.get("/api/portfolio/holdings", async (req, res) => {
    try {
      const holdings = await storage.getFundsWithHoldings();
      res.json(holdings.filter(fund => fund.holding));
    } catch (error) {
      console.error("Error fetching portfolio holdings:", error);
      res.status(500).json({ message: "Failed to fetch portfolio holdings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
