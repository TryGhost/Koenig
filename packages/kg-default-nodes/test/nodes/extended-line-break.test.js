const {createDocument, dom, html} = require('../utils');
const {createHeadlessEditor} = require('@lexical/headless');
const {$generateNodesFromDOM} = require('@lexical/html');
const {ExtendedLineBreakNode} = require('../../');
const {_} = require('lodash');

const editorNodes = [ExtendedLineBreakNode];

describe('ExtendedLineBreakNode', function () {
    let editor;

    const editorTest = testFn => function (done) {
        editor.update(() => {
            try {
                testFn();
                done();
            } catch (e) {
                done(e);
            }
        });
    };

    beforeEach(function () {
        editor = createHeadlessEditor({nodes: editorNodes});
    });

    describe('importDOM', function () {
        it('(non GDoc) default conversion between text', editorTest(function () {
            const htmlString = 'Before<br>After';
            const document = createDocument(htmlString);
            const nodes = $generateNodesFromDOM(editor, document);

            should.equal(nodes.length, 3);
            should.equal(nodes[0].getType(), 'text');
            should.equal(nodes[1].getType(), 'linebreak');
            should.equal(nodes[2].getType(), 'text');
        }));

        it('(non GDoc) default conversion between paragraphs', editorTest(function () {
            const htmlString = '<p>Before</p><br><p>After</p>';
            const document = createDocument(htmlString);
            const nodes = $generateNodesFromDOM(editor, document);

            should.equal(nodes.length, 3);

            should.equal(nodes[0].getType(), 'paragraph');
            should.equal(nodes[0].getChildren().length, 1);
            should.equal(nodes[0].getChildren()[0].getType(), 'text');
            should.equal(nodes[0].getChildren()[0].getTextContent(), 'Before');

            should.equal(nodes[1].getType(), 'linebreak');

            should.equal(nodes[2].getType(), 'paragraph');
            should.equal(nodes[2].getChildren().length, 1);
            should.equal(nodes[2].getChildren()[0].getType(), 'text');
            should.equal(nodes[2].getChildren()[0].getTextContent(), 'After');
        }));

        it('(GDoc) default conversion for breaks inside paragraphs', editorTest(function () {
            const htmlString = '<div id="docs-internal-guid-1234"><p>Before<br>After</p></div>';
            const document = createDocument(htmlString);
            const nodes = $generateNodesFromDOM(editor, document);

            should.equal(nodes.length, 1);
            should.equal(nodes[0].getType(), 'paragraph');
            should.equal(nodes[0].getChildren().length, 3);
            should.equal(nodes[0].getChildren()[0].getType(), 'text');
            should.equal(nodes[0].getChildren()[1].getType(), 'linebreak');
            should.equal(nodes[0].getChildren()[2].getType(), 'text');
        }));

        it('(GDoc) no conversion for breaks between paragraphs', editorTest(function () {
            const htmlString = '<div id="docs-internal-guid-1234"><p>Before</p><br><p>After</p></div>';
            const document = createDocument(htmlString);
            const nodes = $generateNodesFromDOM(editor, document);

            should.equal(nodes.length, 2);
            should.equal(nodes[0].getType(), 'paragraph');
            should.equal(nodes[0].getChildren().length, 1);
            should.equal(nodes[0].getChildren()[0].getType(), 'text');
            should.equal(nodes[0].getChildren()[0].getTextContent(), 'Before');

            should.equal(nodes[1].getType(), 'paragraph');
            should.equal(nodes[1].getChildren().length, 1);
            should.equal(nodes[1].getChildren()[0].getType(), 'text');
            should.equal(nodes[1].getChildren()[0].getTextContent(), 'After');
        }));
    });
});
