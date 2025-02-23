
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
  Cell,
  Legend
} from "recharts";
import { Download, FileText, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { store } from "@/lib/store";

const Reports = () => {
  const { data: stats } = useQuery({
    queryKey: ["dashboard"],
    queryFn: store.getDashboardStats,
  });

  // Sample data for charts
  const monthlyData = [
    { name: "Jan", sales: 1200, profit: 300 },
    { name: "Feb", sales: 1900, profit: 450 },
    { name: "Mar", sales: 1500, profit: 380 },
    { name: "Apr", sales: 2100, profit: 520 },
    { name: "May", sales: 2400, profit: 600 },
    { name: "Jun", sales: 1800, profit: 450 },
  ];

  const pieData = [
    { name: "Electronics", value: 400, color: '#0088FE' },
    { name: "Clothing", value: 300, color: '#00C49F' },
    { name: "Food", value: 300, color: '#FFBB28' },
    { name: "Books", value: 200, color: '#FF8042' },
  ];

  return (
    <div className="container space-y-6 p-4 md:p-8 pt-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Analyze your business performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" /> Select Period
          </Button>
          <Button className="bg-primary hover:bg-primary/90 transition-colors">
            <Download className="mr-2 h-4 w-4" /> Export Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Sales Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalSales.toFixed(2) || "0.00"}</div>
            <p className="text-sm text-muted-foreground mt-2">Total sales this period</p>
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>Previous Period</span>
                <span className="font-medium">$8,942.00</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>Growth</span>
                <span className="font-medium text-emerald-500">+12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+15.2%</div>
            <p className="text-sm text-muted-foreground mt-2">Growth from last month</p>
            <div className="mt-4 space-y-2">
              <div className="text-xs flex justify-between">
                <span>Current Month</span>
                <span>Previous Month</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Profit Margin</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.5%</div>
            <p className="text-sm text-muted-foreground mt-2">Average profit margin</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-secondary rounded">
                <div className="font-medium">Low</div>
                <div>18%</div>
              </div>
              <div className="text-center p-2 bg-secondary rounded">
                <div className="font-medium">Avg</div>
                <div>23.5%</div>
              </div>
              <div className="text-center p-2 bg-secondary rounded">
                <div className="font-medium">High</div>
                <div>28%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="#8884d8" />
                  <Bar dataKey="profit" name="Profit" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
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
