import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { PlatypusLanguageMetaData } from '../language/generated/module.js';
import { createPlatypusServices } from '../language/platypus-module.js';
import { extractAstNode } from './cli-util.js';
// import { generateJavaScript } from './generator.js';
import { generate } from './generator.js'
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createPlatypusServices(NodeFileSystem).Platypus;
    const model = await extractAstNode<Model>(fileName, services);
    // const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    const generatedResult = generate(model);
    console.log(chalk.green(`Generated successfully: ${generatedResult}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program.version(JSON.parse(packageContent).version);

    const fileExtensions = PlatypusLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program.parse(process.argv);
}
