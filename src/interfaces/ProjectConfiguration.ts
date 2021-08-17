export type AvailableModules = 'back' | 'front' | 'postgres database';
export type DatabaseAvailableOptions = 'mongodb' | 'postgres' | 'graphql' | 'knex' | 'typeorm';

export interface ProjectConfiguration {
  name: string;
  author: string;
  modules: AvailableModules[];
  databaseOptions: DatabaseAvailableOptions[];
}
