const {createDocument, dom, html} = require('../test-utils');
const {$getRoot} = require('lexical');
const {createHeadlessEditor} = require('@lexical/headless');
const {$generateNodesFromDOM} = require('@lexical/html');

const {CallToActionNode, $isCallToActionNode, $createCallToActionNode} = require('../../');

const editorNodes = [CallToActionNode];

describe('CallToActionNode', function () {
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
            layout: 'immersive',
            textValue: 'This is a cool advertisement',
            showButton: true,
            buttonText: 'click me',
            buttonUrl: 'http://blog.com/post1',
            hasSponsorLabel: true,
            hasBackground: true,
            backgroundColor: '#123456',
            hasImage: true,
            imageUrl: 'http://blog.com/image1.jpg'
        };
        exportOptions = {
            dom
        };
    });

    it('matches node with $isCallToActionNode', editorTest(function () {
        const callToActionNode = new CallToActionNode(dataset);
        $isCallToActionNode(callToActionNode).should.be.true();
    }));

    describe('data access', function () {
        it('has getters for all properties', editorTest(function () {
            const callToActionNode = new CallToActionNode(dataset);

            callToActionNode.layout.should.equal(dataset.layout);
            callToActionNode.textValue.should.equal(dataset.textValue);
            callToActionNode.showButton.should.equal(dataset.showButton);
            callToActionNode.buttonText.should.equal(dataset.buttonText);
            callToActionNode.buttonUrl.should.equal(dataset.buttonUrl);
            callToActionNode.hasSponsorLabel.should.equal(dataset.hasSponsorLabel);
            callToActionNode.hasBackground.should.equal(dataset.hasBackground);
            callToActionNode.hasImage.should.equal(dataset.hasImage);
            callToActionNode.imageUrl.should.equal(dataset.imageUrl);
        }));

        it('has setters for all properties', editorTest(function () {
            const callToActionNode = new CallToActionNode();

            callToActionNode.layout.should.equal('immersive');
            callToActionNode.layout = 'compact';
            callToActionNode.layout.should.equal('compact');

            callToActionNode.textValue.should.equal('');
            callToActionNode.textValue = 'This is a cool advertisement';
            callToActionNode.textValue.should.equal('This is a cool advertisement');

            callToActionNode.showButton.should.equal(false);
            callToActionNode.showButton = true;
            callToActionNode.showButton.should.equal(true);

            callToActionNode.buttonText.should.equal('');
            callToActionNode.buttonText = 'click me';
            callToActionNode.buttonText.should.equal('click me');

            callToActionNode.buttonUrl.should.equal('');
            callToActionNode.buttonUrl = 'http://blog.com/post1';
            callToActionNode.buttonUrl.should.equal('http://blog.com/post1');

            callToActionNode.hasSponsorLabel.should.equal(false);
            callToActionNode.hasSponsorLabel = true;

            callToActionNode.hasBackground.should.equal(false);
            callToActionNode.hasBackground = true;

            callToActionNode.hasImage.should.equal(false);
            callToActionNode.hasImage = true;

            callToActionNode.imageUrl.should.equal('');
            callToActionNode.imageUrl = 'http://blog.com/image1.jpg';
        }));

        it('has getDataset() convenience method', editorTest(function () {
            const callToActionNode = new CallToActionNode(dataset);
            const callToActionNodeDataset = callToActionNode.getDataset();

            callToActionNodeDataset.should.deepEqual({
                ...dataset
            });
        }));
    });

    describe('getType', function () {
        it('returns the correct node type', editorTest(function () {
            CallToActionNode.getType().should.equal('call-to-action');
        }));
    });

    describe('clone', function () {
        it('returns a copy of the current node', editorTest(function () {
            const callToActionNode = new CallToActionNode(dataset);
            const callToActionNodeDataset = callToActionNode.getDataset();
            const clone = CallToActionNode.clone(callToActionNode);
            const cloneDataset = clone.getDataset();

            cloneDataset.should.deepEqual({...callToActionNodeDataset});
        }));
    });

    describe('urlTransformMap', function () {
        // not yet implemented
    });

    describe('hasEditMode', function () {
        it('returns true', editorTest(function () {
            const callToActionNode = new CallToActionNode(dataset);
            callToActionNode.hasEditMode().should.be.true();
        }));
    });

    describe('exportDOM', function () {
        // not yet implemented
    });

    describe('exportJSON', function () {
        // not yet implemented
    });

    describe('importJSON', function () {
        // not yet implemented
    });

    describe('static properties', function () {
        it('getType', editorTest(function () {
            CallToActionNode.getType().should.equal('call-to-action');
        }));

        it('urlTransformMap', editorTest(function () {
            // not yet implemented
        }));
    });

    describe('importDom', function () {
        // not yet implemented
    });

    describe('getTextContent', function () {
        // not yet implemented
    });
});
