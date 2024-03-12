import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "@/core/entities/Product";

type ProductType = Product;

export enum PriceIntervalEnum {
  ONE_TIME = "ONE_TIME",
  ON_GOING = "ON_GOING"
}

export enum PriceIntervalPeriodEnum {
  NONE = "NONE",
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR"
}

export enum PaymentCurrencyEnum {
  BRL = "BRL",
  CAD = "CAD",
  USD = "USD",
}

@Entity({ name: "product_prices" })
export class ProductPrice extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00, transformer: { to: value => value, from: value => Number(value || 0) } })
  public amount!: number;

  @Column({ type: "enum", enum: PaymentCurrencyEnum, default: PaymentCurrencyEnum.BRL })
  public currency: PaymentCurrencyEnum;

  @Column({ type: "enum", enum: PriceIntervalEnum, default: PriceIntervalEnum.ON_GOING })
  public interval: PriceIntervalEnum;

  @Column({ type: "enum", enum: PriceIntervalPeriodEnum, default: PriceIntervalPeriodEnum.NONE })
  public intervalPeriod: PriceIntervalPeriodEnum;

  @Column({ default: 1 })
  public intervalCount: number;

  @Column()
  public integrationCode!: string;

  // relationship

  @ManyToOne(() => Product, account => account.prices, { nullable: false, onDelete: "CASCADE" })
  public product: ProductType & Product;

  // default

  @CreateDateColumn({ type: "timestamp" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  public deletedAt: Date;

  public toDto(): ProductPrice {
    delete this.product;
    delete this.deletedAt;
    delete this.integrationCode;
    return this;
  }

  public static createInstance(data: any): ProductPrice {
    const current = new ProductPrice();
    current.id = data.id || null;
    current.amount = data.amount;
    current.interval = data.interval;
    current.intervalCount = data.intervalCount;
    current.intervalPeriod = data.intervalPeriod;
    current.product = data.product;
    current.currency = data.currency || PaymentCurrencyEnum.BRL;
    return current;
  }
}
