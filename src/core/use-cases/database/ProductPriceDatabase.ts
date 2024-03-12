import { ProductPrice } from "@/core/entities/ProductPrice";

export interface ProductPriceDatabase {
  save(price: ProductPrice): Promise<ProductPrice>;
  delete(price: ProductPrice): Promise<ProductPrice>;
  findById(id: number): Promise<ProductPrice>;
  findByIdIn(ids: Array<number>): Promise<Array<ProductPrice>>;
}
