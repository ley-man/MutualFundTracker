import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import type { FundWithHolding } from "@shared/schema";

interface PortfolioHoldingsProps {
  holdings: FundWithHolding[];
}

export default function PortfolioHoldings({ holdings }: PortfolioHoldingsProps) {
  if (holdings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No holdings found</p>
            <p className="text-sm text-gray-400 mt-2">
              Start investing in funds to see your portfolio here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Holdings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead>Avg Cost</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Gain/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((fund) => (
                <TableRow key={fund.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{fund.name}</div>
                      <div className="text-sm text-gray-500">{fund.manager}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {parseFloat(fund.holding!.totalShares).toFixed(4)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(parseFloat(fund.holding!.averageCost))}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(fund.currentValue!)}
                  </TableCell>
                  <TableCell>
                    <span className={fund.gainLoss! >= 0 ? "text-success-green" : "text-red-600"}>
                      {formatCurrency(fund.gainLoss!)} ({formatPercentage(fund.gainLossPercent!)})
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
