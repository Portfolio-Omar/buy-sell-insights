
export interface Product {
  id: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
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
}

export interface ProductFormData {
  name: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
}
