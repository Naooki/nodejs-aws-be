import { ProductRepository } from "src/data-access";

const productsRepo = new ProductRepository();

export async function getProductById(id: string) {
  return productsRepo.findById(id);
}

export async function getProducts(params: { search?: string, limit?: number }) {
  return productsRepo.findAll(params);
}

export async function createProduct(productData: any) {
  return productsRepo.create(productData);
}

export async function createProductsBatch(productsData: any[]) {
  return productsRepo.createMany(productsData);
}
