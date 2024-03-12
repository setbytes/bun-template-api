import { DataSourceOptions } from "typeorm";
import { environment } from "@/infra/configs/environment";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Account } from "@/core/entities/Account";
import { Listener } from "@/core/entities/Listener";
import { Product } from "@/core/entities/Product";
import { ProductPrice } from "@/core/entities/ProductPrice";
import { Subscription } from "@/core/entities/Subscription";

export const AppDataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: environment.MYSQL.HOST,
  port: environment.MYSQL.PORT,
  username: environment.MYSQL.USERNAME,
  password: environment.MYSQL.PASSWORD,
  database: environment.MYSQL.DATABASE,
  synchronize: true,
  logging: false,
  entities: [Account, Listener, Product, ProductPrice, Subscription],
  subscribers: [],
  migrations: [],
  extra: {
    charset: "utf8mb4_general_ci"
  },
  namingStrategy: new SnakeNamingStrategy()
};
