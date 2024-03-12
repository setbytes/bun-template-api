import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, OneToMany, Relation, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import { Listener } from "@/core/entities/Listener";
import { Subscription } from "@/core/entities/Subscription";

export enum PermissionRoleEnum {
  ROOT = "ROOT",
  ADMINISTRATOR = "ADMINISTRATOR",
  MODERATOR = "MODERATOR",
  CUSTOMER = "CUSTOMER"
}

@Entity({ name: "accounts" })
@Unique(["email"])
export class Account extends BaseEntity {
  // data
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public email!: string;

  @Column()
  public password!: string;

  @Column({ default: null })
  public secretKey!: string;

  @Column({ type: "enum", enum: PermissionRoleEnum, default: PermissionRoleEnum.CUSTOMER })
  public role: PermissionRoleEnum;

  // relationship

  @OneToMany(() => Listener, post => post.account)
  public webhooks: Array<Relation<Listener>>;

  @OneToMany(() => Subscription, post => post.account)
  public subscriptions: Array<Relation<Subscription>>;

  // default

  @CreateDateColumn({ type: "timestamp" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  public deletedAt: Date;

  // helpers

  static createInstance(account: any): Account {
    const current = new Account();
    current.id = account.id || null;
    current.name = account.name;
    current.email = account.email;
    current.password = account.password;
    current.secretKey = account.secretKey;
    return current;
  }

  public toDto(): Account {
    delete this.password;
    delete this.deletedAt;
    delete this.secretKey;
    return this;
  }
}
