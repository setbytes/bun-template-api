import { Product } from "@/core/entities/Product";

export interface ProductDatabase {
  save(product: Product): Promise<Product>;
  delete(product: Product): Promise<Product>;
  findAll(product: Product): Promise<Array<Product>>;
  findById(id: number): Promise<Product>;
  findByIntegrationCode(integrationCode: string): Promise<Product>;
}
