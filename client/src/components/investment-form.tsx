import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { calculateShares, convertUsdToEur, formatCurrency } from "@/lib/utils";
import TransactionModal from "./transaction-modal";
import type { Fund, InsertTransaction } from "@shared/schema";

const investmentSchema = z.object({
  amount: z.coerce.number().min(1000, "Minimum investment is $1,000"),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface InvestmentFormProps {
  fund: Fund;
}

export default function InvestmentForm({ fund }: InvestmentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<{
    fund: Fund;
    amount: number;
    shares: number;
  } | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      amount: 0,
    },
  });
  
  const watchAmount = form.watch("amount");
  const eurAmount = watchAmount ? convertUsdToEur(watchAmount) : 0;
  const estimatedShares = eurAmount ? calculateShares(eurAmount, parseFloat(fund.nav)) : 0;

  const createTransaction = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      const response = await apiRequest("POST", "/api/transactions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/holdings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });

  const onSubmit = async (data: InvestmentFormData) => {
    try {
      setIsProcessing(true);
      setTransactionData({
        fund,
        amount: data.amount,
        shares: estimatedShares,
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      const eurAmount = convertUsdToEur(data.amount);
      const shares = calculateShares(eurAmount, parseFloat(fund.nav));
      
      const transactionData: InsertTransaction = {
        fundId: fund.id,
        amount: data.amount.toString(),
        shares: shares.toString(),
        navAtPurchase: fund.nav,
      };

      await createTransaction.mutateAsync(transactionData);
      
      setIsProcessing(false);
      setShowSuccess(true);
      form.reset();
      
      toast({
        title: "Transaction Successful",
        description: `Successfully purchased ${shares.toFixed(2)} shares of ${fund.name}`,
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Transaction Failed",
        description: "There was an error processing your transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invest in this Fund</h3>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Investment Amount (USD)
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="1000"
                  step="100"
                  placeholder="10,000"
                  className="pl-8"
                  {...form.register("amount")}
                />
              </div>
              {form.formState.errors.amount && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.amount.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Minimum investment: $1,000
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Estimated Shares
              </Label>
              <Input
                type="text"
                value={estimatedShares.toFixed(4)}
                readOnly
                className="mt-2 bg-gray-50"
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button 
                type="submit" 
                disabled={createTransaction.isPending || !watchAmount || watchAmount < 1000}
                className="w-full bg-finance-blue hover:bg-finance-light text-white py-3 text-lg"
              >
                {createTransaction.isPending ? "Processing..." : "Buy Fund"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <TransactionModal
        isProcessing={isProcessing}
        showSuccess={showSuccess}
        transactionData={transactionData}
        onCloseSuccess={() => {
          setShowSuccess(false);
          setTransactionData(null);
        }}
      />
    </>
  );
}
