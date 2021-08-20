import inquirer from 'inquirer';
import { ProjectConfiguration } from './interfaces/ProjectConfiguration';

export async function startPrompts(): Promise<ProjectConfiguration> {
  return inquirer.prompt<ProjectConfiguration>([
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
    {
      type: 'confirm',
      message: 'setup postgres docker image',
      default: false,
      name: 'databaseImage',
      when: (answer: any) => !!answer?.databaseOptions.includes('postgres'),
    },
  ]);
}

export default { startPrompts };
