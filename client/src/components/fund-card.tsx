import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Fund } from "@shared/schema";

interface FundCardProps {
  fund: Fund;
  onSelect: (fund: Fund) => void;
}

export default function FundCard({ fund, onSelect }: FundCardProps) {
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
              {formatCurrency(parseFloat(fund.nav))}
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
