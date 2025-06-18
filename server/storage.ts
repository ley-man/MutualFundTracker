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
    const usaFunds: InsertFund[] = [
      {
        name: "US Large Cap Growth Fund",
        manager: "Vanguard Group",
        nav: "287.45",
        yearReturn: "+15.2%",
        riskLevel: "Medium",
        minInvestment: 1000,
        expenseRatio: "0.04",
        objective: "Invests in large-cap US growth stocks with strong earnings potential and innovative business models across technology, healthcare, and consumer sectors."
      },
      {
        name: "S&P 500 Index Fund",
        manager: "Fidelity Investments",
        nav: "432.18",
        yearReturn: "+13.8%",
        riskLevel: "Medium",
        minInvestment: 1000,
        expenseRatio: "0.03",
        objective: "Tracks the S&P 500 index, providing broad exposure to 500 of the largest US companies across all sectors for diversified growth."
      },
      {
        name: "US Small Cap Value Fund",
        manager: "Charles Schwab",
        nav: "89.73",
        yearReturn: "+9.4%",
        riskLevel: "High",
        minInvestment: 1000,
        expenseRatio: "0.25",
        objective: "Focuses on undervalued small-cap US companies with strong fundamentals and potential for significant price appreciation."
      },
      {
        name: "Technology Sector Fund",
        manager: "T. Rowe Price",
        nav: "198.64",
        yearReturn: "+22.7%",
        riskLevel: "High",
        minInvestment: 1000,
        expenseRatio: "0.75",
        objective: "Concentrates on US technology companies including software, semiconductors, and digital services with high growth potential."
      },
      {
        name: "US Treasury Bond Fund",
        manager: "BlackRock",
        nav: "104.32",
        yearReturn: "+3.1%",
        riskLevel: "Low",
        minInvestment: 1000,
        expenseRatio: "0.15",
        objective: "Invests in US Treasury securities to provide stable income and capital preservation with minimal credit risk."
      },
      {
        name: "Dividend Aristocrats Fund",
        manager: "State Street Global",
        nav: "156.89",
        yearReturn: "+8.9%",
        riskLevel: "Low",
        minInvestment: 1000,
        expenseRatio: "0.35",
        objective: "Invests in S&P 500 companies that have increased dividends for 25+ consecutive years, providing steady income and growth."
      },
      {
        name: "Healthcare Innovation Fund",
        manager: "JPMorgan Asset Management",
        nav: "243.51",
        yearReturn: "+17.3%",
        riskLevel: "Medium",
        minInvestment: 1000,
        expenseRatio: "0.85",
        objective: "Focuses on US healthcare companies driving innovation in biotechnology, pharmaceuticals, and medical devices."
      },
      {
        name: "ESG Leaders Fund",
        manager: "Goldman Sachs Asset Management",
        nav: "135.27",
        yearReturn: "+11.6%",
        riskLevel: "Medium",
        minInvestment: 1000,
        expenseRatio: "0.50",
        objective: "Invests in US companies with superior environmental, social, and governance practices while seeking competitive returns."
      },
      {
        name: "Real Estate Investment Fund",
        manager: "Invesco",
        nav: "78.95",
        yearReturn: "+6.8%",
        riskLevel: "Medium",
        minInvestment: 1000,
        expenseRatio: "0.60",
        objective: "Provides exposure to US real estate investment trusts (REITs) for diversification and income generation."
      },
      {
        name: "Emerging Growth Fund",
        manager: "American Century",
        nav: "167.43",
        yearReturn: "+19.5%",
        riskLevel: "High",
        minInvestment: 1000,
        expenseRatio: "0.95",
        objective: "Invests in rapidly growing US companies with innovative products and expanding market opportunities."
      },
      {
        name: "Mid Cap Blend Fund",
        manager: "Franklin Templeton",
        nav: "112.78",
        yearReturn: "+12.1%",
        riskLevel: "Medium",
        minInvestment: 1000,
        expenseRatio: "0.65",
        objective: "Balances growth and value strategies in mid-cap US companies offering potential for capital appreciation."
      },
      {
        name: "Municipal Bond Fund",
        manager: "Nuveen",
        nav: "96.84",
        yearReturn: "+2.8%",
        riskLevel: "Low",
        minInvestment: 1000,
        expenseRatio: "0.45",
        objective: "Invests in tax-free municipal bonds issued by US states and localities, providing tax-advantaged income."
      }
    ];

    usaFunds.forEach(fund => {
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
