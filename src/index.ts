import path from 'path';
import fs from 'fs/promises';

import back from './back';
import logger from './logger';
import { BackendOptions } from './interfaces/back';

import { ProjectConfiguration } from './interfaces/ProjectConfiguration';

import { startPrompts } from './prompts';

async function generateBackend(
  projectDir: string,
  templateDir: string,
  configuration: ProjectConfiguration,
) {
  const backendOptions: BackendOptions = {
    packageJsonOptions: {
      name: `${configuration.name}-api`,
      author: configuration.author,
      knex: configuration.databaseOptions.includes('knex'),
      mongo: configuration.databaseOptions.includes('mongodb'),
      postgres: configuration.databaseOptions.includes('postgres'),
      typeorm: configuration.databaseOptions.includes('typeorm'),
    },
  };

  await back(projectDir, templateDir, backendOptions);
}

async function main(): Promise<void> {
  let configuration: ProjectConfiguration | undefined;
  try {
    configuration = await startPrompts();
    const projectDir = path.join(process.cwd(), configuration.name);
    const templateDir = process.env.TEMPLATE_FOLDER ?? path.join(path.dirname('.'), 'templates');
    await fs.mkdir(projectDir);

    if (configuration.modules.includes('back')) {
      await generateBackend(projectDir, templateDir, configuration);
    }
  } catch (error: any) {
    logger.error(error.message);
    if (configuration) {
      fs.rm(path.join(process.cwd(), configuration.name), { recursive: true });
    }

    throw new Error('Generation failed');
  }
}

main()
  .then(() => {
    logger.info('starting generation');
  })
  .catch((error: any) => {
    logger.error(error.message);
  });
