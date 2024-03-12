import { In, Repository } from "typeorm";
import { ProductPrice } from "@/core/entities/ProductPrice";
import { ProductPriceDatabase } from "@/core/use-cases/database/ProductPriceDatabase";

export class ProductPriceRepository implements ProductPriceDatabase {
  constructor(
    private readonly repository: Repository<ProductPrice>
  ) { }

  public async save(price: ProductPrice): Promise<ProductPrice> {
    price.updatedAt = new Date();
    return this.repository.save(price);
  }

  public async delete(price: ProductPrice): Promise<ProductPrice> {
    price.deletedAt = new Date();
    // return this.priceRepository.remove(price);
    return this.repository.save(price);
  }

  public async findById(id: number): Promise<ProductPrice> {
    return this.repository.findOne({ where: { id }, relations: ["product"], cache: true });
  }

  public async findByIdIn(ids: Array<number>): Promise<Array<ProductPrice>> {
    return this.repository.find({ where: { id: In(ids) }, relations: ["product"], cache: true });
  }
}
