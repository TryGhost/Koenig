const {createHeadlessEditor} = require('@lexical/headless');
const {$getRoot} = require('lexical');
const {dom, createDocument} = require('../test-utils');
const {CallToActionNode, $isCallToActionNode, utils, $createCallToActionNode} = require('../../');
const {$generateNodesFromDOM} = require('@lexical/html');
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
            sponsorLabel: '<p><span style="white-space: pre-wrap;">SPONSORED</span></p>',
            showButton: true,
            buttonText: 'click me',
            buttonUrl: 'http://blog.com/post1',
            buttonColor: 'none',
            buttonTextColor: 'none',
            hasSponsorLabel: true,
            backgroundColor: 'none',
            hasImage: true,
            imageUrl: 'http://blog.com/image1.jpg',
            imageWidth: 200,
            imageHeight: 100,
            href: ''
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

    it('can match node with CallToActionNode', editorTest(function () {
        const node = $createCallToActionNode(dataset);
        $isCallToActionNode(node).should.be.true();
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
            callToActionNode.sponsorLabel.should.equal(dataset.sponsorLabel);
            callToActionNode.backgroundColor.should.equal(dataset.backgroundColor);
            callToActionNode.hasImage.should.equal(dataset.hasImage);
            callToActionNode.imageUrl.should.equal(dataset.imageUrl);
            callToActionNode.visibility.should.deepEqual(utils.visibility.buildDefaultVisibility());
            callToActionNode.href.should.equal(dataset.href);
            callToActionNode.imageHeight.should.equal(dataset.imageHeight);
            callToActionNode.imageWidth.should.equal(dataset.imageWidth);
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

            callToActionNode.sponsorLabel.should.equal('<p><span style="white-space: pre-wrap;">SPONSORED</span></p>');
            callToActionNode.sponsorLabel = 'This post is brought to you by our sponsors';
            callToActionNode.sponsorLabel.should.equal('This post is brought to you by our sponsors');

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
            callToActionNode.hasImage.should.equal(true);

            callToActionNode.imageUrl.should.equal('');
            callToActionNode.imageUrl = 'http://blog.com/image1.jpg';
            callToActionNode.imageUrl.should.equal('http://blog.com/image1.jpg');

            should(callToActionNode.imageHeight).be.null();
            callToActionNode.imageHeight = 100;
            callToActionNode.imageHeight.should.equal(100);

            should(callToActionNode.imageWidth).be.null();
            callToActionNode.imageWidth = 200;
            callToActionNode.imageWidth.should.equal(200);

            callToActionNode.href.should.equal('');
            callToActionNode.href = 'http://blog.com/post1';
            callToActionNode.href.should.equal('http://blog.com/post1');

            callToActionNode.visibility.should.deepEqual(utils.visibility.buildDefaultVisibility());
            callToActionNode.visibility = {
                web: {
                    nonMember: false,
                    memberSegment: ''
                },
                email: {
                    memberSegment: ''
                }
            };
            callToActionNode.visibility.should.deepEqual({
                web: {
                    nonMember: false,
                    memberSegment: ''
                },
                email: {
                    memberSegment: ''
                }
            });
        }));

        it('has getDataset() convenience method', editorTest(function () {
            const callToActionNode = new CallToActionNode(dataset);
            const callToActionNodeDataset = callToActionNode.getDataset();

            callToActionNodeDataset.should.deepEqual({
                ...dataset,
                ...{visibility: utils.visibility.buildDefaultVisibility()}
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
        it('has all data attributes in Web', editorTest(function () {
            dataset = {
                backgroundColor: 'green',
                buttonColor: '#F0F0F0',
                buttonText: 'Get access now',
                buttonTextColor: '#000000',
                buttonUrl: 'http://someblog.com/somepost',
                hasImage: true,
                hasSponsorLabel: true,
                sponsorLabel: '<p>Sponsored by</p>',
                imageUrl: '/content/images/2022/11/koenig-lexical.jpg',
                layout: 'minimal',
                showButton: true,
                textValue: '<p><span style="white-space: pre-wrap;">This is a new CTA Card.</span></p>'
            };

            const callToActionNode = new CallToActionNode(dataset);
            const {element} = callToActionNode.exportDOM(exportOptions);

            const htmlElement = element.outerHTML.toString();
            htmlElement.should.containEql('data-layout="minimal"');
            htmlElement.should.containEql('kg-cta-bg-green');
            htmlElement.should.containEql('background-color: #F0F0F0');
            htmlElement.should.containEql('Get access now');
            htmlElement.should.containEql('http://someblog.com/somepost');
            htmlElement.should.containEql('/content/images/2022/11/koenig-lexical.jpg');// because hasImage is true
            htmlElement.should.containEql('This is a new CTA Card.');
            htmlElement.should.containEql('Sponsored by'); // because hasSponsorLabel is true
            htmlElement.should.containEql('cta-card');
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
                sponsorLabel: '<p><span style="white-space: pre-wrap;">SPONSORED</span></p>',
                imageUrl: '/content/images/2022/11/koenig-lexical.jpg',
                layout: 'minimal',
                showButton: true,
                textValue: '<p><span style="white-space: pre-wrap;">This is a new CTA Card via email.</span></p>'
            };
            const callToActionNode = new CallToActionNode(dataset);
            const {element} = callToActionNode.exportDOM(exportOptions);

            const htmlElement = element.outerHTML.toString();
            htmlElement.should.containEql('kg-cta-bg-green');
            htmlElement.should.containEql('background-color: #F0F0F0');
            htmlElement.should.containEql('Get access now');
            htmlElement.should.containEql('http://someblog.com/somepost');
            htmlElement.should.containEql('<p><span style="white-space: pre-wrap;">SPONSORED</span></p>'); // because hasSponsorLabel is true
            htmlElement.should.containEql('/content/images/2022/11/koenig-lexical.jpg'); // because hasImage is true
            htmlElement.should.containEql('This is a new CTA Card via email.');
        }));

        it('renders email with img width and height when immersive', editorTest(function () {
            exportOptions.target = 'email';
            dataset = {
                backgroundColor: 'green',
                buttonColor: '#F0F0F0',
                buttonText: 'Get access now',
                buttonTextColor: '#000000',
                buttonUrl: 'http://someblog.com/somepost',
                hasImage: true,
                hasSponsorLabel: true,
                sponsorLabel: '<p><span style="white-space: pre-wrap;">SPONSORED</span></p>',
                imageUrl: '/content/images/2022/11/koenig-lexical.jpg',
                layout: 'immersive',
                showButton: true,
                textValue: '<p><span style="white-space: pre-wrap;">This is a new CTA Card via email.</span></p>',
                imageWidth: 200,
                imageHeight: 100
            };
            const callToActionNode = new CallToActionNode(dataset);
            const {element} = callToActionNode.exportDOM(exportOptions);

            const htmlElement = element.outerHTML.toString();
            htmlElement.should.containEql('<img src="/content/images/2022/11/koenig-lexical.jpg" alt="CTA Image" class="kg-cta-image" width="200" height="100">');
        }));

        it('parses textValue correctly', editorTest(function () {
            const callToActionNode = new CallToActionNode(dataset);
            const {element} = callToActionNode.exportDOM(exportOptions);

            const htmlElement = element.outerHTML.toString();
            htmlElement.should.containEql('This is a cool advertisement');
        }));

        it('renders img tag when hasImage is true', editorTest(function () {
            const callToActionNode = new CallToActionNode(dataset);
            const {element} = callToActionNode.exportDOM(exportOptions);

            const htmlElement = element.outerHTML.toString();
            htmlElement.should.containEql('<img data-image-width="200" data-image-height="100" class="kg-cta-image" src="http://blog.com/image1.jpg" alt="CTA Image">');
        }));

        it('does not render img tag when hasImage is false', editorTest(function () {
            dataset.hasImage = false;
            const callToActionNode = new CallToActionNode(dataset);
            const {element} = callToActionNode.exportDOM(exportOptions);

            const htmlElement = element.outerHTML.toString();
            htmlElement.should.not.containEql('<img <img data-image-width="200" data-image-height="100" src="http://blog.com/image1.jpg" alt="CTA Image">');
        }));

        // NOTE: Due to the way the package gets built sinon is unable to redefine
        // utils.visibility, so we directly test the render output rather than spying
        it('should render with web visibility', editorTest(function () {
            exportOptions.target = 'web';
            dataset.visibility = {...utils.visibility.buildDefaultVisibility(), web: {nonMember: false, memberSegment: 'status:free,status:-free'}};

            const callToActionNode = new CallToActionNode(dataset);
            const {element} = callToActionNode.exportDOM(exportOptions);

            element.tagName.should.equal('TEXTAREA');
            element.value.should.match(/<!--kg-gated-block:begin nonMember:false memberSegment:"status:free,status:-free" -->/);
        }));

        it('should render with email visibility', editorTest(function () {
            exportOptions.target = 'email';
            dataset.visibility = {...utils.visibility.buildDefaultVisibility(), email: {memberSegment: 'status:free'}};

            const callToActionNode = new CallToActionNode(dataset);
            const {element, type} = callToActionNode.exportDOM(exportOptions);

            type.should.equal('html');
            element.tagName.should.equal('DIV');
            element.dataset.ghSegment.should.equal('status:free');
        }));
    });

    describe('exportJSON', function () {
        it('contains all data', editorTest(function () {
            dataset = {
                backgroundColor: 'green',
                buttonColor: '#F0F0F0',
                buttonText: 'Get access now',
                buttonTextColor: '#000000',
                buttonUrl: 'http://someblog.com/somepost',
                hasImage: true,
                hasSponsorLabel: true,
                sponsorLabel: '<p>This post is brought to you by our sponsors</p>',
                imageUrl: '/content/images/2022/11/koenig-lexical.jpg',
                imageWidth: 200,
                imageHeight: 100,
                layout: 'minimal',
                showButton: true,
                textValue: '<p><span style="white-space: pre-wrap;">This is a new CTA Card.</span></p>',
                href: ''
            };
            const callToActionNode = new CallToActionNode(dataset);
            const json = callToActionNode.exportJSON();

            json.should.deepEqual({
                type: 'call-to-action',
                version: 1,
                backgroundColor: 'green',
                buttonColor: '#F0F0F0',
                buttonText: 'Get access now',
                buttonTextColor: '#000000',
                buttonUrl: 'http://someblog.com/somepost',
                hasImage: true,
                hasSponsorLabel: true,
                sponsorLabel: '<p>This post is brought to you by our sponsors</p>',
                imageUrl: '/content/images/2022/11/koenig-lexical.jpg',
                imageWidth: 200,
                imageHeight: 100,
                layout: 'minimal',
                showButton: true,
                textValue: '<p><span style="white-space: pre-wrap;">This is a new CTA Card.</span></p>',
                href: '',
                visibility: {
                    web: {
                        nonMember: true,
                        memberSegment: 'status:free,status:-free'
                    },
                    email: {
                        memberSegment: 'status:free,status:-free'
                    }
                }
            });
        }));
    });

    describe('importJSON', function () {
        it('imports all data', function (done) {
            const serializedData = JSON.stringify({
                root: {
                    children: [{
                        type: 'call-to-action',
                        backgroundColor: 'green',
                        buttonColor: '#F0F0F0',
                        buttonText: 'Get access now',
                        buttonTextColor: '#000000',
                        buttonUrl: 'http://someblog.com/somepost',
                        hasImage: true,
                        hasSponsorLabel: true,
                        sponsorLabel: '<p>This post is brought to you by our sponsors</p>',
                        imageUrl: '/content/images/2022/11/koenig-lexical.jpg',
                        layout: 'minimal',
                        showButton: true,
                        textValue: '<p><span style="white-space: pre-wrap;">This is a new CTA Card.</span></p>'
                    }],
                    direction: null,
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            });

            const editorState = editor.parseEditorState(serializedData);
            editor.setEditorState(editorState);

            editor.getEditorState().read(() => {
                try {
                    const [callToActionNode] = $getRoot().getChildren();
                    $isCallToActionNode(callToActionNode).should.be.true();

                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
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
        it('parses call to action card', editorTest(function () {
            const htmlString = `
                <a data-cta-link href="http://newblog.com/newpost">
                <div class="kg-card kg-cta-card kg-cta-bg-green kg-cta-minimal" data-layout="minimal">
                    <div class="kg-cta-content">
                        <div class="kg-cta-sponsor-label">
                            Sponsored
                        </div>
                        <div class="kg-cta-image-container">
                            <img data-image-width="1920" data-image-height="1080" class="kg-cta-image" src="/content/images/2022/11/koenig-lexical.jpg" alt="CTA Image">
                        </div>
                        <div class="kg-cta-content-inner">
                            <div class="kg-cta-text">
                                This is a new CTA Card.
                            </div>
                            <a href="http://someblog.com/somepost" class="kg-cta-button" style="background-color: #F0F0F0; color: #000000;">
                                Get access now
                            </a>
                        </div>
                    </div>
                </div>
                </a>
            `;
            const document = createDocument(htmlString);
            const nodes = $generateNodesFromDOM(editor, document);
            nodes.length.should.equal(1);
            const node = nodes[0];
            node.layout.should.equal('minimal');
            node.textValue.should.equal('This is a new CTA Card.');
            node.showButton.should.equal(true);
            node.buttonText.should.equal('Get access now');
            node.buttonUrl.should.equal('http://someblog.com/somepost');
            node.buttonColor.should.equal('#f0f0f0');
            node.buttonTextColor.should.equal('#000000');
            node.hasSponsorLabel.should.equal(true);
            node.backgroundColor.should.equal('green');
            node.hasImage.should.equal(true);
            node.imageUrl.should.equal('/content/images/2022/11/koenig-lexical.jpg');
            node.imageHeight.should.equal('1080');
            node.imageWidth.should.equal('1920');
            node.href.should.equal('http://newblog.com/newpost');
        }));
    });

    describe('getTextContent', function () {
        it('returns textValue', editorTest(function () {
            const callToActionNode = new CallToActionNode(dataset);
            callToActionNode.getTextContent().should.equal('This is a cool advertisement\n\n');
        }));
    });
});
