import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
import type { Fund } from "@shared/schema";

interface TransactionModalProps {
  isProcessing: boolean;
  showSuccess: boolean;
  transactionData: {
    fund: Fund;
    amount: number;
    shares: number;
  } | null;
  onCloseSuccess: () => void;
}

export default function TransactionModal({
  isProcessing,
  showSuccess,
  transactionData,
  onCloseSuccess,
}: TransactionModalProps) {
  return (
    <>
      {/* Processing Modal */}
      <Dialog open={isProcessing}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="mb-4">
              <Loader2 className="h-16 w-16 animate-spin text-finance-blue mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Processing Transaction
            </h3>
            <p className="text-gray-600 mb-4">
              Please wait while we process your fund purchase...
            </p>
            {transactionData && (
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Fund:</span>
                  <span className="text-sm font-medium">{transactionData.fund.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium">
                    ${transactionData.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={() => onCloseSuccess()}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-success-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Transaction Successful!
            </h3>
            <p className="text-gray-600 mb-4">
              Your fund purchase has been completed successfully.
            </p>
            {transactionData && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Fund:</span>
                  <span className="text-sm font-medium">{transactionData.fund.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium">
                    ${transactionData.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shares:</span>
                  <span className="text-sm font-medium">
                    {transactionData.shares.toFixed(4)}
                  </span>
                </div>
              </div>
            )}
            <div className="flex space-x-3">
              <Link href="/portfolio">
                <Button 
                  onClick={onCloseSuccess}
                  className="flex-1 bg-finance-blue hover:bg-finance-light"
                >
                  View Portfolio
                </Button>
              </Link>
              <Button 
                variant="outline"
                onClick={onCloseSuccess}
                className="flex-1"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
