import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import FundsPage from "@/pages/funds";
import PortfolioPage from "@/pages/portfolio";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <Switch>
        <Route path="/" component={FundsPage} />
        <Route path="/portfolio" component={PortfolioPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
