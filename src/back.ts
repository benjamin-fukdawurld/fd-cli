import fs from 'fs/promises';
import path from 'path';
import Mustache from 'mustache';
import { spawn } from 'child_process';
import logger from './logger';
import { PackageJsonOptions, BackendOptions } from './interfaces/back';

export async function createSrcDirArchitecture(backDirPath: string): Promise<void> {
  const srcDir = path.join(backDirPath, 'src');
  await fs.mkdir(srcDir);
  await fs.mkdir(path.join(srcDir, 'routes'));
  await fs.mkdir(path.join(srcDir, 'controllers'));
  await fs.mkdir(path.join(srcDir, 'middlewares'));
  await fs.mkdir(path.join(srcDir, 'services'));
  await fs.mkdir(path.join(srcDir, 'dao'));
  await fs.mkdir(path.join(srcDir, 'types'));
  await fs.mkdir(path.join(srcDir, 'interfaces'));
}

export async function createBackDirArchitecture(backDirPath: string): Promise<void> {
  await fs.mkdir(backDirPath);
  await createSrcDirArchitecture(backDirPath);
  await fs.mkdir(path.join(backDirPath, 'doc'));
}

export async function copyCommonFiles(
  backDirPath: string,
  templatesDirPath: string,
): Promise<void> {
  fs.copyFile(
    path.join(templatesDirPath, 'common/.editorconfig'),
    path.join(backDirPath, '.editorconfig'),
  );
  fs.copyFile(
    path.join(templatesDirPath, 'common/.eslintrc.js'),
    path.join(backDirPath, '.eslintrc.js'),
  );
  fs.copyFile(
    path.join(templatesDirPath, 'common/.prettierrc.js'),
    path.join(backDirPath, '.prettierrc.js'),
  );
  fs.copyFile(
    path.join(templatesDirPath, 'common/tsconfig.json'),
    path.join(backDirPath, 'tsconfig.json'),
  );
  fs.copyFile(
    path.join(templatesDirPath, 'common/.gitignore'),
    path.join(backDirPath, '.gitignore'),
  );
  fs.copyFile(path.join(templatesDirPath, 'common/LICENSE'), path.join(backDirPath, 'LICENSE'));
  fs.copyFile(path.join(templatesDirPath, 'back/Dockerfile'), path.join(backDirPath, 'Dockerfile'));
  fs.copyFile(
    path.join(templatesDirPath, 'common/.dockerignore'),
    path.join(backDirPath, '.dockerignore'),
  );
  fs.copyFile(
    path.join(templatesDirPath, 'back/nodemon.json'),
    path.join(backDirPath, 'nodemon.json'),
  );
  fs.copyFile(
    path.join(templatesDirPath, 'back/src/server.ts'),
    path.join(backDirPath, 'src/server.ts'),
  );
  fs.copyFile(path.join(templatesDirPath, 'back/src/app.ts'), path.join(backDirPath, 'src/app.ts'));
  fs.copyFile(
    path.join(templatesDirPath, 'back/src/config.ts'),
    path.join(backDirPath, 'src/config.ts'),
  );
  fs.copyFile(
    path.join(templatesDirPath, 'back/src/interfaces/App.ts'),
    path.join(backDirPath, 'src/interfaces/App.ts'),
  );
}

export async function generatePackageJsonFile(
  backDirPath: string,
  templatesDirPath: string,
  options: PackageJsonOptions,
): Promise<void> {
  const packageJsonFile = await fs.readFile(
    path.join(templatesDirPath, '/back/package.json.mustache'),
    {
      encoding: 'utf8',
    },
  );

  await fs.writeFile(
    path.join(backDirPath, 'package.json'),
    Mustache.render(packageJsonFile, options),
  );
}

export async function generateExampleEnvFile(
  backDirPath: string,
  templatesDirPath: string,
  options: PackageJsonOptions,
): Promise<void> {
  const exampleEnvFile = await fs.readFile(
    path.join(templatesDirPath, '/back/example.env.mustache'),
    {
      encoding: 'utf8',
    },
  );

  const envFileOption = {
    mongoDbUser: 'mongodb_user',
    mongoDbPassword: 'mongodb_password',

    databaseName: 'postgres_db_name',
    databaseHost: 'postgres_db_home',
    databasePort: 5432,
    databaseUserName: 'postgres_user_name',
    databaseUserPassword: 'postgres_user_password',
  };

  await fs.writeFile(
    path.join(backDirPath, 'example.env'),
    Mustache.render(exampleEnvFile, { ...options, ...envFileOption }),
  );
}

export async function installBack(backDirPath: string): Promise<number> {
  return new Promise((resolve: (value: number) => void, reject: (reason: any) => void) => {
    const process = spawn('yarn', ['install'], { cwd: backDirPath });

    process.stdout.on('data', (data: string) => {
      logger.info(`yarn: ${data}`);
    });

    process.stderr.on('data', (data: string) => {
      logger.error(`yarn: ${data}`);
    });

    process.on('close', (code: number) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`yarn exited with status ${code}`));
      }
    });
  });
}

export async function generateBack(
  basePath: string,
  templatesDirPath: string,
  options: BackendOptions,
) {
  const backDirPath = path.join(basePath, 'back');
  await createBackDirArchitecture(backDirPath);
  await copyCommonFiles(backDirPath, templatesDirPath);
  await generatePackageJsonFile(backDirPath, templatesDirPath, options.packageJsonOptions);
  await installBack(backDirPath);
}

export default generateBack;
