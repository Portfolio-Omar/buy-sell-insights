
import { Product, Sale } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const store = {
  // Product operations
  getProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(product => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      purchasePrice: product.purchase_price,
      sellingPrice: product.selling_price,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    })) as Product[];
  },
  
  addProduct: async (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        quantity: product.quantity,
        purchase_price: product.purchasePrice,
        selling_price: product.sellingPrice
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      quantity: data.quantity,
      purchasePrice: data.purchase_price,
      sellingPrice: data.selling_price,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    } as Product;
  },
  
  updateProduct: async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        quantity: updates.quantity,
        purchase_price: updates.purchasePrice,
        selling_price: updates.sellingPrice
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      quantity: data.quantity,
      purchasePrice: data.purchase_price,
      sellingPrice: data.selling_price,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    } as Product;
  },
  
  deleteProduct: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  // Sale operations
  getSales: async () => {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(sale => ({
      id: sale.id,
      productId: sale.product_id,
      quantity: sale.quantity,
      totalAmount: sale.total_amount,
      profit: sale.profit,
      createdAt: new Date(sale.created_at)
    })) as Sale[];
  },
  
  addSale: async (productId: string, quantity: number) => {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (productError) throw productError;
    if (!product || product.quantity < quantity) {
      throw new Error("Insufficient stock");
    }
    
    // Calculate total amount and profit
    const totalAmount = product.selling_price * quantity;
    const profit = (product.selling_price - product.purchase_price) * quantity;
    
    // Start transaction by inserting sale
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        product_id: productId,
        quantity,
        total_amount: totalAmount,
        profit
      })
      .select()
      .single();
    
    if (saleError) throw saleError;
    
    // Update product quantity
    const { error: updateError } = await supabase
      .from('products')
      .update({ quantity: product.quantity - quantity })
      .eq('id', productId);
    
    if (updateError) throw updateError;
    
    return {
      id: sale.id,
      productId: sale.product_id,
      quantity: sale.quantity,
      totalAmount: sale.total_amount,
      profit: sale.profit,
      createdAt: new Date(sale.created_at)
    } as Sale;
  },
  
  // Analytics
  getDashboardStats: async () => {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) throw productsError;
    
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*');
    
    if (salesError) throw salesError;
    
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce(
      (sum, product) => sum + (product.purchase_price * product.quantity),
      0
    );
    const totalSales = sales.reduce(
      (sum, sale) => sum + sale.total_amount,
      0
    );
    const totalProfit = sales.reduce(
      (sum, sale) => sum + sale.profit,
      0
    );
    
    return {
      totalProducts,
      totalInventoryValue,
      totalSales,
      totalProfit,
    };
  },
};
