// This file is required before any test is run

// Taken from the should wiki, this is how to make should global
// Should is a global in our eslint test config
import * as should from 'should'; // eslint-ignore-line
Object.defineProperty(global, 'should', {
    value: should
});

// Sinon is a simple case
// Sinon is a global in our eslint test config

import sinon from 'sinon';
Object.defineProperty(global, 'sinon', {
    value: sinon
});
