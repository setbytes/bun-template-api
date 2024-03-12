import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Account } from "@/core/entities/Account";
import { Product } from "./Product";

type AccountType = Account;
type ProductType = Product;

export enum SubscriptionStatusEnum {
  PROCESSING = "PROCESSING",
  CANCELED = "CANCELED",
  APPROVED = "APPROVED"
}

export enum PaymentStatusEnum {
  STOPPED = "STOPPED",
  RUNNING = "RUNNING",
  WAITING_CANCELATION = "WAITING_CANCELATION",
  CANCELED = "CANCELED"
}

@Entity({ name: "subscriptions" })
@Unique(["referenceCode"])
export class Subscription extends BaseEntity {
  // data
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: "enum", enum: SubscriptionStatusEnum, default: SubscriptionStatusEnum.PROCESSING })
  public status: SubscriptionStatusEnum;

  @Column({ type: "enum", enum: PaymentStatusEnum, default: PaymentStatusEnum.STOPPED })
  public chargeStatus: PaymentStatusEnum;

  @Column()
  public integrationSessionCode!: string;

  @Column({ default: null })
  public integrationCode!: string;

  @Column()
  public referenceCode!: string;

  // relationship

  @ManyToOne(() => Account, account => account.subscriptions, { nullable: false, onDelete: "CASCADE" })
  public account: AccountType & Account;

  @ManyToOne(() => Product, account => account.subscriptions, { nullable: false, onDelete: "CASCADE" })
  public product: ProductType & Product;

  // default

  @CreateDateColumn({ type: "timestamp" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  public deletedAt: Date;

  // helpers

  public toDto(): Subscription {
    delete this.account;
    delete this.referenceCode;
    delete this.deletedAt;
    delete this.integrationCode;
    delete this.integrationSessionCode;
    this.product = this.product?.toDto();
    return this;
  }

  static createInstance(data: any, account: Account): Subscription {
    const current = new Subscription();
    current.id = data.id || null;
    current.status = data.status;
    current.account = account;
    return current;
  }
}
