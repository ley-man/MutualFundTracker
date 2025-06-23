import OpenAI from "openai";
import type { Fund } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface FundAnalysisRequest {
  query: string;
  funds: Fund[];
}

export interface FundAnalysisResponse {
  filteredFunds: Fund[];
  explanation: string;
  criteria: string[];
}

export async function analyzeFunds(request: FundAnalysisRequest): Promise<FundAnalysisResponse> {
  const { query, funds } = request;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a fund analysis AI agent. Analyze the user's query and return relevant funds based on their criteria.
          
          Available fund data fields:
          - name: Fund name
          - manager: Fund manager
          - region: "US" or "Offshore"
          - yearReturn: 1-year return percentage (e.g., "+15.2%")
          - riskLevel: "Low", "Medium", or "High"
          - expenseRatio: Expense ratio percentage
          - aum: Assets under management
          - minInvestment: Minimum investment amount
          - currency: "USD", "EUR", or "GBP"
          - objective: Fund investment objective description

          Return a JSON response with:
          1. fundIds: Array of fund IDs that match the criteria
          2. explanation: Brief explanation of why these funds were selected
          3. criteria: Array of criteria used for filtering
          
          Example queries and how to handle them:
          - "low risk funds" -> filter by riskLevel: "Low"
          - "high return funds" -> sort by yearReturn and take top performers
          - "US tech funds" -> filter by region: "US" and name/objective containing tech-related terms
          - "funds under 1000 minimum" -> filter by minInvestment <= 1000
          - "European funds with low fees" -> filter by region: "Offshore" and low expenseRatio
          
          Be flexible with natural language queries and extract intent accurately.`
        },
        {
          role: "user",
          content: `Query: "${query}"
          
          Available funds: ${JSON.stringify(funds, null, 2)}
          
          Analyze this query and return matching funds.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Filter funds based on AI response
    const filteredFunds = funds.filter(fund => 
      result.fundIds && result.fundIds.includes(fund.id)
    );

    return {
      filteredFunds,
      explanation: result.explanation || "Funds selected based on your criteria.",
      criteria: result.criteria || []
    };

  } catch (error) {
    console.error("AI fund analysis error:", error);
    
    // Fallback: simple keyword matching
    const lowerQuery = query.toLowerCase();
    const filteredFunds = funds.filter(fund => {
      return (
        fund.name.toLowerCase().includes(lowerQuery) ||
        fund.manager.toLowerCase().includes(lowerQuery) ||
        fund.objective?.toLowerCase().includes(lowerQuery) ||
        fund.riskLevel.toLowerCase().includes(lowerQuery) ||
        fund.region.toLowerCase().includes(lowerQuery)
      );
    });

    return {
      filteredFunds,
      explanation: "Using basic keyword matching due to AI service unavailability.",
      criteria: ["keyword matching"]
    };
  }
}