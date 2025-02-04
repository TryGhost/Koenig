const {dom} = require('../test-utils');

const {createHeadlessEditor} = require('@lexical/headless');

const {CallToActionNode, $isCallToActionNode} = require('../../');

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
            layout: 'minimal',
            textValue: 'This is a cool advertisement',
            showButton: true,
            buttonText: 'click me',
            buttonUrl: 'http://blog.com/post1',
            buttonColor: 'none',
            buttonTextColor: 'none',
            hasSponsorLabel: true,
            backgroundColor: 'none',
            hasImage: true,
            imageUrl: 'http://blog.com/image1.jpg'
        };
        exportOptions = {
            exportFormat: 'html',
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
            callToActionNode.buttonColor.should.equal(dataset.buttonColor);
            callToActionNode.buttonTextColor.should.equal(dataset.buttonTextColor);
            callToActionNode.hasSponsorLabel.should.equal(dataset.hasSponsorLabel);
            callToActionNode.backgroundColor.should.equal(dataset.backgroundColor);
            callToActionNode.hasImage.should.equal(dataset.hasImage);
            callToActionNode.imageUrl.should.equal(dataset.imageUrl);
        }));

        it('has setters for all properties', editorTest(function () {
            const callToActionNode = new CallToActionNode();

            callToActionNode.layout.should.equal('minimal');
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

            callToActionNode.buttonColor.should.equal('');
            callToActionNode.buttonColor = 'red';
            callToActionNode.buttonColor.should.equal('red');

            callToActionNode.buttonTextColor.should.equal('');
            callToActionNode.buttonTextColor = 'black';
            callToActionNode.buttonTextColor.should.equal('black');

            callToActionNode.hasSponsorLabel.should.equal(true);
            callToActionNode.hasSponsorLabel = false;
            callToActionNode.hasSponsorLabel.should.equal(false);

            callToActionNode.backgroundColor.should.equal('grey');
            callToActionNode.backgroundColor = '#654321';
            callToActionNode.backgroundColor.should.equal('#654321');

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

    describe.only('exportDOM', function () {
        it('has all data attributes in Web', editorTest(function () {
            dataset = {
                backgroundColor: 'green',
                buttonColor: '#F0F0F0',
                buttonText: 'Get access now',
                buttonTextColor: '#000000',
                buttonUrl: 'http://someblog.com/somepost',
                hasImage: true,
                hasSponsorLabel: true,
                imageUrl: '/content/images/2022/11/koenig-lexical.jpg',
                layout: 'minimal',
                showButton: true,
                textValue: '<p><span style="white-space: pre-wrap;">This is a new CTA Card.</span></p>'
            };
            const callToActionNode = new CallToActionNode(dataset);
            const {element} = callToActionNode.exportDOM(exportOptions);

            const html = element.outerHTML.toString();
            html.should.containEql('data-layout="minimal"');
            html.should.containEql('background-color: green');
            html.should.containEql('background-color: #F0F0F0');
            html.should.containEql('Get access now');
            html.should.containEql('http://someblog.com/somepost');
            html.should.containEql('/content/images/2022/11/koenig-lexical.jpg');// because hasImage is true
            html.should.containEql('This is a new CTA Card.');
            html.should.containEql('Sponsored'); // because hasSponsorLabel is true
            html.should.containEql('cta-card');
        }));

        it('has all data attributes in Email', editorTest(function () {
            exportOptions.target = 'email';
            dataset = {
                backgroundColor: 'green',
                buttonColor: '#F0F0F0',
                buttonText: 'Get access now',
                buttonTextColor: '#000000',
                buttonUrl: 'http://someblog.com/somepost',
                hasImage: true,
                hasSponsorLabel: true,
                imageUrl: '/content/images/2022/11/koenig-lexical.jpg',
                layout: 'minimal',
                showButton: true,
                textValue: '<p><span style="white-space: pre-wrap;">This is a new CTA Card via email.</span></p>'
            };
            const callToActionNode = new CallToActionNode(dataset);
            const {element} = callToActionNode.exportDOM(exportOptions);

            const html = element.outerHTML.toString();
            html.should.containEql('cta-card-email');
            html.should.containEql('background-color: green');
            html.should.containEql('background-color: #F0F0F0');
            html.should.containEql('Get access now');
            html.should.containEql('http://someblog.com/somepost');
            html.should.containEql('/content/images/2022/11/koenig-lexical.jpg'); // because hasImage is true
            html.should.containEql('This is a new CTA Card via email.');
        }));
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
