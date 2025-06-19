import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Fund } from "@shared/schema";

type SortField = "name" | "yearReturn" | "aum" | "riskLevel" | "expenseRatio";
type SortDirection = "asc" | "desc";

export default function ResearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<"all" | "US" | "Offshore">("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { data: funds = [], isLoading } = useQuery<Fund[]>({
    queryKey: ["/api/funds"],
  });

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getReturnColor = (returnStr: string) => {
    return returnStr.startsWith("+") ? "text-green-600" : "text-red-600";
  };

  const parseReturn = (returnStr: string): number => {
    return parseFloat(returnStr.replace(/[+%]/g, ''));
  };

  const parseAUM = (aumStr: string): number => {
    if (!aumStr) return 0;
    const num = parseFloat(aumStr.replace(/[^0-9.]/g, ''));
    if (aumStr.includes('B')) return num * 1000;
    if (aumStr.includes('T')) return num * 1000000;
    return num;
  };

  const getRiskValue = (risk: string): number => {
    switch (risk.toLowerCase()) {
      case "low": return 1;
      case "medium": return 2;
      case "high": return 3;
      default: return 0;
    }
  };

  const filteredAndSortedFunds = useMemo(() => {
    let filtered = funds.filter(fund => {
      const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fund.manager.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter === "all" || fund.region === regionFilter;
      return matchesSearch && matchesRegion;
    });

    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "yearReturn":
          aValue = parseReturn(a.yearReturn);
          bValue = parseReturn(b.yearReturn);
          break;
        case "aum":
          aValue = parseAUM(a.aum || "");
          bValue = parseAUM(b.aum || "");
          break;
        case "riskLevel":
          aValue = getRiskValue(a.riskLevel);
          bValue = getRiskValue(b.riskLevel);
          break;
        case "expenseRatio":
          aValue = parseFloat(a.expenseRatio);
          bValue = parseFloat(b.expenseRatio);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [funds, searchTerm, regionFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research</h1>
          <p className="text-gray-600 mt-2">Analyze and compare mutual funds</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Fund Analysis</CardTitle>
          </CardHeader>
          <CardContent>
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
                <Select value={regionFilter} onValueChange={(value: "all" | "US" | "Offshore") => setRegionFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="US">US Funds</SelectItem>
                    <SelectItem value="Offshore">Offshore Funds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fund Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Fund Name
                        <SortIcon field="name" />
                      </div>
                    </TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>NAV</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("yearReturn")}
                    >
                      <div className="flex items-center gap-2">
                        1Y Return
                        <SortIcon field="yearReturn" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("riskLevel")}
                    >
                      <div className="flex items-center gap-2">
                        Risk Level
                        <SortIcon field="riskLevel" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("aum")}
                    >
                      <div className="flex items-center gap-2">
                        AUM
                        <SortIcon field="aum" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("expenseRatio")}
                    >
                      <div className="flex items-center gap-2">
                        Expense Ratio
                        <SortIcon field="expenseRatio" />
                      </div>
                    </TableHead>
                    <TableHead>Min Investment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </TableCell>
                        <TableCell className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </TableCell>
                        <TableCell className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </TableCell>
                        <TableCell className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </TableCell>
                        <TableCell className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </TableCell>
                        <TableCell className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </TableCell>
                        <TableCell className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </TableCell>
                        <TableCell className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </TableCell>
                        <TableCell className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredAndSortedFunds.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <p className="text-gray-500">No funds found</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your search terms or filters
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedFunds.map((fund) => (
                      <TableRow key={fund.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold text-gray-900">{fund.name}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {fund.manager}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={fund.region === "US" ? "border-blue-200 text-blue-800" : "border-purple-200 text-purple-800"}>
                            {fund.region}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {fund.currency === "USD" ? "$" : fund.currency === "EUR" ? "€" : "£"}{parseFloat(fund.nav).toFixed(2)}
                        </TableCell>
                        <TableCell className={`font-semibold ${getReturnColor(fund.yearReturn)}`}>
                          {fund.yearReturn}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(fund.riskLevel)}>
                            {fund.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {fund.aum || "N/A"}
                        </TableCell>
                        <TableCell>{fund.expenseRatio}%</TableCell>
                        <TableCell className="font-medium">
                          {fund.currency === "USD" ? "$" : fund.currency === "EUR" ? "€" : "£"}{fund.minInvestment.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Showing Results</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredAndSortedFunds.length} of {funds.length} funds
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Regions</p>
                <p className="text-lg font-semibold text-gray-900">
                  {regionFilter === "all" ? "All" : regionFilter}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}