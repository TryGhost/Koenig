const {createHeadlessEditor} = require('@lexical/headless');
const {html} = require('../utils');
const {JSDOM} = require('jsdom');
const {$getRoot} = require('lexical');
const {SignupNode, $createSignupNode, $isSignupNode} = require('../../');

const editorNodes = [SignupNode];

describe('SignupNode', function () {
    let editor;
    let dataset;
    let exportOptions;

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

    const checkGetters = (signupNode, data) => {
        signupNode.getBackgroundImageSrc().should.equal(data.backgroundImageSrc);
        signupNode.getButtonText().should.equal(data.buttonText);
        signupNode.getDisclaimer().should.equal(data.disclaimer);
        signupNode.getHeader().should.equal(data.header);
        signupNode.getSubheader().should.equal(data.subheader);
        signupNode.getStyle().should.equal(data.style);
    };

    beforeEach(function () {
        editor = createHeadlessEditor({nodes: editorNodes});

        dataset = {
            backgroundImageSrc: 'https://example.com/image.jpg',
            buttonText: 'Button',
            disclaimer: 'Disclaimer',
            header: 'Header',
            subheader: 'Subheader',
            style: 'image'
        };

        exportOptions = {
            createDocument() {
                return (new JSDOM()).window.document;
            }
        };
    });

    it('matches node with $isSignupNode', editorTest(function () {
        const signupNode = $createSignupNode(dataset);
        $isSignupNode(signupNode).should.be.true;
    }));

    describe('clone', function () {
        it('clones the node', editorTest(function () {
            const signupNode = $createSignupNode(dataset);
            const clonedSignupNode = SignupNode.clone(signupNode);
            $isSignupNode(clonedSignupNode).should.be.true;
            clonedSignupNode.should.not.equal(signupNode);
            checkGetters(signupNode, dataset);
        }));
    });

    describe('hasEditMode', function () {
        it('returns true', editorTest(function () {
            const signupNode = $createSignupNode(dataset);
            signupNode.hasEditMode().should.be.true;
        }));
    });

    describe('data access', function () {
        it('has getters for all properties', editorTest(function () {
            const signupNode = $createSignupNode(dataset);
            checkGetters(signupNode, dataset);
        }));

        it('has setters for all properties', editorTest(function () {
            const node = $createSignupNode(dataset);
            node.setBackgroundImageSrc('https://example.com/image2.jpg');
            node.getBackgroundImageSrc().should.equal('https://example.com/image2.jpg');
            node.setButtonText('This is the new button text');
            node.getButtonText().should.equal('This is the new button text');
            node.setDisclaimer('This is the new disclaimer');
            node.getDisclaimer().should.equal('This is the new disclaimer');
            node.setHeader('This is the new header');
            node.getHeader().should.equal('This is the new header');
            node.setSubheader('This is the new subheader');
            node.getSubheader().should.equal('This is the new subheader');
            node.setStyle('light');
            node.getStyle().should.equal('light');
        }));

        it('has getDataset() method', editorTest(function () {
            const signupNode = $createSignupNode(dataset);
            const nodeData = signupNode.getDataset();
            nodeData.should.deepEqual(dataset);
        }));

        it('has isEmpty() method', editorTest(function () {
            const signupNode = $createSignupNode(dataset);

            signupNode.isEmpty().should.be.false;
            signupNode.setBackgroundImageSrc('');
            signupNode.isEmpty().should.be.false;
            signupNode.setHeader('');
            signupNode.isEmpty().should.be.false;
            signupNode.setSubheader('');
            signupNode.isEmpty().should.be.false;
            signupNode.setDisclaimer('');
            signupNode.isEmpty().should.be.false;
            signupNode.setButtonText('');
            signupNode.isEmpty().should.be.true;
        }));
    });

    describe('exportDOM', function () {
        it('creates signup element', editorTest(function () {
            const signupNode = $createSignupNode();
            const {element} = signupNode.exportDOM(exportOptions);
            element.should.prettifyTo(html`
            <form data-members-form=""><input data-members-email="" type="email" required=""><button type="submit">Continue</button></form>
            `);
        }));
    });

    describe('exportJSON', function () {
        it('contains all data', editorTest(function () {
            const signupNode = $createSignupNode(dataset);
            const json = signupNode.exportJSON();

            json.should.deepEqual({
                type: 'signup',
                version: 1,
                style: dataset.style,
                backgroundImageSrc: dataset.backgroundImageSrc,
                header: dataset.header,
                subheader: dataset.subheader,
                disclaimer: dataset.disclaimer,
                buttonText: dataset.buttonText
            });
        }));
    });

    describe('importJSON', function () {
        it('imports all data', function (done) {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'signup',
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
                    const [signupNode] = $getRoot().getChildren();

                    $isSignupNode(signupNode).should.be.true;
                    checkGetters(signupNode, dataset);

                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });
});
