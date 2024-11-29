const {dom} = require('@tryghost/kg-default-nodes');
const {createHeadlessEditor} = require('@lexical/headless');
import {ProductNode, $createProductNode} from '../../src/nodes/ProductNode';

const editorNodes = [ProductNode];

describe('ProductNode', function () {
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
    

    beforeEach(function () {
        editor = createHeadlessEditor({nodes: editorNodes});

        dataset = {
            productImageSrc: '/content/images/2022/11/koenig-lexical.jpg',
            productImageWidth: 200,
            productImageHeight: 100,
            productTitle: 'This is a <b>title</b>',
            productDescription: 'This is a <b>description</b>',
            productRatingEnabled: true,
            productButtonEnabled: true,
            productButton: 'Button text',
            productUrl: 'https://google.com/'
        };

        exportOptions = new Object({
            dom
        });
    });

    describe('exportJSON', function () {     
        it('does not mangle titles with extra br', editorTest(function () {
                dataset.productTitle = '<span>Product title!</span> <br><span>Hello part 2</span>';
                const productNode = $createProductNode(dataset);
                const json = productNode.exportJSON();
                const title = json.productTitle;
                expect(title).toEqual('<span style="white-space: pre-wrap;">aaProduct title!</span><br><span style="white-space: pre-wrap;">Hello part 2</span>');
        }));
    });
});