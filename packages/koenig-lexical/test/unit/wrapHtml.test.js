import {wrapHtml} from '../../src/utils/wrapHtml';

describe('wrapHtml', function () {
    it('wraps a simple string in a p tag', function () {
        const html = 'Hello';
        const wrappedHtml = wrapHtml(html);
        expect(wrappedHtml).toEqual('<p>Hello</p>');
    });
    it('wraps a string with a br in a p tag', function () {
        const html = 'Hello<br>World';
        const wrappedHtml = wrapHtml(html);
        expect(wrappedHtml).toEqual('<p>Hello<br>World</p>');
    });
    it('does not add a p if it is already the outer tag', function () {
        const html = '<p>Hello</p>';
        const wrappedHtml = wrapHtml(html);
        expect(wrappedHtml).toEqual('<p>Hello</p>');
    });
    it('does not add a p if it is already the outer tag with attributes', function () {
        const html = '<p class="test">Hello</p>';
        const wrappedHtml = wrapHtml(html);
        expect(wrappedHtml).toEqual('<p class="test">Hello</p>');
    });
    it('wraps spans in p tags', function () {
        const html = '<span>Hello</span>';
        const wrappedHtml = wrapHtml(html);
        expect(wrappedHtml).toEqual('<p><span>Hello</span></p>');
    });
});