
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { store } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Sales = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: store.getProducts,
  });

  const { data: sales } = useQuery({
    queryKey: ["sales"],
    queryFn: store.getSales,
  });

  const { data: dailySales } = useQuery({
    queryKey: ["dailySales"],
    queryFn: store.getDailySales,
  });

  const addSale = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return await store.addSale(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["dailySales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setOpen(false);
      setSelectedProduct("");
      setQuantity(1);
      toast({
        title: "Success",
        description: "Sale recorded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }
    addSale.mutate({ productId: selectedProduct, quantity });
  };

  const getProductName = (productId: string) => {
    return products?.find((p) => p.id === productId)?.name || "Unknown Product";
  };

  const getProductCategory = (productId: string) => {
    return products?.find((p) => p.id === productId)?.category || "other";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to get badge color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electronics':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'clothing':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'food':
        return 'bg-green-500 hover:bg-green-600';
      case 'books':
        return 'bg-amber-500 hover:bg-amber-600';
      default:
        return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  return (
    <div className="container space-y-8 p-4 md:p-8 pt-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record New Sale</DialogTitle>
                <DialogDescription>
                  Select a product and quantity to record a new sale.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product">Product</Label>
                    <Select
                      value={selectedProduct}
                      onValueChange={setSelectedProduct}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id}
                            disabled={product.quantity === 0}
                          >
                            {product.name} ({product.quantity} in stock)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="1"
                      max={
                        products?.find((p) => p.id === selectedProduct)?.quantity
                      }
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Record Sale
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4 max-h-[300px] overflow-y-auto p-2">
              {dailySales?.slice(0, 7).map((day) => (
                <div key={day.date} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                    <span className="text-green-600 font-bold">${day.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Sales: {day.count}</span>
                    <span>Profit: ${day.profit.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {!dailySales?.length && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No sales recorded yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales?.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{getProductName(sale.productId)}</TableCell>
                <TableCell>
                  <Badge className={`${getCategoryColor(getProductCategory(sale.productId))} text-white`}>
                    {getProductCategory(sale.productId).charAt(0).toUpperCase() + 
                      getProductCategory(sale.productId).slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
                <TableCell>${sale.profit.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(sale.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                  {formatTime(sale.saleTime)}
                </TableCell>
              </TableRow>
            ))}
            {!sales?.length && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No sales recorded
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Sales;
