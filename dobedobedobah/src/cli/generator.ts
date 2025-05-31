import type { Model } from '../language/generated/ast.js';
// import { CompositeGeneratorNode, expandToNode, joinToNode, NL, toString } from 'langium/generate';
// import * as fs from 'node:fs';
// import * as path from 'node:path';
// import { extractDestinationAndName } from './cli-util.js';

// imports
import { createPlatypusServices } from '../language/platypus-module.js';
import { NodeFileSystem } from 'langium/node';

export function generate(model: Model): string{
    // console.dir(model);
    // const stmtsLength: number = model.stmts.length;
    // return stmtsLength.toString();
    const services = createPlatypusServices(NodeFileSystem).Platypus;
    const json = services.serializer.JsonSerializer.serialize(model);
    return json;
}

// export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
//     const data = extractDestinationAndName(filePath, destination);
//     const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

//     // const fileNode = expandToNode`
//     //     "use strict";

//     //     ${joinToNode(model.greetings, greeting => `console.log('Hello, ${greeting.person.ref?.name}!');`, { appendNewLineIfNotEmpty: true })}
//     // `.appendNewLineIfNotEmpty();
//     const fileNode = new CompositeGeneratorNode();
//     fileNode.append('"use strict";"', NL, NL);

//     if (!fs.existsSync(data.destination)) {
//         fs.mkdirSync(data.destination, { recursive: true });
//     }
//     fs.writeFileSync(generatedFilePath, toString(fileNode));
//     return generatedFilePath;
// }
