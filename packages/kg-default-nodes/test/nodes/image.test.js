const {html} = require('../utils');
const {createHeadlessEditor} = require('@lexical/headless');
const {$generateNodesFromDOM} = require('@lexical/html');
const {JSDOM} = require('jsdom');
const {ImageNode, $createImageNode, $isImageNode} = require('../../');

const editorNodes = [ImageNode];

describe('ImageNode', function () {
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
            src: '/content/images/2022/11/koenig-lexical.jpg',
            width: 3840,
            height: 2160,
            title: 'This is a title',
            altText: 'This is some alt text',
            caption: 'This is a <b>caption</b>'
        };

        exportOptions = {
            imageOptimization: {
                contentImageSizes: {
                    w600: {width: 600},
                    w1000: {width: 1000},
                    w1600: {width: 1600},
                    w2400: {width: 2400}
                }
            },
            createDocument() {
                return (new JSDOM()).window.document;
            }
        };
    });

    it('matches node with $isImageNode', editorTest(function () {
        const imageNode = $createImageNode(dataset);
        $isImageNode(imageNode).should.be.true;
    }));

    describe('data access', function () {
        it('has getters for all properties', editorTest(function () {
            const imageNode = $createImageNode(dataset);

            imageNode.getSrc().should.equal('/content/images/2022/11/koenig-lexical.jpg');
            imageNode.getImgWidth().should.equal(3840);
            imageNode.getImgHeight().should.equal(2160);
            imageNode.getTitle().should.equal('This is a title');
            imageNode.getAltText().should.equal('This is some alt text');
            imageNode.getCaption().should.equal('This is a <b>caption</b>');
            imageNode.getCardWidth().should.equal('regular');
        }));

        it('has setters for all properties', editorTest(function () {
            const imageNode = $createImageNode();

            imageNode.getSrc().should.equal('');
            imageNode.setSrc('/content/images/2022/11/koenig-lexical.jpg');
            imageNode.getSrc().should.equal('/content/images/2022/11/koenig-lexical.jpg');

            should(imageNode.getImgWidth()).equal(null);
            imageNode.setImgWidth(3840);
            imageNode.getImgWidth().should.equal(3840);

            should(imageNode.getImgHeight()).equal(null);
            imageNode.setImgHeight(2160);
            imageNode.getImgHeight().should.equal(2160);

            imageNode.getTitle().should.equal('');
            imageNode.setTitle('I am a title');
            imageNode.getTitle().should.equal('I am a title');

            imageNode.getAltText().should.equal('');
            imageNode.setAltText('I am alt text');
            imageNode.getAltText().should.equal('I am alt text');

            imageNode.getCaption().should.equal('');
            imageNode.setCaption('I am a <b>Caption</b>');
            imageNode.getCaption().should.equal('I am a <b>Caption</b>');

            imageNode.getCardWidth().should.equal('regular');
            imageNode.setCardWidth('wide');
            imageNode.getCardWidth().should.equal('wide');
        }));
    });

    describe('exportDOM', function () {
        it('creates an image element', editorTest(function () {
            const imageNode = $createImageNode(dataset);
            const {element} = imageNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(html`
                <figure class="kg-card kg-image-card">
                    <img
                        src="/content/images/2022/11/koenig-lexical.jpg"
                        alt="This is some alt text"
                        loading="lazy"
                        title="This is a title"
                        width="3840"
                        height="2160"
                        srcset="/content/images/size/w600/2022/11/koenig-lexical.jpg 600w, /content/images/size/w1000/2022/11/koenig-lexical.jpg 1000w, /content/images/size/w1600/2022/11/koenig-lexical.jpg 1600w, /content/images/size/w2400/2022/11/koenig-lexical.jpg 2400w" sizes="(min-width: 720px) 720px"
                    >
                    <figcaption>This is a <b>caption</b></figcaption>
                </figure>
            `);
        }));

        it('creates a minimal image element', editorTest(function () {
            const imageNode = $createImageNode({src: '/image.png'});
            const {element} = imageNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(html`
                <figure class="kg-card kg-image-card">
                    <img src="/image.png" alt="" loading="lazy">
                </figure>
            `);
        }));

        it('renders nothing with a missing src', editorTest(function () {
            const imageNode = $createImageNode();
            const {element} = imageNode.exportDOM(exportOptions);

            element.textContent.should.equal('');
            should(element.outerHTML).be.undefined();
        }));
    });

    describe('importDOM', function () {
        it('parses an img element', editorTest(function (done) {
            const dom = (new JSDOM(html`
                <img
                    src="/image.png"
                    alt="Alt text"
                    title="Title text"
                    width="3000"
                    height="2000"
                />
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);

            nodes.length.should.equal(1);
            nodes[0].getSrc().should.equal('/image.png');
            nodes[0].getAltText().should.equal('Alt text');
            nodes[0].getTitle().should.equal('Title text');
            nodes[0].getImgWidth().should.equal(3000);
            nodes[0].getImgHeight().should.equal(2000);
        }));
    });
});
