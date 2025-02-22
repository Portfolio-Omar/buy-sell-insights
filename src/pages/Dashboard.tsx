
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Package2,
  Wallet
} from "lucide-react";
import { store } from "@/lib/store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["dashboard"],
    queryFn: store.getDashboardStats,
  });

  // Sample data for the chart - in a real app, this would come from your API
  const salesData = [
    { name: "Jan", amount: 1200 },
    { name: "Feb", amount: 1900 },
    { name: "Mar", amount: 1500 },
    { name: "Apr", amount: 2100 },
    { name: "May", amount: 2400 },
    { name: "Jun", amount: 1800 },
  ];

  return (
    <div className="container space-y-8 p-8 pt-6 animate-fadeIn">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back to your inventory overview</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-slideIn hover:shadow-lg transition-all" style={{ animationDelay: "0ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>items in inventory</span>
              <span className="flex items-center text-emerald-500">
                <ArrowUpRight className="h-3 w-3" />
                +2.5%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slideIn hover:shadow-lg transition-all" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalSales.toFixed(2) || "0.00"}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>total revenue</span>
              <span className="flex items-center text-emerald-500">
                <ArrowUpRight className="h-3 w-3" />
                +12.2%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slideIn hover:shadow-lg transition-all" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalInventoryValue.toFixed(2) || "0.00"}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>current stock value</span>
              <span className="flex items-center text-red-500">
                <ArrowDownRight className="h-3 w-3" />
                -4.5%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slideIn hover:shadow-lg transition-all" style={{ animationDelay: "300ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalProfit.toFixed(2) || "0.00"}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>net earnings</span>
              <span className="flex items-center text-emerald-500">
                <ArrowUpRight className="h-3 w-3" />
                +8.3%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package2 className="h-4 w-4" />
              <span>Low Stock Alert</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-amber-500">3 products running low</div>
            <p className="text-sm text-muted-foreground mt-2">
              Some products need restocking soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span>Monthly Target</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-emerald-500">82% achieved</div>
            <p className="text-sm text-muted-foreground mt-2">
              On track to meet monthly sales goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="text-blue-500 hover:underline cursor-pointer">
                Generate inventory report
              </li>
              <li className="text-blue-500 hover:underline cursor-pointer">
                View sales analytics
              </li>
              <li className="text-blue-500 hover:underline cursor-pointer">
                Check purchase orders
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
