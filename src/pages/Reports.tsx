
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
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Download, FileText, TrendingUp, DollarSign, Calendar, Clock, Tag, Percent } from "lucide-react";
import { store } from "@/lib/store";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays } from "date-fns";
import { Badge } from "@/components/ui/badge";

const Reports = () => {
  const [period, setPeriod] = useState<"7days" | "30days" | "90days">("30days");
  
  const { data: stats } = useQuery({
    queryKey: ["dashboard"],
    queryFn: store.getDashboardStats,
  });

  const { data: sales } = useQuery({
    queryKey: ["sales"],
    queryFn: store.getSales,
  });

  const { data: dailySales } = useQuery({
    queryKey: ["dailySales"],
    queryFn: store.getDailySales,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: store.getProducts,
  });

  // Calculate date range based on period
  const getDateRange = () => {
    const days = period === "7days" ? 7 : period === "30days" ? 30 : 90;
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    return { startDate, endDate, days };
  };

  // Filter sales by date range
  const filteredSales = sales?.filter(sale => {
    const { startDate } = getDateRange();
    return new Date(sale.createdAt) >= startDate;
  });

  // Prepare data for monthly performance chart
  const prepareMonthlySalesData = () => {
    if (!filteredSales?.length) return [];
    
    const salesByDate = filteredSales.reduce((acc, sale) => {
      const dateKey = format(new Date(sale.createdAt), 'MMM dd');
      
      if (!acc[dateKey]) {
        acc[dateKey] = { name: dateKey, sales: 0, profit: 0 };
      }
      
      acc[dateKey].sales += sale.totalAmount;
      acc[dateKey].profit += sale.profit;
      
      return acc;
    }, {} as Record<string, { name: string; sales: number; profit: number }>);
    
    return Object.values(salesByDate).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  };

  const monthlyData = prepareMonthlySalesData();

  // Prepare data for category distribution chart
  const prepareCategoryData = () => {
    if (!products?.length) return [];
    
    const categories = products.reduce((acc, product) => {
      const category = product.category || 'other';
      
      if (!acc[category]) {
        acc[category] = {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          value: 0,
          color: getCategoryColor(category)
        };
      }
      
      acc[category].value += 1;
      
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);
    
    return Object.values(categories);
  };

  const pieData = prepareCategoryData();

  // Prepare data for hourly sales distribution
  const prepareHourlySalesData = () => {
    if (!filteredSales?.length) return [];
    
    // Initialize hours array with all 24 hours
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      sales: 0,
      count: 0
    }));
    
    // Populate with actual data
    filteredSales.forEach(sale => {
      const hour = new Date(sale.saleTime).getHours();
      hours[hour].sales += sale.totalAmount;
      hours[hour].count += 1;
    });
    
    // Format hours for display
    return hours.map(item => ({
      name: `${item.hour}:00`,
      sales: item.sales,
      count: item.count
    }));
  };

  const hourlyData = prepareHourlySalesData();

  // Function to get color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electronics':
        return '#0088FE';
      case 'clothing':
        return '#00C49F';
      case 'food':
        return '#FFBB28';
      case 'books':
        return '#FF8042';
      default:
        return '#8884d8';
    }
  };

  // Calculate sales metrics
  const calculateMetrics = () => {
    if (!filteredSales?.length) return { totalSales: 0, totalProfit: 0, avgOrderValue: 0, profitMargin: 0 };
    
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0);
    const avgOrderValue = totalSales / filteredSales.length;
    const profitMargin = (totalProfit / totalSales) * 100;
    
    return { totalSales, totalProfit, avgOrderValue, profitMargin };
  };

  const metrics = calculateMetrics();

  return (
    <div className="container space-y-6 p-4 md:p-8 pt-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Analyze your business performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={period} onValueChange={(value: "7days" | "30days" | "90days") => setPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90 transition-colors">
            <Download className="mr-2 h-4 w-4" /> Export Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              <span>Total Sales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalSales.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-2">For the last {getDateRange().days} days</p>
            {dailySales && dailySales.length > 1 && (
              <div className="mt-4 text-xs text-muted-foreground">
                <div className="flex justify-between items-center">
                  <span>Yesterday</span>
                  <span className="font-medium">
                    ${dailySales[1]?.total?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>Today</span>
                  <span className="font-medium text-emerald-500">
                    ${dailySales[0]?.total?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>Profit</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalProfit.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-2">For the last {getDateRange().days} days</p>
            <div className="mt-4 space-y-2">
              <div className="text-xs flex justify-between">
                <span>Profit Margin</span>
                <span className="font-medium text-emerald-500">{metrics.profitMargin.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(metrics.profitMargin * 3, 100)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm font-medium">
              <DollarSign className="h-4 w-4" />
              <span>Avg. Order Value</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.avgOrderValue.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-2">For the last {getDateRange().days} days</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-secondary rounded">
                <div className="font-medium">Min</div>
                <div>${filteredSales?.length ? Math.min(...filteredSales.map(s => s.totalAmount)).toFixed(2) : "0.00"}</div>
              </div>
              <div className="text-center p-2 bg-secondary rounded">
                <div className="font-medium">Avg</div>
                <div>${metrics.avgOrderValue.toFixed(2)}</div>
              </div>
              <div className="text-center p-2 bg-secondary rounded">
                <div className="font-medium">Max</div>
                <div>${filteredSales?.length ? Math.max(...filteredSales.map(s => s.totalAmount)).toFixed(2) : "0.00"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm font-medium">
              <Percent className="h-4 w-4" />
              <span>Sales by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-2">
              {pieData.slice(0, 3).map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-xs">{entry.name}</span>
                  </div>
                  <span className="text-xs font-medium">{entry.value}</span>
                </div>
              ))}
              {pieData.length > 3 && (
                <div className="text-xs text-center text-muted-foreground">
                  +{pieData.length - 3} more categories
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Sales Performance ({period})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] md:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    name="Sales" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    name="Profit" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Category Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] md:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => entry.name}
                    labelLine={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} items`, 'Quantity']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Hourly Sales Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="sales" name="Sales Amount ($)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="count" name="Number of Sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Units Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products && filteredSales ? (
                  getTopSellingProducts(products, filteredSales).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge className={`${getCategoryColor(item.category)} text-white`}>
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.unitsSold}</TableCell>
                      <TableCell>${item.revenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Report Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Period</h3>
              <p className="text-sm text-muted-foreground">
                {format(getDateRange().startDate, 'MMM dd, yyyy')} - {format(getDateRange().endDate, 'MMM dd, yyyy')}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Performance Indicators</h3>
              <div className="text-sm grid grid-cols-2 gap-2">
                <div className="p-2 bg-secondary/50 rounded">
                  <p className="text-xs text-muted-foreground">Total Sales</p>
                  <p className="font-medium">${metrics.totalSales.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-secondary/50 rounded">
                  <p className="text-xs text-muted-foreground">Total Profit</p>
                  <p className="font-medium">${metrics.totalProfit.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-secondary/50 rounded">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="font-medium">{filteredSales?.length || 0}</p>
                </div>
                <div className="p-2 bg-secondary/50 rounded">
                  <p className="text-xs text-muted-foreground">Avg Order Value</p>
                  <p className="font-medium">${metrics.avgOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {pieData.map((category, index) => (
                  <Badge 
                    key={index} 
                    className="bg-secondary text-foreground hover:bg-secondary/80"
                  >
                    {category.name}: {category.value}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download Full Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to get top selling products
function getTopSellingProducts(products, sales) {
  if (!products?.length || !sales?.length) return [];
  
  // Create a map for quick product lookup
  const productsMap = new Map(products.map(p => [p.id, p]));
  
  // Group sales by product
  const productSales = sales.reduce((acc, sale) => {
    const product = productsMap.get(sale.productId);
    if (!product) return acc;
    
    if (!acc[sale.productId]) {
      acc[sale.productId] = {
        id: sale.productId,
        name: product.name,
        category: product.category,
        unitsSold: 0,
        revenue: 0
      };
    }
    
    acc[sale.productId].unitsSold += sale.quantity;
    acc[sale.productId].revenue += sale.totalAmount;
    
    return acc;
  }, {});
  
  // Convert to array and sort by revenue
  return Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // Get top 5
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        {children}
      </table>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

function TableRow({ children, className }: { children: React.ReactNode, className?: string }) {
  return <tr className={className}>{children}</tr>;
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">{children}</th>;
}

function TableCell({ children, className, colSpan }: { 
  children: React.ReactNode, 
  className?: string,
  colSpan?: number
}) {
  return (
    <td 
      className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}

export default Reports;
