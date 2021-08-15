import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import back from './back';
import logger from './logger';

const argv = {
  ...yargs(hideBin(process.argv))
    /*
.usage(
  '$0 project <project-name> [options]',
  'generate back end only',
  (args: yargs.Argv<{}>): void => {},
)
*/
    .command('back', 'generate back end only')
    .command('front', 'generate front end only')
    .command('database', 'generate PostgreSQL database docker image template')
    .command(
      'project',
      'generate project including, back end, front end and a PostrgreSQL database image if -pg option is set',
    )
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
