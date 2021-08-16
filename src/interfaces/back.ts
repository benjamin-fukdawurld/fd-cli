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
