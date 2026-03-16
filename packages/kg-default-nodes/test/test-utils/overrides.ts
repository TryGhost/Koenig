// This file is required before any test is run

// Taken from the should wiki, this is how to make should global
// Should is a global in our eslint test config
import should from 'should';
(globalThis as Record<string, unknown>).should = should.noConflict();
should.extend();

// Sinon is a simple case
// Sinon is a global in our eslint test config
import sinon from 'sinon';
(globalThis as Record<string, unknown>).sinon = sinon;
