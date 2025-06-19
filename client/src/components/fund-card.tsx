import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Fund } from "@shared/schema";

interface FundCardProps {
  fund: Fund;
  onSelect: (fund: Fund) => void;
  viewMode?: "grid" | "list";
}

export default function FundCard({ fund, onSelect, viewMode = "grid" }: FundCardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low": return "text-success-green";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-900";
    }
  };

  const getReturnColor = (returnStr: string) => {
    return returnStr.startsWith("+") ? "text-success-green" : "text-red-600";
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{fund.name}</h3>
              <p className="text-sm text-gray-600">{fund.manager}</p>
            </div>
            
            <div className="flex items-center gap-6 ml-6">
              <div className="text-center min-w-[80px]">
                <p className="text-xs text-gray-500 uppercase tracking-wide">NAV</p>
                <p className="text-sm font-bold text-gray-900">
                  {fund.currency === "USD" ? "$" : fund.currency === "EUR" ? "€" : "£"}{parseFloat(fund.nav).toFixed(2)}
                </p>
              </div>
              <div className="text-center min-w-[80px]">
                <p className="text-xs text-gray-500 uppercase tracking-wide">1Y Return</p>
                <p className={`text-sm font-bold ${getReturnColor(fund.yearReturn)}`}>
                  {fund.yearReturn}
                </p>
              </div>
              <div className="text-center min-w-[60px]">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Risk</p>
                <p className={`text-sm font-semibold ${getRiskColor(fund.riskLevel)}`}>
                  {fund.riskLevel}
                </p>
              </div>
              <div className="text-center min-w-[100px]">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Min Investment</p>
                <p className="text-sm font-semibold text-gray-900">
                  {fund.currency === "USD" ? "$" : fund.currency === "EUR" ? "€" : "£"}{fund.minInvestment.toLocaleString()}
                </p>
              </div>
              {fund.aum && (
                <div className="text-center min-w-[80px]">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">AUM</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {fund.aum}
                  </p>
                </div>
              )}
              <Button 
                onClick={() => onSelect(fund)}
                size="sm"
                className="ml-4 bg-finance-blue hover:bg-finance-light"
              >
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{fund.name}</h3>
            <p className="text-sm text-gray-600">Managed by {fund.manager}</p>
          </div>
          <div className="w-15 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
            <div className="text-white text-xs font-mono">CHART</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">NAV</span>
            <span className="font-semibold text-gray-900">
              {fund.currency === "USD" ? "$" : fund.currency === "EUR" ? "€" : "£"}{parseFloat(fund.nav).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">1Y Return</span>
            <span className={`font-semibold ${getReturnColor(fund.yearReturn)}`}>
              {fund.yearReturn}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Risk Level</span>
            <span className={`text-sm font-medium ${getRiskColor(fund.riskLevel)}`}>
              {fund.riskLevel}
            </span>
          </div>
          {fund.aum && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">AUM</span>
              <span className="text-sm font-medium text-gray-900">
                {fund.aum}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button 
            onClick={() => onSelect(fund)}
            className="w-full bg-finance-blue hover:bg-finance-light"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
