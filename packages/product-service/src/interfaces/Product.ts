import { Stock } from "./Stock";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

interface HasStockCount extends Pick<Stock, "count"> {}

export interface ProductWithCount extends Product {
  count: number;
}

export interface ProductCreateDto
  extends Omit<Product, "id">,
    Partial<HasStockCount> {}
