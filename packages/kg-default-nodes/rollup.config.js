/* eslint-env node */
import pkg from './package.json' assert {type: 'json'};

const dependencies = Object.keys(pkg.dependencies);

export default [
    // Node build.
    // No transpilation or bundling other than converstion from es modules to cjs
    {
        input: pkg.exports.import,
        output: {
            file: pkg.exports.require,
            format: 'cjs'
        },
        external: dependencies
    }
];
