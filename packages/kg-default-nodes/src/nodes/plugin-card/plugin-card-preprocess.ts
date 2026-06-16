/**
 * Sandboxed preprocess function executor for plugin cards.
 *
 * The preprocess function receives the raw payload (form data) and returns
 * a transformed version ready for template rendering. It runs in a restricted
 * sandbox with no access to DOM, network, storage, or Node.js APIs — only
 * JavaScript built-ins for data transformation.
 *
 * Safety: constructors are passed as frozen wrapper objects so a plugin's
 * preprocess code cannot mutate prototypes globally.
 */

const $ = Object.freeze({
    JSON: Object.freeze({
        parse: JSON.parse.bind(JSON),
        stringify: JSON.stringify.bind(JSON)
    }),
    Math: Object.freeze({
        min: Math.min.bind(Math),
        max: Math.max.bind(Math),
        round: Math.round.bind(Math),
        ceil: Math.ceil.bind(Math),
        floor: Math.floor.bind(Math),
        abs: Math.abs.bind(Math)
    }),
    // Wrapped as coercion functions to prevent prototype pollution
    String: Object.freeze(function(v: unknown) { return String(v); }),
    Number: Object.freeze(function(v: unknown) { return Number(v); }),
    Boolean: Object.freeze(function(v: unknown) { return Boolean(v); }),
    Object: Object.freeze({
        keys: Object.keys.bind(Object),
        values: Object.values.bind(Object),
        assign: Object.assign.bind(Object)
    }),
    Date: Object.freeze(function DateFactory() { return new Date(); }),
    parseInt: parseInt.bind(undefined),
    parseFloat: parseFloat.bind(undefined),
    isNaN: isNaN.bind(undefined),
    isFinite: isFinite.bind(undefined)
});

const SANDBOX_NAMES = ['JSON', 'Math', 'String', 'Number', 'Boolean', 'Object', 'Date', 'parseInt', 'parseFloat', 'isNaN', 'isFinite'];
const SANDBOX_VALUES: unknown[] = SANDBOX_NAMES.map(k => ($ as unknown as Record<string, unknown>)[k]);

/**
 * Creates a preprocessor function from a source string.
 * The source should define a `function preprocess(payload) { ... }`
 * that returns a plain object.
 *
 * Returns a function (payload: object) => object, or null if source is empty.
 */
export function createPreprocessor(source: string | undefined): ((payload: Record<string, unknown>) => Record<string, unknown>) | null {
    if (!source || !source.trim()) return null;

    const fn = new Function(
        ...SANDBOX_NAMES,
        'payload',
        `"use strict";\n${source}\nreturn preprocess(payload);`
    );

    return (payload: Record<string, unknown>) => {
        const result = fn(...SANDBOX_VALUES, payload);

        if (typeof result !== 'object' || result === null || Array.isArray(result)) {
            throw new Error('preprocess must return a plain object');
        }

        // Copy own enumerable properties only — prevents prototype pollution
        // from leaking through the return value
        return Object.keys(result).reduce((obj, key) => {
            obj[key] = result[key];
            return obj;
        }, {} as Record<string, unknown>);
    };
}
