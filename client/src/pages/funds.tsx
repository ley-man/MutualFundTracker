import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import FundCard from "@/components/fund-card";
import FundDetail from "@/components/fund-detail";
import { Skeleton } from "@/components/ui/skeleton";
import type { Fund } from "@shared/schema";

export default function FundsPage() {
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  const { data: funds = [], isLoading } = useQuery<Fund[]>({
    queryKey: ["/api/funds"],
  });

  const filteredFunds = funds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.manager.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Simple category filtering based on fund name
    const matchesCategory = categoryFilter === "all" || 
      (categoryFilter === "equity" && fund.name.toLowerCase().includes("growth")) ||
      (categoryFilter === "bond" && fund.name.toLowerCase().includes("bond")) ||
      (categoryFilter === "mixed" && (fund.name.toLowerCase().includes("value") || fund.name.toLowerCase().includes("esg")));
    
    return matchesSearch && matchesCategory;
  });

  if (selectedFund) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FundDetail 
          fund={selectedFund} 
          onBack={() => setSelectedFund(null)} 
        />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search funds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="equity">Equity Funds</SelectItem>
                    <SelectItem value="bond">Bond Funds</SelectItem>
                    <SelectItem value="mixed">Mixed Funds</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                    <SelectItem value="uk">UK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4 flex items-center justify-center">
                  <div className="text-white text-xs font-bold">FUNDS</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Funds</p>
                  <p className="text-2xl font-bold text-gray-900">{funds.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-4 flex items-center justify-center">
                  <div className="text-white text-xs font-bold">PERF</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Return</p>
                  <p className="text-2xl font-bold text-success-green">+7.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mr-4 flex items-center justify-center">
                  <div className="text-white text-xs font-bold">AUM</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total AUM</p>
                  <p className="text-2xl font-bold text-gray-900">€2.4B</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg mr-4 flex items-center justify-center">
                  <div className="text-white text-xs font-bold">INV</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Investors</p>
                  <p className="text-2xl font-bold text-gray-900">15.7K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fund Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFunds.map((fund) => (
              <FundCard
                key={fund.id}
                fund={fund}
                onSelect={setSelectedFund}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredFunds.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg">No funds found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
