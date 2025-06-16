import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import InvestmentForm from "./investment-form";
import type { Fund } from "@shared/schema";

interface FundDetailProps {
  fund: Fund;
  onBack: () => void;
}

export default function FundDetail({ fund, onBack }: FundDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-finance-blue hover:text-finance-light"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Funds
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Fund Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{fund.name}</h2>
                  <p className="text-gray-600">Managed by {fund.manager}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current NAV</p>
                  <p className="text-2xl font-bold text-finance-blue">
                    {formatCurrency(parseFloat(fund.nav))}
                  </p>
                </div>
              </div>
              
              {/* Performance Chart Placeholder */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-lg font-semibold mb-2">Performance Chart</div>
                    <div className="text-sm">Historical NAV data visualization</div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">1Y Return</p>
                  <p className={`text-lg font-bold ${
                    fund.yearReturn.startsWith("+") ? "text-success-green" : "text-red-600"
                  }`}>
                    {fund.yearReturn}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <p className="text-lg font-bold text-gray-900">{fund.riskLevel}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Min Investment</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${fund.minInvestment.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Expense Ratio</p>
                  <p className="text-lg font-bold text-gray-900">{fund.expenseRatio}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fund Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Investment Objective</h4>
                  <p className="text-gray-600">{fund.objective}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Top Holdings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>ASML Holding NV</span>
                      <span>4.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nestlé SA</span>
                      <span>3.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SAP SE</span>
                      <span>3.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Panel */}
        <div className="space-y-6">
          <div className="sticky top-4">
            <InvestmentForm fund={fund} />
          </div>
        </div>
      </div>
    </div>
  );
}
