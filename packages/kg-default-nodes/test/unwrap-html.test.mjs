import {expect} from 'chai';
import unwrapHtml from '../lib/utils/unwrap-html.mjs';
import {JSDOM} from 'jsdom';
import {beforeEach} from 'mocha';

const buildDOM = function () {
    return (new JSDOM()).window.document;
};

describe('unwrapHtml', () => {
    let dom;
    beforeEach(() => {
        dom = buildDOM();
    });
    it('should remove wrapping p tags', () => {
        const html = '<p>Test</p>';
        expect(unwrapHtml(html, dom)).equal('Test');
    });
    it('should not remove other tags', () => {
        const html = '<span>Test</span>';
        expect(unwrapHtml(html, dom)).equal('<span>Test</span>');
    });
    it('should remove wrapping p tags with attributes', () => {
        const html = '<p class="test" id="something">Test</p>';
        expect(unwrapHtml(html, dom)).equal('Test');
    });
    it('should not remove p tags that are not wrapping', () => {
        const html = '<p>Test</p><p>Test</p>';
        expect(unwrapHtml(html, dom)).equal('<p>Test</p><p>Test</p>');
    });
    it('should not remove p tags that are not wrapping with attributes', () => {
        const html = '<p class="test" id="something">Test</p><p class="test" id="something">Test</p>';
        expect(unwrapHtml(html, dom)).equal('<p class="test" id="something">Test</p><p class="test" id="something">Test</p>');
    });
    it('should not remove p tags if not outermost', () => {
        const html = '<div><p>Test</p></div>';
        expect(unwrapHtml(html, dom)).equal('<div><p>Test</p></div>');
    });
});
