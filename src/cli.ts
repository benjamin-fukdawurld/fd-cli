import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function setupBackendCli(args: yargs.Argv<any>): yargs.Argv<any> {
  return args.command('back', 'generate back end only', (backArgs: yargs.Argv<any>) =>
    backArgs
      .positional('name', {
        type: 'string',
        describe: 'the name of the projects',
      })
      .option('mongo', {
        alias: 'mdb',
        description: 'add MongoDB utils to backend',
        type: 'boolean',
      })
      .option('postgres', {
        alias: 'pg',
        description: 'add postgres utils to back end and create de prosgres DockerImage template',
        type: 'boolean',
      })
      .boolean('postgres')
      .option('graphql', {
        alias: 'gql',
        description: 'add gql utils to backend',
        type: 'boolean',
      })
      .option('knex', { description: 'add knex to backend dependencies', type: 'boolean' })
      .option('typeorm', { alias: 'torm', description: 'add typeorm to backend dependencies' }),
  );
}

function setupFrontendCli(args: yargs.Argv<any>): yargs.Argv<any> {
  return args.command(
    'front',
    'generate front end only',
    (frontArgs: yargs.Argv<any>): yargs.Argv<any> =>
      frontArgs
        .positional('name', {
          type: 'string',
          describe: 'the name of the projects',
        })
        .option('material', {
          alias: 'mui',
          description: 'add material ui to frontend',
          type: 'boolean',
        })
        .option('tailwind', {
          alias: 'tw',
          description: 'add tailwind to frontend',
          type: 'boolean',
        })
        .option('sass', { description: 'add sass to frontend', type: 'boolean' }),
  );
}

export function parseArgs() {
  return setupFrontendCli(
    setupBackendCli(
      yargs(hideBin(process.argv))
        .scriptName('fd-cli')
        .usage(
          '$0 <command> project-name [options]',
          'create a backend, frontend, database, fullstack project template from command line',
        )
        .usage(
          '$0',
          'create a backend, frontend, database or fullstack project template interactively',
        ),
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
      ),
  )
    .help()
    .alias('h', 'help').argv;
}

export default parseArgs;

/*
const templatesFolderPath = path.join(__dirname, 'templates');
back('test', templatesFolderPath, {
  packageJsonOptions: {
    name: 'test',
    author: 'test',
  },
}).catch((err: any) => logger.error(err.message));
*/
