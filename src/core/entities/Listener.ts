import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import { Account } from "@/core/entities/Account";

type AccountType = Account;

@Entity({ name: "listeners" })
export class Listener extends BaseEntity {
  // data
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: "varchar", length: 255 * 4, default: null })
  public endpoint!: string;

  @Column({ type: "varchar", length: 255 * 2, default: null })
  public referenceCode!: string;

  @Column({ default: null })
  public integrationCode!: string;

  // relationship

  @ManyToOne(() => Account, account => account.webhooks, { nullable: false })
  public account: AccountType & Account;

  // default

  @CreateDateColumn({ type: "timestamp" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  public deletedAt: Date;

  // helpers
  public toDto(): Listener {
    delete this.account;
    // this.credential = this.credential?.toDto();
    return this;
  }

  static createInstance(data: any): Listener {
    const current = new Listener();
    current.id = data.id || null;
    current.account = data.account;
    current.endpoint = data.endpoint;
    current.referenceCode = data.referenceCode;
    return current;
  }
}
