import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChartLine, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { PortfolioSummary } from "@shared/schema";

export default function Header() {
  const [location] = useLocation();
  
  const { data: portfolioSummary } = useQuery<PortfolioSummary>({
    queryKey: ["/api/portfolio/summary"],
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <ChartLine className="text-finance-blue text-2xl mr-3" />
            <h1 className="text-xl font-bold text-gray-900">EuroFunds Platform</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/trade">
              <a className={`font-medium pb-4 transition-colors ${
                location === "/trade" || location === "/"
                  ? "text-finance-blue border-b-2 border-finance-blue" 
                  : "text-gray-600 hover:text-finance-blue"
              }`}>
                Trade
              </a>
            </Link>
            <Link href="/portfolio">
              <a className={`font-medium pb-4 transition-colors ${
                location === "/portfolio" 
                  ? "text-finance-blue border-b-2 border-finance-blue" 
                  : "text-gray-600 hover:text-finance-blue"
              }`}>
                Portfolio
              </a>
            </Link>
            <a href="#" className="text-gray-600 hover:text-finance-blue transition-colors pb-4">
              Research
            </a>
            <a href="#" className="text-gray-600 hover:text-finance-blue transition-colors pb-4">
              Account
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Portfolio</p>
              <p className="font-semibold text-gray-900">
                {portfolioSummary ? formatCurrency(portfolioSummary.totalValue) : "€0.00"}
              </p>
            </div>
            <div className="w-8 h-8 bg-finance-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
