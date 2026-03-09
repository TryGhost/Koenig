import should from 'should';
import sinon from 'sinon';

Object.defineProperty(globalThis, 'should', {value: should.noConflict(), writable: true, configurable: true});
should.extend();

Object.defineProperty(globalThis, 'sinon', {value: sinon, writable: true, configurable: true});
