
import { Product, Sale } from "@/types";

// Temporary in-memory storage
let products: Product[] = [];
let sales: Sale[] = [];

export const store = {
  // Product operations
  getProducts: () => products,
  
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const newProduct: Product = {
      id: Math.random().toString(36).slice(2),
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    products = [...products, newProduct];
    return newProduct;
  },
  
  updateProduct: (id: string, updates: Partial<Product>) => {
    products = products.map((product) =>
      product.id === id
        ? { ...product, ...updates, updatedAt: new Date() }
        : product
    );
    return products.find((p) => p.id === id);
  },
  
  deleteProduct: (id: string) => {
    products = products.filter((product) => product.id !== id);
  },
  
  // Sale operations
  getSales: () => sales,
  
  addSale: (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.quantity < quantity) {
      throw new Error("Insufficient stock");
    }
    
    const totalAmount = product.sellingPrice * quantity;
    const profit = (product.sellingPrice - product.purchasePrice) * quantity;
    
    const sale: Sale = {
      id: Math.random().toString(36).slice(2),
      productId,
      quantity,
      totalAmount,
      profit,
      createdAt: new Date(),
    };
    
    // Update product quantity
    store.updateProduct(productId, {
      quantity: product.quantity - quantity,
    });
    
    sales = [...sales, sale];
    return sale;
  },
  
  // Analytics
  getDashboardStats: () => {
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce(
      (sum, product) => sum + product.purchasePrice * product.quantity,
      0
    );
    const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    
    return {
      totalProducts,
      totalInventoryValue,
      totalSales,
      totalProfit,
    };
  },
};
