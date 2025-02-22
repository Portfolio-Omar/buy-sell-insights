
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Download, FileText, TrendingUp, DollarSign } from "lucide-react";
import { store } from "@/lib/store";

const Reports = () => {
  const { data: stats } = useQuery({
    queryKey: ["dashboard"],
    queryFn: store.getDashboardStats,
  });

  // Sample data for charts
  const monthlyData = [
    { name: "Jan", sales: 1200 },
    { name: "Feb", sales: 1900 },
    { name: "Mar", sales: 1500 },
    { name: "Apr", sales: 2100 },
    { name: "May", sales: 2400 },
    { name: "Jun", sales: 1800 },
  ];

  const pieData = [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Food", value: 300 },
    { name: "Books", value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container space-y-8 p-8 pt-6 animate-fadeIn">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Analyze your business performance</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 transition-colors">
          <Download className="mr-2 h-4 w-4" /> Export Reports
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Sales Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalSales.toFixed(2) || "0.00"}</div>
            <p className="text-sm text-muted-foreground mt-2">Total sales this period</p>
            <Button variant="outline" className="mt-4 w-full">
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+15.2%</div>
            <p className="text-sm text-muted-foreground mt-2">Growth from last month</p>
            <Button variant="outline" className="mt-4 w-full">
              View Trends
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Profit Margin</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.5%</div>
            <p className="text-sm text-muted-foreground mt-2">Average profit margin</p>
            <Button variant="outline" className="mt-4 w-full">
              View Analysis
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
