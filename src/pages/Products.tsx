
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ProductFormData } from "@/types";

const Products = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    quantity: 0,
    purchasePrice: 0,
    sellingPrice: 0,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: store.getProducts,
  });

  const addProduct = useMutation({
    mutationFn: (data: ProductFormData) => store.addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setOpen(false);
      setFormData({
        name: "",
        quantity: 0,
        purchasePrice: 0,
        sellingPrice: 0,
      });
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => store.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct.mutate(formData);
  };

  return (
    <div className="container space-y-8 p-8 pt-6 animate-fadeIn">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: Number(e.target.value),
                        })
                      }
                      min="0"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purchasePrice">Purchase Price</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purchasePrice: Number(e.target.value),
                        })
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sellingPrice">Selling Price</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      value={formData.sellingPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sellingPrice: Number(e.target.value),
                        })
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Add Product
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
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Purchase Price</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>${product.purchasePrice.toFixed(2)}</TableCell>
                <TableCell>${product.sellingPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteProduct.mutate(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!products?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Products;
