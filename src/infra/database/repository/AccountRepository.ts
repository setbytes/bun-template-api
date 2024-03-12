import { Like, Repository } from "typeorm";
import { Account } from "@/core/entities/Account";
import { AccountDatabase } from "@/core/use-cases/database/AccountDatabase";

export class AccountRepository implements AccountDatabase {
  constructor(private readonly repository: Repository<Account>) {}

  public async save(account: Account): Promise<Account> {
    account.updatedAt = new Date();
    return this.repository.save(account);
  }

  public async delete(account: Account): Promise<Account> {
    account.deletedAt = new Date();
    // return this.accountRepository.remove(account);
    return this.repository.save(account);
  }

  public async findById(id: number): Promise<Account> {
    return this.repository.findOne({ where: { id }, cache: true });
  }

  public async findByEmail(email: string): Promise<Account> {
    return this.repository.findOne({ where: { email }, cache: true });
  }

  public async findAll(name: string): Promise<Array<Account>> {
    return this.repository.find({ where: { name: Like(`%${name || ""}%`) }, cache: true });
  }
}
