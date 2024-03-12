import { DataSource } from "typeorm";
import { AppDataSourceOptions } from "@/infra/configs/AppDataSourceOptions";

export const AppDataSource = new DataSource(AppDataSourceOptions);
