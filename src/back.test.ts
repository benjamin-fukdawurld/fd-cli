import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuid } from 'uuid';

import back, {
  createSrcFolderArchitecture,
  copyCommonFiles,
  generatePackageJsonFile,
  installBack,
} from './back';

describe('src folder architecture', () => {
  const testDir = path.join(os.tmpdir(), `fd-cli-back-test-${uuid()}`);
  beforeAll(async () => {
    await fs.mkdir(testDir);
    await createSrcFolderArchitecture(testDir);
  });

  afterAll(() => {
    fs.rmdir(testDir, { recursive: true });
  });

  it('should contain a src directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src'));
    }).not.toThrow();
  });

  it('should contain a src/routes directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src', 'routes'));
    }).not.toThrow();
  });

  it('should contain a src/controllers directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src', 'controllers'));
    }).not.toThrow();
  });

  it('should contain a src/middlewares directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src', 'middlewares'));
    }).not.toThrow();
  });

  it('should contain a src/services directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src', 'services'));
    }).not.toThrow();
  });

  it('should contain a src/dao directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src', 'dao'));
    }).not.toThrow();
  });

  it('should contain a src/types directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src', 'types'));
    }).not.toThrow();
  });

  it('should contain a src/interfaces directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src', 'interfaces'));
    }).not.toThrow();
  });
});

describe('common files templates', () => {
  const testDir = path.join(os.tmpdir(), `fd-cli-back-files-test-${uuid()}`);
  const templatesFolderPath = path.join(__dirname, '../templates');
  beforeAll(async () => {
    await fs.mkdir(testDir);
    await fs.mkdir(path.join(testDir, 'src'));
    await fs.mkdir(path.join(testDir, 'src', 'interfaces'));
    await copyCommonFiles(testDir, templatesFolderPath);
  });

  afterAll(() => {
    fs.rmdir(testDir, { recursive: true });
  });

  it('should contain a .editorconfig file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, '.editorconfig'));
    }).not.toThrow();
  });

  it('should contain a .eslintrc.js file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, '.eslintrc.js'));
    }).not.toThrow();
  });

  it('should contain a .prettierrc.js file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, '.prettierrc.js'));
    }).not.toThrow();
  });

  it('should contain a tsconfig.json file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'tsconfig.json'));
    }).not.toThrow();
  });

  it('should contain a .gitignore file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, '.gitignore'));
    }).not.toThrow();
  });

  it('should contain a LICENSE file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'LICENSE'));
    }).not.toThrow();
  });

  it('should contain a Dockerfile file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'Dockerfile'));
    }).not.toThrow();
  });

  it('should contain a .dockerignore file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, '.dockerignore'));
    }).not.toThrow();
  });

  it('should contain a example.env file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'example.env'));
    }).not.toThrow();
  });

  it('should contain a nodemon.json file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'nodemon.json'));
    }).not.toThrow();
  });

  it('should contain a src/server.ts file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src/server.ts'));
    }).not.toThrow();
  });

  it('should contain a src/app.ts file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src/app.ts'));
    }).not.toThrow();
  });

  it('should contain a src/config.ts file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src/config.ts'));
    }).not.toThrow();
  });

  it('should contain a src/interfaces/App.ts file', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'src/interfaces/App.ts'));
    }).not.toThrow();
  });
});

describe('generated package.json', () => {
  const templatesFolderPath = path.join(__dirname, '../templates');
  const testDir = path.join(os.tmpdir(), `fd-cli-package-test-${uuid()}`);
  const name = 'backtest';
  const author = 'backtest-author';
  beforeAll(async () => {
    await fs.mkdir(testDir);
    await fs.mkdir(path.join(testDir, 'back'));
    await generatePackageJsonFile(testDir, templatesFolderPath, {
      name,
      author,
      mongo: true,
      knex: false,
      postgres: false,
      typeorm: true,
    });
  });

  afterAll(() => {
    fs.rmdir(testDir, { recursive: true });
  });

  it('should generate without error', async () => {
    const packageData = JSON.parse(await fs.readFile(path.join(testDir, 'package.json'), 'utf8'));
    expect(packageData.name).toEqual(name);
    expect(packageData.author).toEqual(author);
    expect(packageData.dependencies.mongoose).toBeDefined();
    expect(packageData.dependencies.knex).toBeUndefined();
    expect(packageData.dependencies.postgres).toBeUndefined();
    expect(packageData.dependencies.typeorm).toBeDefined();
  });
});

describe('backend installation', () => {
  const templatesFolderPath = path.join(__dirname, '../templates');
  const testDir = path.join(os.tmpdir(), `fd-cli-back-install-${uuid()}`);
  beforeAll(async () => {
    await fs.mkdir(testDir);
    await fs.mkdir(path.join(testDir, 'back'));
  });

  afterAll(() => {
    fs.rmdir(testDir, { recursive: true });
  });

  it('should not accept illegal name', async () => {
    const name = 'back test';
    const author = 'backtest-author';
    await generatePackageJsonFile(path.join(testDir, 'back'), templatesFolderPath, {
      name,
      author,
    });

    expect(installBack(path.join(testDir, 'back'))).rejects.toEqual(
      new Error('yarn exited with status 1'),
    );
  });
});

describe('back folder architecture', () => {
  const templatesFolderPath = path.join(__dirname, '../templates');
  const testDir = path.join(os.tmpdir(), `fd-cli-test-${uuid()}`);
  beforeAll(async () => {
    await fs.mkdir(testDir);
    await back(testDir, templatesFolderPath, {
      packageJsonOptions: { name: 'test-package', author: 'test' },
    });
  });

  afterAll(() => {
    fs.rmdir(testDir, { recursive: true });
  });

  it('should contain a back directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'back'));
    }).not.toThrow();
  });

  it('should contain a back/src directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'back', 'src'));
    }).not.toThrow();
  });

  it('should contain a back/doc directory', async () => {
    expect(async () => {
      await fs.access(path.join(testDir, 'back', 'doc'));
    }).not.toThrow();
  });
});
