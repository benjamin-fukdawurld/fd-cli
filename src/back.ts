import fs from 'fs/promises';
import path from 'path';
import Mustache from 'mustache';
import { spawn } from 'child_process';
import logger from './logger';
import { PackageJsonOptions, BackendOptions } from './interfaces/back';

export async function createSrcFolderArchitecture(backFolderPath: string): Promise<void> {
  const srcDir = path.join(backFolderPath, 'src');
  await fs.mkdir(srcDir);
  await fs.mkdir(path.join(srcDir, 'routes'));
  await fs.mkdir(path.join(srcDir, 'controllers'));
  await fs.mkdir(path.join(srcDir, 'middlewares'));
  await fs.mkdir(path.join(srcDir, 'services'));
  await fs.mkdir(path.join(srcDir, 'dao'));
  await fs.mkdir(path.join(srcDir, 'types'));
  await fs.mkdir(path.join(srcDir, 'interfaces'));
}

export async function createBackFolderArchitecture(backFolderPath: string): Promise<void> {
  await fs.mkdir(backFolderPath);
  await createSrcFolderArchitecture(backFolderPath);
  await fs.mkdir(path.join(backFolderPath, 'doc'));
}

export async function copyCommonFiles(
  backFolderPath: string,
  templatesFolderPath: string,
): Promise<void> {
  fs.copyFile(
    path.join(templatesFolderPath, 'common/.editorconfig'),
    path.join(backFolderPath, '.editorconfig'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'common/.eslintrc.js'),
    path.join(backFolderPath, '.eslintrc.js'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'common/.prettierrc.js'),
    path.join(backFolderPath, '.prettierrc.js'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'common/tsconfig.json'),
    path.join(backFolderPath, 'tsconfig.json'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'common/.gitignore'),
    path.join(backFolderPath, '.gitignore'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'common/LICENSE'),
    path.join(backFolderPath, 'LICENSE'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'back/Dockerfile'),
    path.join(backFolderPath, 'Dockerfile'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'common/.dockerignore'),
    path.join(backFolderPath, '.dockerignore'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'back/example.env'),
    path.join(backFolderPath, 'example.env'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'back/nodemon.json'),
    path.join(backFolderPath, 'nodemon.json'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'back/src/server.ts'),
    path.join(backFolderPath, 'src/server.ts'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'back/src/app.ts'),
    path.join(backFolderPath, 'src/app.ts'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'back/src/config.ts'),
    path.join(backFolderPath, 'src/config.ts'),
  );
  fs.copyFile(
    path.join(templatesFolderPath, 'back/src/interfaces/App.ts'),
    path.join(backFolderPath, 'src/interfaces/App.ts'),
  );
}

export async function generatePackageJsonFile(
  backFolderPath: string,
  templatesFolderPath: string,
  options: PackageJsonOptions,
): Promise<void> {
  const packageJsonFile = await fs.readFile(
    path.join(templatesFolderPath, '/back/package.json.mustache'),
    {
      encoding: 'utf8',
    },
  );

  await fs.writeFile(
    path.join(backFolderPath, 'package.json'),
    Mustache.render(packageJsonFile, options),
  );
}

export async function installBack(backFolderPath: string): Promise<number> {
  return new Promise((resolve: (value: number) => void, reject: (reason: any) => void) => {
    const process = spawn('yarn', ['install'], { cwd: backFolderPath });

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
  templatesFolderPath: string,
  options: BackendOptions,
) {
  const backFolderPath = path.join(basePath, 'back');
  await createBackFolderArchitecture(backFolderPath);
  await copyCommonFiles(backFolderPath, templatesFolderPath);
  await generatePackageJsonFile(backFolderPath, templatesFolderPath, options.packageJsonOptions);
  await installBack(backFolderPath);
}

export default generateBack;
