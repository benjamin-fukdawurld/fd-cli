export interface PackageJsonOptions {
  name: string;
  author: string;
  mongo?: boolean;
  postgres?: boolean;
  knex?: boolean;
  typeorm?: boolean;
}

export interface BackendOptions {
  packageJsonOptions: PackageJsonOptions;
}

export interface EnvFileOptions {
  mongoDbUser: string;
  mongoDbPassword: string;
  databaseName: string;
  databaseHost: string;
  databasePort: number;
  databaseUserName: string;
  databaseUserPassword: string;
}
