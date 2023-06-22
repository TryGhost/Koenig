const {html} = require('../utils');
const {createHeadlessEditor} = require('@lexical/headless');
const {JSDOM} = require('jsdom');
const {$getRoot} = require('lexical');
const {HtmlNode, $createHtmlNode, $isHtmlNode} = require('../../');
const {$generateNodesFromDOM} = require('@lexical/html');

const editorNodes = [HtmlNode];

describe('HtmlNode', function () {
    let editor;
    let dataset;
    let exportOptions;

    // NOTE: all tests should use this function, without it you need manual
    // try/catch and done handling to avoid assertion failures not triggering
    // failed tests
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

        dataset = {
            html: '<p>Paragraph with:</p><ul><li>list</li><li>items</li></ul>'
        };

        exportOptions = {
            createDocument() {
                return (new JSDOM()).window.document;
            }
        };
    });

    it('matches node with $isImageNode', editorTest(function () {
        const htmlNode = $createHtmlNode(dataset);
        $isHtmlNode(htmlNode).should.be.true;
    }));

    describe('data access', function () {
        it('has getters for all properties', editorTest(function () {
            const htmlNode = $createHtmlNode(dataset);

            htmlNode.html.should.equal('<p>Paragraph with:</p><ul><li>list</li><li>items</li></ul>');
        }));

        it('has setters for all properties', editorTest(function () {
            const htmlNode = $createHtmlNode(dataset);

            htmlNode.html.should.equal('<p>Paragraph with:</p><ul><li>list</li><li>items</li></ul>');
            htmlNode.html = '<p>Paragraph 1</p><p>Paragraph 2</p>';
            htmlNode.html.should.equal('<p>Paragraph 1</p><p>Paragraph 2</p>');
        }));

        it('has getDataset() convenience method', editorTest(function () {
            const htmlNode = $createHtmlNode(dataset);
            const htmlNodeDataset = htmlNode.getDataset();

            htmlNodeDataset.should.deepEqual({
                ...dataset
            });
        }));

        it('has isEmpty() convenience method', editorTest(function () {
            const htmlNode = $createHtmlNode(dataset);

            htmlNode.isEmpty().should.be.false;
            htmlNode.html = '';
            htmlNode.isEmpty().should.be.true;
        }));
    });

    describe('isEmpty()', function () {
        it('returns true if markdown is empty', editorTest(function () {
            const htmlNode = $createHtmlNode(dataset);

            htmlNode.isEmpty().should.be.false;
            htmlNode.markdown = '';
            htmlNode.isEmpty().should.be.true;
        }));
    });

    describe('getType', function () {
        it('returns the correct node type', editorTest(function () {
            HtmlNode.getType().should.equal('html');
        }));
    });

    describe('clone', function () {
        it('returns a copy of the current node', editorTest(function () {
            const htmlNode = $createHtmlNode(dataset);
            const htmlNodeDataset = htmlNode.getDataset();
            const clone = HtmlNode.clone(htmlNode);
            const cloneDataset = clone.getDataset();

            cloneDataset.should.deepEqual({...htmlNodeDataset});
        }));
    });

    describe('urlTransformMap', function () {
        it('contains the expected URL mapping', editorTest(function () {
            HtmlNode.urlTransformMap.should.deepEqual({
                html: 'html'
            });
        }));
    });

    describe('hasEditMode', function () {
        it('returns true', editorTest(function () {
            const htmlNode = $createHtmlNode(dataset);
            htmlNode.hasEditMode().should.be.true;
        }));
    });

    describe('exportDOM', function () {
        it('creates a html card', editorTest(function () {
            const htmlNode = $createHtmlNode(dataset);
            const {element, type} = htmlNode.exportDOM(exportOptions);
            type.should.equal('value');
            element.value.should.prettifyTo(html`
                <p>Paragraph with:</p>
                <ul>
                    <li>list</li>
                    <li>items</li>
                </ul>
            `);
        }));

        it('renders an empty div with missing html', editorTest(function () {
            const htmlNode = $createHtmlNode();
            const {element, type} = htmlNode.exportDOM(exportOptions);
            type.should.equal('inner');

            element.outerHTML.should.equal('<span></span>');
        }));

        it('renders unclosed tags', editorTest(function () {
            const htmlNode = $createHtmlNode({html: '<div style="color:red">'});
            const {element, type} = htmlNode.exportDOM(exportOptions);
            type.should.equal('value');

            // do not prettify, it will add a closing tag to the compared string causing a false pass
            element.value.should.equal('<div style="color:red">');
        }));
    });

    describe('importDOM', function () {
        it('parses a html node', editorTest(function () {
            const dom = (new JSDOM(html`
                <span><!--kg-card-begin: html--><p>here's html</p><!--kg-card-end: html--></span>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);
            nodes[0].should.be.instanceof(HtmlNode);
        }));

        it('parses html table', editorTest(function () {
            const dom = (new JSDOM(html`
                <table style="float:right"><tr><th>Month</th><th>Savings</th></tr><tr><td>January</td><td>$100</td></tr><tr><td>February</td><td>$80</td></tr></table>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);
            nodes[0].should.be.instanceof(HtmlNode);
        }));

        it('parses table nested in another table', editorTest(function () {
            const dom = (new JSDOM(html`
                <table id="table1"><tr><th>title1</th><th>title2</th><th>title3</th></tr><tr><td id="nested"><table id="table2"><tr><td>cell1</td><td>cell2</td><td>cell3</td></tr></table></td><td>cell2</td><td>cell3</td></tr><tr><td>cell4</td><td>cell5</td><td>cell6</td></tr></table>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);
            nodes[0].should.be.instanceof(HtmlNode);
        }));
    });

    describe('exportJSON', function () {
        it('contains all data', editorTest(function () {
            const htmlNode = $createHtmlNode(dataset);
            const json = htmlNode.exportJSON();

            json.should.deepEqual({
                type: 'html',
                version: 1,
                html: '<p>Paragraph with:</p><ul><li>list</li><li>items</li></ul>'
            });
        }));
    });

    describe('importJSON', function () {
        it('imports all data', function (done) {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'html',
                        ...dataset
                    }],
                    direction: null,
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            });

            const editorState = editor.parseEditorState(serializedState);
            editor.setEditorState(editorState);

            editor.getEditorState().read(() => {
                try {
                    const [htmlNode] = $getRoot().getChildren();

                    htmlNode.html.should.equal('<p>Paragraph with:</p><ul><li>list</li><li>items</li></ul>');

                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });

    describe('getTextContent', function () {
        it('returns contents', editorTest(function () {
            const node = $createHtmlNode();
            node.getTextContent().should.equal('');

            node.html = '<script>const test = true;</script>';

            node.getTextContent().should.equal('<script>const test = true;</script>\n\n');
        }));
    });
});
