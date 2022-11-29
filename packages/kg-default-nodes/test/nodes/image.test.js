require('../utils'); // eslint-disable-line
const jsdom = require('jsdom');
const {ImageNode} = require('../../cjs/kg-default-nodes');

describe('ImageNode', function () {
    let dataset;
    let exportOptions;

    beforeEach(function () {
        dataset = {
            src: '/content/images/2022/11/koenig-lexical.jpg',
            width: 1080,
            height: 1024,
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
                return (new jsdom()).window.document;
            }
        };
    });

    describe('data access', function () {
        it('has getters for all properties', function () {
            const imageNode = new ImageNode(dataset);

            imageNode.getSrc().should.equal('/content/images/2022/11/koenig-lexical.jpg');
            imageNode.getWidth().should.equal('');
            imageNode.getHeight().should.equal('');
            imageNode.getTitle().should.equal('');
            imageNode.getAltText().should.equal('');
            imageNode.getCaption().should.equal('');
        });
    });

    describe('exportDOM', function () {
        it('creates an image element', function () {
            const imageNode = new ImageNode(dataset);
            const {element} = imageNode.exportDOM();

            element.outerHTML.should.equal('');
        });
    });

    describe('importDOM', function () {
        it('parses an img element');
    });
});
