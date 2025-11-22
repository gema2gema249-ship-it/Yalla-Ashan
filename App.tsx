import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Account from '@/pages/Account';
import Wallet from '@/pages/Wallet';
import Orders from '@/pages/Orders';
import Games from '@/pages/Games';
import Cards from '@/pages/Cards';
import Special from '@/pages/Special';
import Agents from '@/pages/Agents';
import Contact from '@/pages/Contact';
import ProductDetail from '@/pages/ProductDetail';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/account" component={Account} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/orders" component={Orders} />
      <Route path="/games" component={Games} />
      <Route path="/cards" component={Cards} />
      <Route path="/special" component={Special} />
      <Route path="/agents" component={Agents} />
      <Route path="/contact" component={Contact} />
      <Route path="/product" component={ProductDetail} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
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
