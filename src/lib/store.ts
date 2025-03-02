
import { Product, Sale, ProductCategory } from "@/types";
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
      category: product.category || 'other',
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    })) as Product[];
  },
  
  getCategories: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);
    
    if (error) throw error;
    
    // Extract unique categories
    const categories = new Set<string>();
    data.forEach(item => {
      if (item.category) categories.add(item.category);
    });
    
    // Add default categories if not present
    const defaultCategories = ['electronics', 'clothing', 'food', 'books', 'other'];
    defaultCategories.forEach(cat => categories.add(cat));
    
    return Array.from(categories).sort() as ProductCategory[];
  },
  
  addProduct: async (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        quantity: product.quantity,
        purchase_price: product.purchasePrice,
        selling_price: product.sellingPrice,
        category: product.category || 'other'
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
      category: data.category || 'other',
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
        selling_price: updates.sellingPrice,
        category: updates.category
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
      category: data.category || 'other',
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
      createdAt: new Date(sale.created_at),
      saleTime: sale.sale_time ? new Date(sale.sale_time) : new Date(sale.created_at)
    })) as Sale[];
  },
  
  getDailySales: async () => {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Group sales by date
    const salesByDate = data.reduce((acc, sale) => {
      const dateKey = new Date(sale.created_at).toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          total: 0,
          profit: 0,
          count: 0
        };
      }
      
      acc[dateKey].total += Number(sale.total_amount);
      acc[dateKey].profit += Number(sale.profit);
      acc[dateKey].count += 1;
      
      return acc;
    }, {} as Record<string, { date: string; total: number; profit: number; count: number }>);
    
    return Object.values(salesByDate).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
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
    const saleTime = new Date().toISOString();
    
    // Start transaction by inserting sale
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        product_id: productId,
        quantity,
        total_amount: totalAmount,
        profit,
        sale_time: saleTime
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
      createdAt: new Date(sale.created_at),
      saleTime: new Date(sale.sale_time)
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
    
    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Filter sales for today
    const todaySales = sales.filter(sale => 
      new Date(sale.created_at).toISOString().split('T')[0] === today
    );
    
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
    
    const todayTotalSales = todaySales.reduce(
      (sum, sale) => sum + sale.total_amount,
      0
    );
    const todayTotalProfit = todaySales.reduce(
      (sum, sale) => sum + sale.profit,
      0
    );
    
    // Get product categories distribution
    const categoriesCount = products.reduce((acc, product) => {
      const category = product.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalProducts,
      totalInventoryValue,
      totalSales,
      totalProfit,
      todayTotalSales,
      todayTotalProfit,
      categoriesCount
    };
  },
};
