/*
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import back from './back';
import logger from './logger';
*/

/*
const argv = {
  ...yargs(hideBin(process.argv))
    .scriptName('fd-cli')
    .usage(
      '$0 <command> project-name [options]',
      'create a backend, frontend, database or fullstack project template from command line',
    )
    .usage('$0', 'create a backend, frontend, database or fullstack project template interactively')
    .command(
      'back',
      'generate back end only',
      (args: yargs.Argv<any>): yargs.Argv<any> =>
        args
          .positional('name', {
            type: 'string',
            describe: 'the name of the projects',
          })
          .option('mongo', {
            alias: 'mdb',
            description: 'add MongoDB utils to backend',
            type: 'boolean',
          })
          .boolean('mongo')
          .option('postgres', {
            alias: 'pg',
            description:
              'add postgres utils to back end and create de prosgres DockerImage template',
            type: 'boolean',
          })
          .boolean('postgres')
          .option('graphql', {
            alias: 'gql',
            description: 'add gql utils to backend',
            type: 'boolean',
          })
          .boolean('graphql')
          .option('knex', { description: 'add knex to backend dependencies', type: 'boolean' })
          .boolean('knex')
          .option('typeorm', { alias: 'torm', description: 'add typeorm to backend dependencies' })
          .boolean('typeorm'),
    )
    .command(
      'front',
      'generate front end only',
      (args: yargs.Argv<any>): yargs.Argv<any> =>
        args.positional('name', {
          type: 'string',
          describe: 'the name of the projects',
        }),
    )
    .command(
      'database',
      'generate PostgreSQL database docker image template',
      (args: yargs.Argv<any>): yargs.Argv<any> =>
        args.positional('name', {
          type: 'string',
          describe: 'the name of the projects',
        }),
    )
    .command(
      'project',
      'generate project including, back end, front end and a PostrgreSQL database image if -pg option is set',
      (args: yargs.Argv<any>): yargs.Argv<any> =>
        args.positional('name', {
          type: 'string',
          describe: 'the name of the projects',
        }),
    )
    .option('material', { alias: 'mui', description: 'add material ui to frontend' })
    .option('tailwind', { alias: 'tw', description: 'add tailwind to frontend' })
    .option('sass', { description: 'add sass to frontend', type: 'boolean' })

    .help()
    .alias('h', 'help').argv,
};
*/

/*
const templatesFolderPath = path.join(__dirname, 'templates');
back('test', templatesFolderPath, {
  packageJsonOptions: {
    name: 'test',
    author: 'test',
  },
}).catch((err: any) => logger.error(err.message));
*/

import inquirer from 'inquirer';
import { BackendOptions } from './interfaces/back';
import logger from './logger';

interface ProjectConfiguration {
  name: string;
  author: string;
  back?: BackendOptions;
}

async function main(): Promise<void> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: 'name your project',
      name: 'name',
      validate: (value: string, answers: any): boolean =>
        /^([a-zA-Z]+)(-*([a-zA-Z])+)+$/.test(value),
    },
    {
      type: 'input',
      message: 'author',
      name: 'author',
      validate: (value: string, answers: any): boolean => value.length > 1,
    },
    {
      type: 'checkbox',
      message: 'what part of the project to do need to generate',
      choices: ['back', 'front', 'postgres database'],
      default: ['back', 'front'],
      name: 'modules',
      validate: (value: string[], answer: any) => value.length > 0,
    },
    {
      type: 'checkbox',
      choices: ['mongodb', 'postgres', 'graphql', 'knex', 'typeorm'],
      name: 'databaseOptions',
      when: (answer: any) => !!answer?.modules.includes('back'),
    },
  ]);
  console.log(answers);
}

main()
  .then(() => {
    logger.info('success');
  })
  .catch((error: any) => {
    logger.error(error.message);
  });
