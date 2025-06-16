import { 
  funds, 
  transactions, 
  portfolioHoldings,
  type Fund, 
  type InsertFund,
  type Transaction,
  type InsertTransaction,
  type PortfolioHolding,
  type InsertPortfolioHolding,
  type FundWithHolding,
  type PortfolioSummary
} from "@shared/schema";

export interface IStorage {
  // Fund operations
  getAllFunds(): Promise<Fund[]>;
  getFund(id: number): Promise<Fund | undefined>;
  createFund(fund: InsertFund): Promise<Fund>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByFund(fundId: number): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
  
  // Portfolio operations
  getPortfolioHolding(fundId: number): Promise<PortfolioHolding | undefined>;
  updatePortfolioHolding(holding: InsertPortfolioHolding): Promise<PortfolioHolding>;
  getAllHoldings(): Promise<PortfolioHolding[]>;
  getPortfolioSummary(): Promise<PortfolioSummary>;
  getFundsWithHoldings(): Promise<FundWithHolding[]>;
}

export class MemStorage implements IStorage {
  private funds: Map<number, Fund>;
  private transactions: Map<number, Transaction>;
  private holdings: Map<number, PortfolioHolding>;
  private currentFundId: number;
  private currentTransactionId: number;
  private currentHoldingId: number;

  constructor() {
    this.funds = new Map();
    this.transactions = new Map();
    this.holdings = new Map();
    this.currentFundId = 1;
    this.currentTransactionId = 1;
    this.currentHoldingId = 1;
    
    // Initialize with European mutual funds data
    this.initializeFunds();
  }

  private initializeFunds() {
    const europeanFunds: InsertFund[] = [
      {
        name: "European Growth Fund",
        manager: "Deutsche Asset Management",
        nav: "125.47",
        yearReturn: "+12.3%",
        riskLevel: "Medium",
        minInvestment: 1000,
        expenseRatio: "0.75",
        objective: "The fund seeks to achieve long-term capital growth by investing primarily in European equity securities. The fund focuses on companies with strong growth potential across various sectors within the European market."
      },
      {
        name: "European Value Fund",
        manager: "Allianz Global Investors",
        nav: "89.23",
        yearReturn: "+8.7%",
        riskLevel: "Low",
        minInvestment: 1000,
        expenseRatio: "0.65",
        objective: "Seeks to provide long-term capital appreciation by investing in undervalued European companies with strong fundamentals and potential for price appreciation."
      },
      {
        name: "European Bond Fund",
        manager: "BNP Paribas Asset Management",
        nav: "102.18",
        yearReturn: "+4.2%",
        riskLevel: "Low",
        minInvestment: 1000,
        expenseRatio: "0.45",
        objective: "Aims to provide regular income and capital preservation by investing in high-quality European government and corporate bonds."
      },
      {
        name: "European Tech Fund",
        manager: "Amundi Asset Management",
        nav: "178.92",
        yearReturn: "+18.5%",
        riskLevel: "High",
        minInvestment: 1000,
        expenseRatio: "0.95",
        objective: "Focuses on European technology companies with innovative products and services, seeking high growth potential in the digital economy."
      },
      {
        name: "European ESG Fund",
        manager: "Nordea Asset Management",
        nav: "94.75",
        yearReturn: "+9.8%",
        riskLevel: "Medium",
        minInvestment: 1000,
        expenseRatio: "0.80",
        objective: "Invests in European companies that meet strict environmental, social, and governance criteria while seeking competitive returns."
      },
      {
        name: "European Dividend Fund",
        manager: "Schroders Investment",
        nav: "67.34",
        yearReturn: "+6.4%",
        riskLevel: "Low",
        minInvestment: 1000,
        expenseRatio: "0.70",
        objective: "Provides regular dividend income by investing in European companies with strong dividend-paying histories and sustainable business models."
      }
    ];

    europeanFunds.forEach(fund => {
      this.createFund(fund);
    });
  }

  async getAllFunds(): Promise<Fund[]> {
    return Array.from(this.funds.values());
  }

  async getFund(id: number): Promise<Fund | undefined> {
    return this.funds.get(id);
  }

  async createFund(insertFund: InsertFund): Promise<Fund> {
    const id = this.currentFundId++;
    const fund: Fund = {
      ...insertFund,
      id,
      createdAt: new Date(),
    };
    this.funds.set(id, fund);
    return fund;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      status: "completed",
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    
    // Update portfolio holding
    await this.updatePortfolioAfterTransaction(transaction);
    
    return transaction;
  }

  private async updatePortfolioAfterTransaction(transaction: Transaction) {
    const existingHolding = await this.getPortfolioHolding(transaction.fundId);
    
    if (existingHolding) {
      // Update existing holding
      const newTotalShares = parseFloat(existingHolding.totalShares) + parseFloat(transaction.shares);
      const newTotalInvested = parseFloat(existingHolding.totalInvested) + parseFloat(transaction.amount);
      const newAverageCost = newTotalInvested / newTotalShares;
      
      const updatedHolding: InsertPortfolioHolding = {
        fundId: transaction.fundId,
        totalShares: newTotalShares.toString(),
        totalInvested: newTotalInvested.toString(),
        averageCost: newAverageCost.toString(),
      };
      
      await this.updatePortfolioHolding(updatedHolding);
    } else {
      // Create new holding
      const averageCost = parseFloat(transaction.amount) / parseFloat(transaction.shares);
      const newHolding: InsertPortfolioHolding = {
        fundId: transaction.fundId,
        totalShares: transaction.shares,
        totalInvested: transaction.amount,
        averageCost: averageCost.toString(),
      };
      
      await this.updatePortfolioHolding(newHolding);
    }
  }

  async getTransactionsByFund(fundId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => t.fundId === fundId);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPortfolioHolding(fundId: number): Promise<PortfolioHolding | undefined> {
    return Array.from(this.holdings.values()).find(h => h.fundId === fundId);
  }

  async updatePortfolioHolding(insertHolding: InsertPortfolioHolding): Promise<PortfolioHolding> {
    const existingHolding = await this.getPortfolioHolding(insertHolding.fundId);
    
    if (existingHolding) {
      const updatedHolding: PortfolioHolding = {
        ...existingHolding,
        ...insertHolding,
        updatedAt: new Date(),
      };
      this.holdings.set(existingHolding.id, updatedHolding);
      return updatedHolding;
    } else {
      const id = this.currentHoldingId++;
      const holding: PortfolioHolding = {
        ...insertHolding,
        id,
        updatedAt: new Date(),
      };
      this.holdings.set(id, holding);
      return holding;
    }
  }

  async getAllHoldings(): Promise<PortfolioHolding[]> {
    return Array.from(this.holdings.values());
  }

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    const holdings = await this.getAllHoldings();
    const funds = await this.getAllFunds();
    
    let totalValue = 0;
    let totalInvested = 0;
    
    for (const holding of holdings) {
      const fund = funds.find(f => f.id === holding.fundId);
      if (fund) {
        const currentValue = parseFloat(holding.totalShares) * parseFloat(fund.nav);
        totalValue += currentValue;
        totalInvested += parseFloat(holding.totalInvested);
      }
    }
    
    const totalGainLoss = totalValue - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
    
    // Mock daily change (in a real app, this would be calculated from price history)
    const dailyChange = totalValue * 0.0076; // Mock 0.76% daily change
    const dailyChangePercent = 0.76;
    
    return {
      totalValue,
      totalInvested,
      totalGainLoss,
      totalGainLossPercent,
      dailyChange,
      dailyChangePercent,
      holdingsCount: holdings.length,
    };
  }

  async getFundsWithHoldings(): Promise<FundWithHolding[]> {
    const funds = await this.getAllFunds();
    const holdings = await this.getAllHoldings();
    
    return funds.map(fund => {
      const holding = holdings.find(h => h.fundId === fund.id);
      
      if (holding) {
        const currentValue = parseFloat(holding.totalShares) * parseFloat(fund.nav);
        const gainLoss = currentValue - parseFloat(holding.totalInvested);
        const gainLossPercent = (gainLoss / parseFloat(holding.totalInvested)) * 100;
        
        return {
          ...fund,
          holding,
          currentValue,
          gainLoss,
          gainLossPercent,
        };
      }
      
      return fund;
    });
  }
}

export const storage = new MemStorage();
