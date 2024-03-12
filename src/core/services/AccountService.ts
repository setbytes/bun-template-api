import { Request, Response } from "express";
import { Account } from "@/core/entities/Account";
import { AccountDatabase } from "@/core/use-cases/database/AccountDatabase";
import { Crypto } from "@/core/use-cases/helpers/Crypto";
import { Validator } from "@/core/use-cases/helpers/Validator";
import { Authentication } from "@/core/models/Authentication";
import { UniqueIdentifier } from "../use-cases/helpers/UniversallyUniqueIdentifier";

export class AccountService {
  constructor(
    private readonly accountRepository: AccountDatabase,
    private readonly encrypt: Crypto,
    private readonly accountValidators: Array<Validator>,
    private readonly universallyUniqueIdentifier: UniqueIdentifier
  ) { }

  public async handleCreateAccountRequest(request: Request, response: Response): Promise<any> {
    try {
      const account = Account.createInstance(request.body);
      for (const property of ["name", "email", "password"]) {
        if (!account[property]) {
          return response.status(400).json({ status: false, message: "Param is Missing: " + property });
        }
      }
      for (const validator of this.accountValidators) {
        const result = validator.verify(account);
        if (!result.success) {
          return response.status(400).json({ status: false, message: result.message });
        }
      }
      const isEmailAccountExist = await this.accountRepository.findByEmail(account.email);
      if (!isEmailAccountExist) {
        account.password = await this.encrypt.hash(account.password);
        account.secretKey = this.universallyUniqueIdentifier.generate();
        const accountResponse = await this.accountRepository.save(account);
        response.status(201).json(accountResponse.toDto());
      } else {
        response.status(409).json({ status: false, message: "Email already exist" });
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleUpdateAccountRequest(request: Request, response: Response): Promise<any> {
    try {
      const authentication = new Authentication(request);
      const { name, password } = request.body;
      if (name) {
        authentication.account.name = name;
      }
      if (password) {
        authentication.account.password = await this.encrypt.hash(password);
      }
      if (name || password) {
        authentication.account.updatedAt = new Date();
        const accountResponse = await this.accountRepository.save(authentication.account);
        response.status(200).json(accountResponse.toDto());
      } else {
        return response.status(400).json({ status: false, message: "Param is Missing: name or password" });
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleDeleteAccountRequest(request: Request, response: Response): Promise<any> {
    try {
      const authentication = new Authentication(request);
      const accountResponse = await this.accountRepository.delete(authentication.account);
      response.status(204).json(accountResponse.toDto());
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleFindAllAccountRequest(request: Request, response: Response): Promise<any> {
    try {
      const accountResponse = await this.accountRepository.findAll(request.query.name as string);
      response.status(200).json(accountResponse.map(account => account.toDto()));
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleFindByIdRequest(request: Request, response: Response): Promise<any> {
    try {
      const accountResponse = await this.accountRepository.findById(Number(request.params.id));
      if (accountResponse) {
        response.status(200).json(accountResponse.toDto());
      } else {
        response.status(404).json({ status: false, message: "Account not found" });
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }
}
