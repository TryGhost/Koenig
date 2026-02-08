const {createDocument, dom, html} = require('../test-utils');
const {$getRoot} = require('lexical');
const {createHeadlessEditor} = require('@lexical/headless');
const {$generateNodesFromDOM} = require('@lexical/html');

const {ButtonNode, $createButtonNode, $isButtonNode} = require('../../');

const editorNodes = [ButtonNode];

describe('ButtonNode', function () {
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
            buttonText: 'click me',
            buttonUrl: 'http://blog.com/post1',
            alignment: 'center',
            buttonColor: 'accent',
            buttonTextColor: '#ffffff'
        };
        exportOptions = {
            dom
        };
    });

    it('matches node with $isButtonNode', editorTest(function () {
        const buttonNode = $createButtonNode(dataset);
        $isButtonNode(buttonNode).should.be.true();
    }));

    describe('data access', function () {
        it('has getters for all properties', editorTest(function () {
            const buttonNode = $createButtonNode(dataset);

            buttonNode.buttonUrl.should.equal(dataset.buttonUrl);
            buttonNode.buttonText.should.equal(dataset.buttonText);
            buttonNode.alignment.should.equal(dataset.alignment);
            buttonNode.buttonColor.should.equal(dataset.buttonColor);
            buttonNode.buttonTextColor.should.equal(dataset.buttonTextColor);
        }));

        it('has setters for all properties', editorTest(function () {
            const buttonNode = $createButtonNode();

            buttonNode.buttonUrl.should.equal('');
            buttonNode.buttonUrl = 'http://someblog.com/somepost';
            buttonNode.buttonUrl.should.equal('http://someblog.com/somepost');

            buttonNode.buttonText.should.equal('');
            buttonNode.buttonText = 'button text';
            buttonNode.buttonText.should.equal('button text');

            buttonNode.alignment.should.equal('center');
            buttonNode.alignment = 'left';
            buttonNode.alignment.should.equal('left');

            buttonNode.buttonColor.should.equal('accent');
            buttonNode.buttonColor = '#ff0000';
            buttonNode.buttonColor.should.equal('#ff0000');

            buttonNode.buttonTextColor.should.equal('#ffffff');
            buttonNode.buttonTextColor = '#000000';
            buttonNode.buttonTextColor.should.equal('#000000');
        }));

        it('has getDataset() convenience method', editorTest(function () {
            const buttonNode = $createButtonNode(dataset);
            const buttonNodeDataset = buttonNode.getDataset();

            buttonNodeDataset.should.deepEqual({
                ...dataset
            });
        }));
    });

    describe('getType', function () {
        it('returns the correct node type', editorTest(function () {
            ButtonNode.getType().should.equal('button');
        }));
    });

    describe('clone', function () {
        it('returns a copy of the current node', editorTest(function () {
            const buttonNode = $createButtonNode(dataset);
            const buttonNodeDataset = buttonNode.getDataset();
            const clone = ButtonNode.clone(buttonNode);
            const cloneDataset = clone.getDataset();

            cloneDataset.should.deepEqual({...buttonNodeDataset});
        }));
    });

    describe('urlTransformMap', function () {
        it('contains the expected URL mapping', editorTest(function () {
            ButtonNode.urlTransformMap.should.deepEqual({
                buttonUrl: 'url'
            });
        }));
    });

    describe('hasEditMode', function () {
        it('returns true', editorTest(function () {
            const buttonNode = $createButtonNode(dataset);
            buttonNode.hasEditMode().should.be.true();
        }));
    });

    describe('exportDOM', function () {
        it('creates a button card', editorTest(function () {
            const buttonNode = $createButtonNode(dataset);
            const {element} = buttonNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(html`<div class="kg-card kg-button-card kg-align-center"><a href="http://blog.com/post1" class="kg-btn kg-btn-accent">click me</a></div>`);
        }));

        it('renders for email target', editorTest(function () {
            const buttonNode = $createButtonNode(dataset);
            const options = {
                target: 'email'
            };
            const {element} = buttonNode.exportDOM({...exportOptions, ...options});
            const output = element.outerHTML;

            output.should.not.containEql('kg-card');
            output.should.containEql('<div class="btn btn-accent">');
            output.should.containEql('<table border="0" cellspacing="0" cellpadding="0"');
            output.should.containEql('<td align="center">');
        }));

        it('renders custom button colors', editorTest(function () {
            const customDataset = {
                ...dataset,
                buttonColor: '#ff0000',
                buttonTextColor: '#000000'
            };
            const buttonNode = $createButtonNode(customDataset);
            const {element} = buttonNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(html`<div class="kg-card kg-button-card kg-align-center"><a href="http://blog.com/post1" class="kg-btn" style="background-color: #ff0000; color: #000000">click me</a></div>`);
        }));

        it('renders for email target (emailCustomization)', editorTest(function () {
            const buttonNode = $createButtonNode(dataset);
            const options = {
                target: 'email',
                feature: {
                    emailCustomization: true
                }
            };
            const {element} = buttonNode.exportDOM({...exportOptions, ...options});
            const output = element.innerHTML;

            output.should.prettifyTo(html`
                <table border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td>
                                <table class="btn btn-accent" border="0" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <a href="http://blog.com/post1">click me</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `);
        }));

        it('renders for email target (emailCustomizationAlpha)', editorTest(function () {
            const buttonNode = $createButtonNode(dataset);
            const options = {
                target: 'email',
                feature: {
                    emailCustomizationAlpha: true
                }
            };
            const {element} = buttonNode.exportDOM({...exportOptions, ...options});
            const output = element.innerHTML;

            output.should.prettifyTo(html`
                <table border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td>
                                <table class="btn btn-accent" border="0" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <a href="http://blog.com/post1">click me</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `);
        }));

        it('renders custom colors for email targets', editorTest(function () {
            const customDataset = {
                ...dataset,
                buttonColor: '#ff0000',
                buttonTextColor: '#000000'
            };
            const buttonNode = $createButtonNode(customDataset);
            const options = {
                target: 'email',
                feature: {
                    emailCustomization: true
                }
            };
            const {element} = buttonNode.exportDOM({...exportOptions, ...options});
            const output = element.innerHTML;

            output.should.prettifyTo(html`
                <table border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td>
                                <table class="btn" border="0" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td align="center" style="background-color: #ff0000;">
                                                <a href="http://blog.com/post1" style="color: #000000;">click me</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `);
        }));

        it('renders an empty span with a missing buttonUrl', editorTest(function () {
            const buttonNode = $createButtonNode();
            const {element} = buttonNode.exportDOM(exportOptions);

            element.outerHTML.should.equal('<span></span>');
        }));
    });

    describe('exportJSON', function () {
        it('contains all data', editorTest(function () {
            const buttonNode = $createButtonNode(dataset);
            const json = buttonNode.exportJSON();

            json.should.deepEqual({
                type: 'button',
                version: 1,
                buttonUrl: dataset.buttonUrl,
                buttonText: dataset.buttonText,
                alignment: dataset.alignment,
                buttonColor: dataset.buttonColor,
                buttonTextColor: dataset.buttonTextColor
            });
        }));
    });

    describe('importJSON', function () {
        it('imports all data', function (done) {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'button',
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
                    const [buttonNode] = $getRoot().getChildren();

                    buttonNode.buttonUrl.should.equal(dataset.buttonUrl);
                    buttonNode.buttonText.should.equal(dataset.buttonText);
                    buttonNode.alignment.should.equal(dataset.alignment);
                    buttonNode.buttonColor.should.equal(dataset.buttonColor);
                    buttonNode.buttonTextColor.should.equal(dataset.buttonTextColor);

                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });

    describe('static properties', function () {
        it('getType', editorTest(function () {
            ButtonNode.getType().should.equal('button');
        }));

        it('urlTransformMap', editorTest(function () {
            ButtonNode.urlTransformMap.should.deepEqual({
                buttonUrl: 'url'
            });
        }));
    });

    describe('importDOM', function () {
        it('parses button card', editorTest(function () {
            const document = createDocument(html`
                <div class="kg-card kg-button-card kg-align-center"><a href="http://someblog.com/somepost" class="kg-btn kg-btn-accent">click me</a></div>
            `);
            const nodes = $generateNodesFromDOM(editor, document);
            nodes.length.should.equal(1);
            nodes[0].buttonUrl.should.equal('http://someblog.com/somepost');
            nodes[0].buttonText.should.equal('click me');
            nodes[0].alignment.should.equal('center');
            nodes[0].buttonColor.should.equal('accent');
            nodes[0].buttonTextColor.should.equal('#ffffff');
        }));

        it('preserves relative urls in content', editorTest(function () {
            const document = createDocument(html`
                <div class="kg-card kg-button-card kg-align-center">
                    <a href="#/portal/signup" class="kg-btn kg-btn-accent">Subscribe 1</a>
                </div>
            `);
            const nodes = $generateNodesFromDOM(editor, document);
            nodes.length.should.equal(1);
            nodes[0].buttonUrl.should.equal('#/portal/signup');
            nodes[0].buttonText.should.equal('Subscribe 1');
            nodes[0].alignment.should.equal('center');
            nodes[0].buttonColor.should.equal('accent');
            nodes[0].buttonTextColor.should.equal('#ffffff');
        }));

        it('parses custom button colors', editorTest(function () {
            const document = createDocument(html`
                <div class="kg-card kg-button-card kg-align-left">
                    <a href="http://someblog.com/somepost" class="kg-btn" style="background-color: rgb(255, 0, 0); color: rgb(0, 0, 0);">Subscribe 1</a>
                </div>
            `);
            const nodes = $generateNodesFromDOM(editor, document);
            nodes.length.should.equal(1);
            nodes[0].buttonUrl.should.equal('http://someblog.com/somepost');
            nodes[0].buttonText.should.equal('Subscribe 1');
            nodes[0].alignment.should.equal('left');
            nodes[0].buttonColor.should.equal('#ff0000');
            nodes[0].buttonTextColor.should.equal('#000000');
        }));
    });

    describe('getTextContent', function () {
        it('returns contents', editorTest(function () {
            const node = $createButtonNode();
            node.buttonText = 'Testing';
            node.buttonUrl = 'http://someblog.com/somepost';

            // button nodes don't have text content
            node.getTextContent().should.equal('');
        }));
    });
});
