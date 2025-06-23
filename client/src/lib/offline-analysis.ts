import type { Fund } from "@shared/schema";

export interface OfflineAnalysisResult {
  filteredFunds: Fund[];
  explanation: string;
  criteria: string[];
}

export class OfflineFundAnalyzer {
  private funds: Fund[];

  constructor(funds: Fund[]) {
    this.funds = funds;
  }

  analyze(query: string): OfflineAnalysisResult {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Risk-based filtering
    if (this.matchesRiskQuery(normalizedQuery)) {
      return this.filterByRisk(normalizedQuery);
    }
    
    // Return-based filtering
    if (this.matchesReturnQuery(normalizedQuery)) {
      return this.filterByReturn(normalizedQuery);
    }
    
    // Region-based filtering
    if (this.matchesRegionQuery(normalizedQuery)) {
      return this.filterByRegion(normalizedQuery);
    }
    
    // Fee/expense ratio filtering
    if (this.matchesFeeQuery(normalizedQuery)) {
      return this.filterByFees(normalizedQuery);
    }
    
    // Tech/sector filtering
    if (this.matchesTechQuery(normalizedQuery)) {
      return this.filterByTech(normalizedQuery);
    }
    
    // Bond/fixed income filtering
    if (this.matchesBondQuery(normalizedQuery)) {
      return this.filterByBonds(normalizedQuery);
    }
    
    // Minimum investment filtering
    if (this.matchesMinInvestmentQuery(normalizedQuery)) {
      return this.filterByMinInvestment(normalizedQuery);
    }
    
    // ESG/sustainable filtering
    if (this.matchesESGQuery(normalizedQuery)) {
      return this.filterByESG(normalizedQuery);
    }
    
    // Default keyword search
    return this.keywordSearch(normalizedQuery);
  }

  private matchesRiskQuery(query: string): boolean {
    const riskKeywords = ['risk', 'safe', 'conservative', 'stable', 'volatile', 'aggressive'];
    return riskKeywords.some(keyword => query.includes(keyword));
  }

  private filterByRisk(query: string): OfflineAnalysisResult {
    let targetRisk: string;
    let explanation: string;
    
    if (query.includes('low') || query.includes('safe') || query.includes('conservative') || query.includes('stable')) {
      targetRisk = 'Low';
      explanation = 'Selected low-risk funds for conservative investors seeking stability and capital preservation.';
    } else if (query.includes('high') || query.includes('aggressive') || query.includes('volatile')) {
      targetRisk = 'High';
      explanation = 'Selected high-risk funds for aggressive investors seeking maximum growth potential.';
    } else {
      targetRisk = 'Medium';
      explanation = 'Selected medium-risk funds offering balanced growth and stability.';
    }

    const filtered = this.funds.filter(fund => fund.riskLevel === targetRisk);
    return {
      filteredFunds: filtered,
      explanation,
      criteria: [`Risk Level: ${targetRisk}`]
    };
  }

  private matchesReturnQuery(query: string): boolean {
    const returnKeywords = ['return', 'performance', 'gain', 'growth', 'profit'];
    return returnKeywords.some(keyword => query.includes(keyword));
  }

  private filterByReturn(query: string): OfflineAnalysisResult {
    const isHighReturn = query.includes('high') || query.includes('best') || query.includes('top');
    
    // Parse return percentages and sort
    const fundsWithParsedReturns = this.funds.map(fund => ({
      ...fund,
      returnValue: parseFloat(fund.yearReturn.replace(/[^0-9.-]/g, ''))
    })).sort((a, b) => b.returnValue - a.returnValue);

    let filtered: Fund[];
    let explanation: string;
    
    if (isHighReturn) {
      // Top 30% by return
      const topCount = Math.max(1, Math.ceil(fundsWithParsedReturns.length * 0.3));
      filtered = fundsWithParsedReturns.slice(0, topCount);
      explanation = 'Selected top-performing funds with the highest 1-year returns for growth-focused investors.';
    } else {
      // All funds with positive returns
      filtered = fundsWithParsedReturns.filter(fund => fund.returnValue > 0);
      explanation = 'Selected funds with positive 1-year returns.';
    }

    return {
      filteredFunds: filtered,
      explanation,
      criteria: ['High Returns', '1-Year Performance']
    };
  }

  private matchesRegionQuery(query: string): boolean {
    const regionKeywords = ['us', 'usa', 'american', 'offshore', 'international', 'european', 'global'];
    return regionKeywords.some(keyword => query.includes(keyword));
  }

  private filterByRegion(query: string): OfflineAnalysisResult {
    let targetRegion: string;
    let explanation: string;
    
    if (query.includes('us') || query.includes('usa') || query.includes('american')) {
      targetRegion = 'US';
      explanation = 'Selected US-based funds investing in American markets and companies.';
    } else {
      targetRegion = 'Offshore';
      explanation = 'Selected offshore/international funds for global diversification.';
    }

    const filtered = this.funds.filter(fund => fund.region === targetRegion);
    return {
      filteredFunds: filtered,
      explanation,
      criteria: [`Region: ${targetRegion}`]
    };
  }

  private matchesFeeQuery(query: string): boolean {
    const feeKeywords = ['fee', 'fees', 'cost', 'expense', 'cheap', 'low cost'];
    return feeKeywords.some(keyword => query.includes(keyword));
  }

  private filterByFees(query: string): OfflineAnalysisResult {
    // Sort by expense ratio (lowest first)
    const fundsWithParsedFees = this.funds.map(fund => ({
      ...fund,
      feeValue: parseFloat(fund.expenseRatio)
    })).sort((a, b) => a.feeValue - b.feeValue);

    // Bottom 50% by fees (lowest cost)
    const lowCostCount = Math.ceil(fundsWithParsedFees.length * 0.5);
    const filtered = fundsWithParsedFees.slice(0, lowCostCount);

    return {
      filteredFunds: filtered,
      explanation: 'Selected funds with the lowest expense ratios to minimize investment costs.',
      criteria: ['Low Fees', 'Expense Ratio']
    };
  }

  private matchesTechQuery(query: string): boolean {
    const techKeywords = ['tech', 'technology', 'innovation', 'growth', 'emerging'];
    return techKeywords.some(keyword => query.includes(keyword));
  }

  private filterByTech(query: string): OfflineAnalysisResult {
    const techKeywords = ['tech', 'technology', 'innovation', 'growth', 'emerging', 'digital', 'software'];
    
    const filtered = this.funds.filter(fund => {
      const searchText = (fund.name + ' ' + fund.objective).toLowerCase();
      return techKeywords.some(keyword => searchText.includes(keyword));
    });

    return {
      filteredFunds: filtered,
      explanation: 'Selected technology and growth-focused funds investing in innovative companies.',
      criteria: ['Technology Sector', 'Growth Focus']
    };
  }

  private matchesBondQuery(query: string): boolean {
    const bondKeywords = ['bond', 'bonds', 'fixed income', 'treasury', 'municipal'];
    return bondKeywords.some(keyword => query.includes(keyword));
  }

  private filterByBonds(query: string): OfflineAnalysisResult {
    const bondKeywords = ['bond', 'treasury', 'municipal', 'fixed', 'income'];
    
    const filtered = this.funds.filter(fund => {
      const searchText = (fund.name + ' ' + fund.objective).toLowerCase();
      return bondKeywords.some(keyword => searchText.includes(keyword));
    });

    return {
      filteredFunds: filtered,
      explanation: 'Selected bond and fixed-income funds for stable income generation.',
      criteria: ['Fixed Income', 'Bonds']
    };
  }

  private matchesMinInvestmentQuery(query: string): boolean {
    const minInvestKeywords = ['minimum', 'min investment', 'low minimum', 'affordable'];
    return minInvestKeywords.some(keyword => query.includes(keyword)) || /\$?\d+/.test(query);
  }

  private filterByMinInvestment(query: string): OfflineAnalysisResult {
    // Extract number from query if present
    const numberMatch = query.match(/\$?(\d+)/);
    const targetAmount = numberMatch ? parseInt(numberMatch[1]) : 5000;

    const filtered = this.funds.filter(fund => fund.minInvestment <= targetAmount);

    return {
      filteredFunds: filtered,
      explanation: `Selected funds with minimum investment of $${targetAmount.toLocaleString()} or less.`,
      criteria: [`Min Investment ≤ $${targetAmount.toLocaleString()}`]
    };
  }

  private matchesESGQuery(query: string): boolean {
    const esgKeywords = ['esg', 'sustainable', 'environmental', 'social', 'governance', 'ethical'];
    return esgKeywords.some(keyword => query.includes(keyword));
  }

  private filterByESG(query: string): OfflineAnalysisResult {
    const esgKeywords = ['esg', 'sustainable', 'environmental', 'social', 'governance', 'ethical'];
    
    const filtered = this.funds.filter(fund => {
      const searchText = (fund.name + ' ' + fund.objective).toLowerCase();
      return esgKeywords.some(keyword => searchText.includes(keyword));
    });

    return {
      filteredFunds: filtered,
      explanation: 'Selected ESG and sustainable funds focusing on environmental, social, and governance criteria.',
      criteria: ['ESG', 'Sustainable Investing']
    };
  }

  private keywordSearch(query: string): OfflineAnalysisResult {
    const keywords = query.split(' ').filter(word => word.length > 2);
    
    const filtered = this.funds.filter(fund => {
      const searchText = (fund.name + ' ' + fund.manager + ' ' + fund.objective).toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword));
    });

    return {
      filteredFunds: filtered.length > 0 ? filtered : this.funds.slice(0, 6), // Show some results if no matches
      explanation: filtered.length > 0 
        ? `Found funds matching your search criteria.`
        : `No exact matches found. Showing popular funds instead.`,
      criteria: filtered.length > 0 ? ['Keyword Match'] : ['Popular Funds']
    };
  }
}