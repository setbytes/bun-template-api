import { Like, Repository } from "typeorm";
import { Product } from "@/core/entities/Product";
import { ProductDatabase } from "@/core/use-cases/database/ProductDatabase";

export class ProductRepository implements ProductDatabase {
  constructor(private readonly repository: Repository<Product>) { }

  public async save(product: Product): Promise<Product> {
    product.updatedAt = new Date();
    return this.repository.save(product);
  }

  public async delete(product: Product): Promise<Product> {
    product.deletedAt = new Date();
    // return this.productRepository.remove(product);
    return this.repository.save(product);
  }

  public async findById(id: number): Promise<Product> {
    return this.repository.findOne({ where: { id }, relations: ["prices"], cache: true });
  }

  public async findAll(product: Product): Promise<Array<Product>> {
    return this.repository.find({
      where: {
        id: product.id,
        name: Like(`%${product.name || ""}%`),
        description: Like(`%${product.description || ""}%`)
      },
      relations: ["prices"],
      cache: true
    });
  }

  public async findByIntegrationCode(integrationCode: string): Promise<Product> {
    return this.repository.findOne({ where: { integrationCode }, relations: ["prices"] });
  }
}
