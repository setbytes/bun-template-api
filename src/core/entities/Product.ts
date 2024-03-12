import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { ProductPrice } from "@/core/entities/ProductPrice";
import { Subscription } from "@/core/entities/Subscription";

export enum ProductTypeEnum {
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE"
}

@Entity({ name: "products" })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public description!: string;

  @Column({ type: "enum", enum: ProductTypeEnum, default: ProductTypeEnum.PRODUCT })
  public type: ProductTypeEnum;

  @Column()
  public integrationCode!: string;

  // relationship

  @OneToMany(() => ProductPrice, price => price.product)
  public prices: Array<Relation<ProductPrice>>;

  @OneToMany(() => Subscription, price => price.product)
  public subscriptions: Array<Relation<Subscription>>;

  // default

  @CreateDateColumn({ type: "timestamp" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  public deletedAt: Date;

  public toDto(): Product {
    delete this.deletedAt;
    delete this.integrationCode;
    this.prices = this.prices?.map(price => price.toDto());
    this.subscriptions = this.subscriptions?.map(subscription => subscription.toDto());
    return this;
  }

  public static createInstance(data: any): Product {
    const current = new Product();
    current.id = data.id || null;
    current.name = data.name;
    current.description = data.description;
    current.integrationCode = data.integrationCode;
    current.type = data.type;
    return current;
  }
}
