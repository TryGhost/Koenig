import Prettier from '@prettier/sync';
import * as chai from 'chai';
import {minify} from 'html-minifier';

const expect = chai.expect;

should.Assertion.add('prettifyTo', function (this: Record<string, unknown>, str: string) {
    const minifiedExpected = minify(str, {collapseWhitespace: true, collapseInlineTagWhitespace: true});
    const expectedStr = Prettier.format(minifiedExpected, {parser: 'html'});

    this.params = {
        operator: 'to prettify to `' + str + '`',
        expected: expectedStr,
        showDiff: true
    };

    expect(this.obj).to.be.a('string');
    const minified = minify(this.obj as string, {collapseWhitespace: true, collapseInlineTagWhitespace: true});
    const result = Prettier.format(minified, {parser: 'html'});
    expect(result).to.equal(expectedStr);
}, false);
