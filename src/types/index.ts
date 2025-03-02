
export type ProductCategory = 'electronics' | 'clothing' | 'food' | 'books' | 'other';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  category: ProductCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  profit: number;
  createdAt: Date;
  saleTime: Date;
}

export interface ProductFormData {
  name: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  category: ProductCategory;
}

export interface DailySalesSummary {
  date: string;
  total: number;
  profit: number;
  count: number;
}
