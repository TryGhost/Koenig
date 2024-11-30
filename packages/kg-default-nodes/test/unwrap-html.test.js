const chai = require('chai');
const expect = chai.expect;
const unwrapHtml = require("../lib/utils/unwrap-html");

describe('unwrapHtml', () => {
    it('should remove wrapping p tags', () => {
        const html = '<p>Test</p>';
        expect(unwrapHtml(html)).toBe('Test');
    });
    it('should not remove other tags', () => {
        const html = '<span>Test</span>';
        expect(unwrapHtml(html)).toBe('<span>Test</span>');
    });
    it('should remove wrapping p tags with attributes', () => {
        const html = '<p class="test" id="something">Test</p>';
        expect(unwrapHtml(html)).toBe('Test');
    });
    it('should not remove p tags that are not wrapping', () => {
        const html = '<p>Test</p><p>Test</p>';
        expect(unwrapHtml(html)).toBe('<p>Test</p><p>Test</p>');
    });
    it('should not remove p tags that are not wrapping with attributes', () => {
        const html = '<p class="test" id="something">Test</p><p class="test" id="something">Test</p>';
        expect(unwrapHtml(html)).toBe('<p class="test" id="something">Test</p><p class="test" id="something">Test</p>');
    });
    it('should not remove p tags if not outermost', () => {
        const html = '<div><p>Test</p></div>';
        expect(unwrapHtml(html)).toBe('<div><p>Test</p></div>');
    });
});