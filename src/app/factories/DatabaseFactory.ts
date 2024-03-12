import { DataSource } from "typeorm";
import { DataSourceSingleton } from "@/app/singletons/DataSourceSingleton";
import { AppDataSourceOptions } from "@/infra/configs/AppDataSourceOptions";
import { Account } from "@/core/entities/Account";
import { AccountRepository } from "@/infra/database/repository/AccountRepository";
import { AccountDatabase } from "@/core/use-cases/database/AccountDatabase";
import { ListenerDatabase } from "@/core/use-cases/database/ListenerDatabase";
import { Listener } from "@/core/entities/Listener";
import { ListenerRepository } from "@/infra/database/repository/WebhookRepository";
import { ProductDatabase } from "@/core/use-cases/database/ProductDatabase";
import { Product } from "@/core/entities/Product";
import { ProductRepository } from "@/infra/database/repository/ProductRepository";
import { ProductPriceDatabase } from "@/core/use-cases/database/ProductPriceDatabase";
import { ProductPriceRepository } from "@/infra/database/repository/ProductPriceRepository";
import { ProductPrice } from "@/core/entities/ProductPrice";
import { SubscriptionDatabase } from "@/core/use-cases/database/SubscriptionDatabase";
import { SubscriptionRepository } from "@/infra/database/repository/SubscriptionRepository";
import { Subscription } from "@/core/entities/Subscription";

export class DatabaseFactory {
  public static createDataSource(): DataSource {
    return DataSourceSingleton.getInstance(AppDataSourceOptions);
  }

  public static createAccountRepository(): AccountDatabase {
    const dataSourceInstance = DatabaseFactory.createDataSource();
    const repository = dataSourceInstance.getRepository(Account);
    return new AccountRepository(repository);
  }

  public static createListenerRepository(): ListenerDatabase {
    const dataSourceInstance = DatabaseFactory.createDataSource();
    const repository = dataSourceInstance.getRepository(Listener);
    return new ListenerRepository(repository);
  }

  public static createProductRepository(): ProductDatabase {
    const dataSourceInstance = DatabaseFactory.createDataSource();
    const repository = dataSourceInstance.getRepository(Product);
    return new ProductRepository(repository);
  }

  public static createProductPriceRepository(): ProductPriceDatabase {
    const dataSourceInstance = DatabaseFactory.createDataSource();
    const repository = dataSourceInstance.getRepository(ProductPrice);
    return new ProductPriceRepository(repository);
  }

  public static createSubscriptionRepository(): SubscriptionDatabase {
    const dataSourceInstance = DatabaseFactory.createDataSource();
    const repository = dataSourceInstance.getRepository(Subscription);
    return new SubscriptionRepository(repository);
  }
}
