import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import PortfolioHoldings from "@/components/portfolio-holdings";
import type { PortfolioSummary, FundWithHolding, Transaction, Fund } from "@shared/schema";

export default function PortfolioPage() {
  const { data: summary, isLoading: summaryLoading } = useQuery<PortfolioSummary>({
    queryKey: ["/api/portfolio/summary"],
  });

  const { data: holdings = [], isLoading: holdingsLoading } = useQuery<FundWithHolding[]>({
    queryKey: ["/api/portfolio/holdings"],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: funds = [] } = useQuery<Fund[]>({
    queryKey: ["/api/funds"],
  });

  const getTransactionWithFund = (transaction: Transaction) => {
    const fund = funds.find(f => f.id === transaction.fundId);
    return { ...transaction, fund };
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Portfolio</h2>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4 flex items-center justify-center">
                  <div className="text-white text-xs font-bold">VALUE</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  {summaryLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(summary?.totalValue || 0)}
                      </p>
                      {summary && summary.totalGainLoss !== 0 && (
                        <p className={`text-sm ${summary.totalGainLoss >= 0 ? 'text-success-green' : 'text-red-600'}`}>
                          {formatCurrency(summary.totalGainLoss)} ({formatPercentage(summary.totalGainLossPercent)})
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-4 flex items-center justify-center">
                  <div className="text-white text-xs font-bold">TODAY</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today's Change</p>
                  {summaryLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <>
                      <p className={`text-2xl font-bold ${summary?.dailyChange && summary.dailyChange >= 0 ? 'text-success-green' : 'text-red-600'}`}>
                        {summary?.dailyChange ? formatCurrency(summary.dailyChange) : '$0.00'}
                      </p>
                      <p className={`text-sm ${summary?.dailyChange && summary.dailyChange >= 0 ? 'text-success-green' : 'text-red-600'}`}>
                        {summary?.dailyChangePercent ? formatPercentage(summary.dailyChangePercent) : '+0.0%'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mr-4 flex items-center justify-center">
                  <div className="text-white text-xs font-bold">FUNDS</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Holdings</p>
                  {summaryLoading ? (
                    <Skeleton className="h-6 w-12" />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900">
                        {summary?.holdingsCount || 0}
                      </p>
                      <p className="text-sm text-gray-600">Funds</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        {holdingsLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <PortfolioHoldings holdings={holdings} />
        )}

        {/* Recent Transactions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            {transactionsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Your transaction history will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {transactions.slice(0, 10).map((transaction) => {
                  const transactionWithFund = getTransactionWithFund(transaction);
                  return (
                    <div key={transaction.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transactionWithFund.fund?.name || 'Unknown Fund'} - Purchase
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${parseFloat(transaction.amount).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {parseFloat(transaction.shares).toFixed(4)} shares
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
