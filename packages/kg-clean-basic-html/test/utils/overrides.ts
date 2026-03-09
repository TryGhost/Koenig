// This file is required before any test is run

// Taken from the should wiki, this is how to make should global
// Should is a global in our eslint test config
import shouldLib from 'should';
shouldLib.noConflict();
shouldLib.extend();

// Sinon is a simple case
// Sinon is a global in our eslint test config
import sinonLib from 'sinon';

declare global {
    var should: typeof shouldLib;
    var sinon: typeof sinonLib;
}

Object.defineProperty(globalThis, 'should', {value: shouldLib, writable: true, configurable: true});
Object.defineProperty(globalThis, 'sinon', {value: sinonLib, writable: true, configurable: true});
