import { Account } from "@/core/entities/Account";

export interface AccountDatabase {
  save(account: Account): Promise<Account>;
  delete(account: Account): Promise<Account>;
  findAll(name: string): Promise<Array<Account>>;
  findById(id: number): Promise<Account>;
  findByEmail(email: string): Promise<Account>;
}
