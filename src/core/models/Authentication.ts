import { Account } from "@/core/entities/Account";

export class Authentication {
  public account: Account;
  public id: number;
  public email: string;

  public constructor(data: any) {
    if (data.authentication) {
      this.id = data?.authentication?.id || null;
      this.email = data?.authentication?.email || null;
      this.account = data?.authentication?.account || null;
    } else {
      this.id = data?.id || null;
      this.email = data?.email || null;
    }
  }
}
