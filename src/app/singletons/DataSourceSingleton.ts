import { DataSource, DataSourceOptions } from "typeorm";

export class DataSourceSingleton {
  private static instance: DataSource;

  private constructor() {}

  public static getInstance(dataSourceOptions: DataSourceOptions): DataSource {
    if (!DataSourceSingleton.instance) {
      DataSourceSingleton.instance = new DataSource(dataSourceOptions);
      DataSourceSingleton.instance.initialize().then(() => {
        console.log("DATABASE CONNECTION START");
      });
    }
    return DataSourceSingleton.instance;
  }
}
