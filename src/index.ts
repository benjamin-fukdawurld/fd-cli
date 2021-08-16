import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import back from './back';
import logger from './logger';

const argv = {
  ...yargs(hideBin(process.argv))
    .scriptName('fd-cli')
    .usage(
      '$0 <command> project-name [options]',
      'create a backend, frontend, database or fullstack project template from command line',
    )
    .usage('$0', 'create a backend, frontend, database or fullstack project template interactively')
    /*
.usage(
  '$0 project <project-name> [options]',
  'generate back end only',
  (args: yargs.Argv<{}>): void => {},
)
*/
    .command('back', 'generate back end only', (yargs: yargs.Argv<any>): yargs.Argv<any> => {
      return yargs.positional('name', {
        type: 'string',
        describe: 'the name of the projects',
      });
    })
    .command('front', 'generate front end only', (yargs: yargs.Argv<any>): yargs.Argv<any> => {
      return yargs.positional('name', {
        type: 'string',
        describe: 'the name of the projects',
      });
    })
    .command(
      'database',
      'generate PostgreSQL database docker image template',
      (yargs: yargs.Argv<any>): yargs.Argv<any> => {
        return yargs.positional('name', {
          type: 'string',
          describe: 'the name of the projects',
        });
      },
    )
    .command(
      'project',
      'generate project including, back end, front end and a PostrgreSQL database image if -pg option is set',
      (yargs: yargs.Argv<any>): yargs.Argv<any> => {
        return yargs.positional('name', {
          type: 'string',
          describe: 'the name of the projects',
        });
      },
    )
    .option('mongo', { alias: 'mdb', description: 'add MongoDB utils to backend', type: 'boolean' })
    .option('postgres', {
      alias: 'pg',
      description: 'add postgres utils to back end and create de prosgres DockerImage template',
      type: 'boolean',
    })
    .option('graphql', { alias: 'gql', description: 'add gql utils to backend', type: 'boolean' })
    .option('knex', { description: 'add knex to backend dependencies', type: 'boolean' })
    .option('typeorm', { alias: 'torm', description: 'add typeorm to backend dependencies' })
    .option('material', { alias: 'mui', description: 'add material ui to frontend' })
    .option('tailwind', { alias: 'tw', description: 'add tailwind to frontend' })
    .option('sass', { description: 'add sass to frontend', type: 'boolean' })

    .help()
    .alias('h', 'help').argv,
};

/*const templatesFolderPath = path.join(__dirname, 'templates');
back('test', templatesFolderPath, {
  packageJsonOptions: {
    name: 'test',
    author: 'test',
  },
}).catch((err: any) => logger.error(err.message));
*/
