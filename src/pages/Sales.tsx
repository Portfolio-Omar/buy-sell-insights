
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

  const addSale = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return await store.addSale(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
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

  return (
    <div className="container space-y-8 p-8 pt-6 animate-fadeIn">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Sale
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Sale</DialogTitle>
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
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales?.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{getProductName(sale.productId)}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
                <TableCell>${sale.profit.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(sale.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {!sales?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
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
