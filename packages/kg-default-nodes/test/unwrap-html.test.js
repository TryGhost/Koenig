const chai = require('chai');
const expect = chai.expect;
const unwrapHtml = require("../lib/utils/unwrap-html");
require('./utils');

const {JSDOM} = require('jsdom');
const DOMParser = require('@tryghost/mobiledoc-kit/dist/commonjs/mobiledoc-kit/parsers/dom').default;

const buildDOM = function () {
    return (new JSDOM(`<!DOCTYPE html><html><body></body></html>`)).window.document;
};

describe('unwrapHtml', () => {
    before(() => {
        global.document = buildDOM();
    })
    it('should remove wrapping p tags', () => {
        const html = '<p>Test</p>';
        expect(unwrapHtml(html)).equal('Test');
    });
    it('should not remove other tags', () => {
        const html = '<span>Test</span>';
        expect(unwrapHtml(html)).equal('<span>Test</span>');
    });
    it('should remove wrapping p tags with attributes', () => {
        const html = '<p class="test" id="something">Test</p>';
        expect(unwrapHtml(html)).equal('Test');
    });
    it('should not remove p tags that are not wrapping', () => {
        const html = '<p>Test</p><p>Test</p>';
        expect(unwrapHtml(html)).equal('<p>Test</p><p>Test</p>');
    });
    it('should not remove p tags that are not wrapping with attributes', () => {
        const html = '<p class="test" id="something">Test</p><p class="test" id="something">Test</p>';
        expect(unwrapHtml(html)).equal('<p class="test" id="something">Test</p><p class="test" id="something">Test</p>');
    });
    it('should not remove p tags if not outermost', () => {
        const html = '<div><p>Test</p></div>';
        expect(unwrapHtml(html)).equal('<div><p>Test</p></div>');
    });
});