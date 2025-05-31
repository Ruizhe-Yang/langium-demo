// import type { ValidationAcceptor, ValidationChecks } from 'langium';
// import type { PlatypusAstType, Person } from './generated/ast.js';
// import type { PlatypusServices } from './platypus-module.js';

// /**
//  * Register custom validation checks.
//  */
// export function registerValidationChecks(services: PlatypusServices) {
//     const registry = services.validation.ValidationRegistry;
//     const validator = services.validation.PlatypusValidator;
//     const checks: ValidationChecks<PlatypusAstType> = {
//         Person: validator.checkPersonStartsWithCapital
//     };
//     registry.register(checks, validator);
// }

// /**
//  * Implementation of custom validations.
//  */
// export class PlatypusValidator {

//     checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
//         if (person.name) {
//             const firstChar = person.name.substring(0, 1);
//             if (firstChar.toUpperCase() !== firstChar) {
//                 accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
//             }
//         }
//     }

// }


import { AstNode, ValidationAcceptor, ValidationChecks } from 'langium';
import { isDef, isModel, PlatypusAstType } from './generated/ast.js';
import type { PlatypusServices } from './platypus-module.js';
// import { Registry } from 'vscode/monaco';

/**
 * Map AST node types to validation checks.
 */
// type PlatypusChecks = ValidationChecks<PlatypusAstType>

/**
 * Registry for validation checks.
 */
// export class registerValidationChecks extends ValidationRegistry {
    // constructor(services: PlatypusServices) {
    //     super(services);
export function registerValidationChecks(services: PlatypusServices) {
    const Registry = services.validation.ValidationRegistry;
    const validator = services.validation.PlatypusValidator;
    const checks: ValidationChecks<PlatypusAstType> = {
        Model: validator.checkUniqueDefs,
        Def:   validator.checkUniqueParams
    };
    Registry.register(checks, validator);
}

export class PlatypusValidator {

    checkUniqueDefs(model: AstNode, accept: ValidationAcceptor): void {
        if (!isModel(model)) {
            throw new Error('Retrieve a non-model in validation');
        }
        const reported = new Set();
        model.defs.forEach(d => {
            if (reported.has(d.name)) {
                accept('error',  `Def has non-unique name '${d.name}'.`,  {node: d, property: 'name'});
            }
            reported.add(d.name);
        });
    }

    checkUniqueParams(def: AstNode, accept: ValidationAcceptor): void {
        if (!isDef(def)) {
            throw new Error('Retrieve a non-def in validation');
        }
        const reported = new Set();
        def.params.forEach(p => {
            if (reported.has(p.name)) {
                accept('error', `Param ${p.name} is non-unique for Def '${def.name}'`, {node: p, property: 'name'});
            }
            reported.add(p.name);
        });
    }
}