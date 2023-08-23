const {JSDOM} = require('jsdom');
const {html} = require('../utils');
const {$getRoot} = require('lexical');
const {createHeadlessEditor} = require('@lexical/headless');
const {ProductNode, $createProductNode, $isProductNode} = require('../../');
const {$generateNodesFromDOM} = require('@lexical/html');

const editorNodes = [ProductNode];

describe('ProductNode', function () {
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

    const checkGetters = (productNode, data) => {
        productNode.productImageSrc.should.equal(data.productImageSrc);
        productNode.productImageWidth.should.equal(data.productImageWidth);
        productNode.productImageHeight.should.equal(data.productImageHeight);
        productNode.productTitle.should.equal(data.productTitle);
        productNode.productDescription.should.equal(data.productDescription);
        productNode.productRatingEnabled.should.be.exactly(true);
        productNode.productStarRating.should.equal(5);
        productNode.productButtonEnabled.should.be.exactly(true);
        productNode.productButton.should.equal(data.productButton);
        productNode.productUrl.should.equal(data.productUrl);
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
            createDocument: () => {
                return (new JSDOM()).window.document;
            }
        });
    });

    it('matches node with $isProductNode', editorTest(function () {
        const productNode = $createProductNode(dataset);
        $isProductNode(productNode).should.be.true;
    }));

    describe('data access', function () {
        it('has getters for all properties', editorTest(function () {
            const productNode = $createProductNode(dataset);

            checkGetters(productNode, dataset);
        }));

        it('has setters for all properties', editorTest(function () {
            const productNode = $createProductNode();

            productNode.productImageSrc.should.equal('');
            productNode.productImageSrc = '/content/images/2022/11/koenig-lexical.jpg';
            productNode.productImageSrc.should.equal('/content/images/2022/11/koenig-lexical.jpg');

            should(productNode.productImageWidth).equal(null);
            productNode.productImageWidth = 600;
            productNode.productImageWidth.should.equal(600);

            should(productNode.productImageHeight).equal(null);
            productNode.productImageHeight = 700;
            productNode.productImageHeight.should.equal(700);

            productNode.productTitle.should.equal('');
            productNode.productTitle = 'Title';
            productNode.productTitle.should.equal('Title');

            productNode.productDescription.should.equal('');
            productNode.productDescription = 'Description';
            productNode.productDescription.should.equal('Description');

            productNode.productRatingEnabled.should.be.exactly(false);
            productNode.productRatingEnabled = true;
            productNode.productRatingEnabled.should.be.exactly(true);

            productNode.productStarRating.should.equal(5);
            productNode.productStarRating = 3;
            productNode.productStarRating.should.equal(3);

            productNode.productButton.should.equal('');
            productNode.productButton = 'Button text';
            productNode.productButton.should.equal('Button text');

            productNode.productUrl.should.equal('');
            productNode.productUrl = 'https://google.com/';
            productNode.productUrl.should.equal('https://google.com/');
        }));

        it('has getDataset() convenience method', editorTest(function () {
            const productNode = $createProductNode(dataset);
            const productNodeDataset = productNode.getDataset();

            productNodeDataset.should.deepEqual({
                ...dataset,
                productStarRating: 5
            });
        }));
    });

    describe('clone', function () {
        it('clones the node', editorTest(function () {
            const productNode = $createProductNode(dataset);
            const clonedProductNode = ProductNode.clone(productNode);
            $isProductNode(clonedProductNode).should.be.exactly(true);
            clonedProductNode.should.not.be.exactly(productNode);
            checkGetters(productNode, dataset);
        }));
    });

    describe('isEmpty()', function () {
        it('returns true if required fields are missing', editorTest(function () {
            const productNode = $createProductNode(dataset);

            productNode.isEmpty().should.be.exactly(false);
            productNode.productImageSrc = '';
            productNode.isEmpty().should.be.exactly(false);
            productNode.productButtonEnabled = false;
            productNode.isEmpty().should.be.exactly(false);
            productNode.productTitle = '';
            productNode.isEmpty().should.be.exactly(false);
            productNode.productDescription = '';
            productNode.isEmpty().should.be.exactly(false);
            productNode.productRatingEnabled = false;
            productNode.isEmpty().should.be.exactly(true);
        }));
    });

    describe('hasEditMode', function () {
        it('returns true', editorTest(function () {
            const productNode = $createProductNode(dataset);
            productNode.hasEditMode().should.be.exactly(true);
        }));
    });

    describe('getType', function () {
        it('returns the correct node type', editorTest(function () {
            ProductNode.getType().should.equal('product');
        }));
    });

    describe('urlTransformMap', function () {
        it('contains the expected URL mapping', editorTest(function () {
            ProductNode.urlTransformMap.should.deepEqual({
                productImageSrc: 'url',
                productTitle: 'html',
                productDescription: 'html'
            });
        }));
    });

    describe('exportJSON', function () {
        it('contains all data', editorTest(function () {
            const productNode = $createProductNode(dataset);
            const json = productNode.exportJSON();

            json.should.deepEqual({
                type: 'product',
                version: 1,
                productImageSrc: dataset.productImageSrc,
                productImageWidth: dataset.productImageWidth,
                productImageHeight: dataset.productImageHeight,
                productTitle: dataset.productTitle,
                productDescription: dataset.productDescription,
                productRatingEnabled: dataset.productRatingEnabled,
                productButtonEnabled: dataset.productButtonEnabled,
                productButton: dataset.productButton,
                productUrl: dataset.productUrl,
                productStarRating: 5
            });
        }));
    });

    describe('importJSON', function () {
        it('imports all data', function (done) {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'product',
                        ...dataset,
                        starRating: 5
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
                    const [productNode] = $getRoot().getChildren();

                    checkGetters(productNode, dataset);

                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });

    describe('exportDOM', function () {
        it('renders', editorTest(function () {
            const payload = {
                productButton: 'Click me',
                productButtonEnabled: true,
                productDescription: 'This product is ok',
                productImageSrc: 'https://example.com/images/ok.jpg',
                productRatingEnabled: true,
                productStarRating: 3,
                productTitle: 'Product title!',
                productUrl: 'https://example.com/product/ok'
            };
            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(`
                <div class="kg-card kg-product-card"><div class="kg-product-card-container"><img src="https://example.com/images/ok.jpg" class="kg-product-card-image" loading="lazy" /><div class="kg-product-card-title-container"><h4 class="kg-product-card-title">Product title!</h4></div><div class="kg-product-card-rating"><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"></path></svg></span><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"></path></svg></span><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"></path></svg></span><span class=" kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"></path></svg></span><span class=" kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"></path></svg></span></div><div class="kg-product-card-description">This product is ok</div><a href="https://example.com/product/ok" class="kg-product-card-button kg-product-card-btn-accent" target="_blank" rel="noopener noreferrer"><span>Click me</span></a></div></div>
            `);
        }));

        it('renders with img width and height', editorTest(function () {
            const payload = {
                productButton: 'Click me',
                productButtonEnabled: true,
                productDescription: 'This product is ok',
                productImageSrc: 'https://example.com/images/ok.jpg',
                productImageWidth: 200,
                productImageHeight: 100,
                productRatingEnabled: true,
                productStarRating: 3,
                productTitle: 'Product title!',
                productUrl: 'https://example.com/product/ok'
            };
            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(`
                <div class="kg-card kg-product-card"><div class="kg-product-card-container"><img src="https://example.com/images/ok.jpg" width="200" height="100" class="kg-product-card-image" loading="lazy" /><div class="kg-product-card-title-container"><h4 class="kg-product-card-title">Product title!</h4></div><div class="kg-product-card-rating"><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"></path></svg></span><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"></path></svg></span><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"></path></svg></span><span class=" kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"></path></svg></span><span class=" kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"></path></svg></span></div><div class="kg-product-card-description">This product is ok</div><a href="https://example.com/product/ok" class="kg-product-card-button kg-product-card-btn-accent" target="_blank" rel="noopener noreferrer"><span>Click me</span></a></div></div>
            `);
        }));

        it('renders empty span if title, description, button and image are missing', editorTest(function () {
            const payload = {
                productTitle: '',
                productDescription: ''
            };
            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM(exportOptions);

            element.outerHTML.should.equal('<span></span>');
        }));

        it('renders if only title is present', editorTest(function () {
            const payload = {
                productTitle: 'Just a title'
            };
            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(`
                <div class="kg-card kg-product-card"><div class="kg-product-card-container"><div class="kg-product-card-title-container"><h4 class="kg-product-card-title">Just a title</h4></div><div class="kg-product-card-description"></div></div></div>
            `);
        }));

        it('renders if only description is present', editorTest(function () {
            const payload = {
                productDescription: 'Just a description'
            };
            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(`
                <div class="kg-card kg-product-card"><div class="kg-product-card-container"><div class="kg-product-card-title-container"><h4 class="kg-product-card-title"></h4></div><div class="kg-product-card-description">Just a description</div></div></div>
            `);
        }));

        it('renders if only button is present', editorTest(function () {
            const payload = {
                productButtonEnabled: true,
                productButton: 'Button text',
                productUrl: 'https://example.com/product/ok'
            };
            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(`
                <div class="kg-card kg-product-card"><div class="kg-product-card-container"><div class="kg-product-card-title-container"><h4 class="kg-product-card-title"></h4></div><div class="kg-product-card-description"></div><a href="https://example.com/product/ok" class="kg-product-card-button kg-product-card-btn-accent" target="_blank" rel="noopener noreferrer"><span>Button text</span></a></div></div>
            `);
        }));

        it('renders email', editorTest(function () {
            const payload = {
                productButton: 'Click me',
                productButtonEnabled: true,
                productDescription: 'This product is ok',
                productImageSrc: 'https://example.com/images/ok.jpg',
                productRatingEnabled: true,
                productStarRating: 3,
                productTitle: 'Product title!',
                productUrl: 'https://example.com/product/ok'
            };

            const options = {
                target: 'email'
            };

            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM({...exportOptions, ...options});

            element.outerHTML.should.prettifyTo(`
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%; padding:20px; border:1px solid #E9E9E9; border-radius: 5px; margin: 0 0 1.5em; width: 100%;"><tbody><tr><td align="center" style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><img src="https://example.com/images/ok.jpg" style="width: 100%; height: auto; border: none; padding-bottom: 16px;" border="0"></td></tr><tr><td valign="top"><h4 style="font-size: 22px !important; margin-top: 0 !important; margin-bottom: 0 !important; font-weight: 700;">Product title!</h4></td></tr><tr style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><td valign="top"><img src="https://static.ghost.org/v4.0.0/images/star-rating-3.png" style="border: none; width: 96px;" border="0"></td></tr><tr><td style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><div style="padding-top: 8px; opacity: 0.7; font-size: 17px; line-height: 1.4; margin-bottom: -24px;">This product is ok</div></td></tr><tr><td style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><div class="btn btn-accent" style="box-sizing: border-box;display: table;width: 100%;padding-top: 16px;"><a href="https://example.com/product/ok" style="overflow-wrap: anywhere;border: solid 1px;border-radius: 5px;box-sizing: border-box;cursor: pointer;display: inline-block;font-size: 14px;font-weight: bold;margin: 0;padding: 0;text-decoration: none;color: #FFFFFF; width: 100%; text-align: center;"><span style="display: block;padding: 12px 25px;">Click me</span></a></div></td></tr></tbody></table>
            `);
        }));

        it('renders email with img width and height', editorTest(function () {
            const payload = {
                productButton: 'Click me',
                productButtonEnabled: true,
                productDescription: 'This product is ok',
                productImageSrc: 'https://example.com/images/ok.jpg',
                productImageWidth: 200,
                productImageHeight: 100,
                productRatingEnabled: true,
                productStarRating: 3,
                productTitle: 'Product title!',
                productUrl: 'https://example.com/product/ok'
            };

            const options = {
                target: 'email'
            };

            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM({...exportOptions, ...options});

            element.outerHTML.should.prettifyTo(`
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%; padding:20px; border:1px solid #E9E9E9; border-radius: 5px; margin: 0 0 1.5em; width: 100%;"><tbody><tr><td align="center" style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><img src="https://example.com/images/ok.jpg" width="200" height="100" style="width: 100%; height: auto; border: none; padding-bottom: 16px;" border="0"></td></tr><tr><td valign="top"><h4 style="font-size: 22px !important; margin-top: 0 !important; margin-bottom: 0 !important; font-weight: 700;">Product title!</h4></td></tr><tr style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><td valign="top"><img src="https://static.ghost.org/v4.0.0/images/star-rating-3.png" style="border: none; width: 96px;" border="0"></td></tr><tr><td style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><div style="padding-top: 8px; opacity: 0.7; font-size: 17px; line-height: 1.4; margin-bottom: -24px;">This product is ok</div></td></tr><tr><td style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><div class="btn btn-accent" style="box-sizing: border-box;display: table;width: 100%;padding-top: 16px;"><a href="https://example.com/product/ok" style="overflow-wrap: anywhere;border: solid 1px;border-radius: 5px;box-sizing: border-box;cursor: pointer;display: inline-block;font-size: 14px;font-weight: bold;margin: 0;padding: 0;text-decoration: none;color: #FFFFFF; width: 100%; text-align: center;"><span style="display: block;padding: 12px 25px;">Click me</span></a></div></td></tr></tbody></table>
            `);
        }));

        it('renders email when the star-rating is disabled', editorTest(function () {
            const payload = {
                productButton: 'Click me',
                productButtonEnabled: true,
                productDescription: 'This product is ok',
                productImageSrc: 'https://example.com/images/ok.jpg',
                productRatingEnabled: false,
                productTitle: 'Product title!',
                productUrl: 'https://example.com/product/ok'
            };

            const options = {
                target: 'email'
            };

            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM({...exportOptions, ...options});

            element.outerHTML.should.prettifyTo(`
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%; padding:20px; border:1px solid #E9E9E9; border-radius: 5px; margin: 0 0 1.5em; width: 100%;"><tbody><tr><td align="center" style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><img src="https://example.com/images/ok.jpg" style="width: 100%; height: auto; border: none; padding-bottom: 16px;" border="0"></td></tr><tr><td valign="top"><h4 style="font-size: 22px !important; margin-top: 0 !important; margin-bottom: 0 !important; font-weight: 700;">Product title!</h4></td></tr><tr><td style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><div style="padding-top: 8px; opacity: 0.7; font-size: 17px; line-height: 1.4; margin-bottom: -24px;">This product is ok</div></td></tr><tr><td style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><div class="btn btn-accent" style="box-sizing: border-box;display: table;width: 100%;padding-top: 16px;"><a href="https://example.com/product/ok" style="overflow-wrap: anywhere;border: solid 1px;border-radius: 5px;box-sizing: border-box;cursor: pointer;display: inline-block;font-size: 14px;font-weight: bold;margin: 0;padding: 0;text-decoration: none;color: #FFFFFF; width: 100%; text-align: center;"><span style="display: block;padding: 12px 25px;">Click me</span></a></div></td></tr></tbody></table>
            `);
        }));

        it('renders email when the button is disabled', editorTest(function () {
            const payload = {
                productButton: 'Click me',
                productButtonEnabled: false,
                productDescription: 'This product is ok',
                productImageSrc: 'https://example.com/images/ok.jpg',
                productRatingEnabled: false,
                productTitle: 'Product title!',
                productUrl: 'https://example.com/product/ok'
            };

            const options = {
                target: 'email'
            };

            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM({...exportOptions, ...options});

            element.outerHTML.should.prettifyTo(`
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%; padding:20px; border:1px solid #E9E9E9; border-radius: 5px; margin: 0 0 1.5em; width: 100%;"><tbody><tr><td align="center" style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><img src="https://example.com/images/ok.jpg" style="width: 100%; height: auto; border: none; padding-bottom: 16px;" border="0"></td></tr><tr><td valign="top"><h4 style="font-size: 22px !important; margin-top: 0 !important; margin-bottom: 0 !important; font-weight: 700;">Product title!</h4></td></tr><tr><td style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><div style="padding-top: 8px; opacity: 0.7; font-size: 17px; line-height: 1.4; margin-bottom: -24px;">This product is ok</div></td></tr></tbody></table>
            `);
        }));

        it('renders email without an image if the attribute isn\'t there', editorTest(function () {
            const payload = {
                productButton: 'Click me',
                productButtonEnabled: false,
                productDescription: 'This product is ok',
                productRatingEnabled: false,
                productTitle: 'Product title!',
                productUrl: 'https://example.com/product/ok'
            };

            const options = {
                target: 'email'
            };

            const productNode = $createProductNode(payload);
            const {element} = productNode.exportDOM({...exportOptions, ...options});

            element.outerHTML.should.prettifyTo(`
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%; padding:20px; border:1px solid #E9E9E9; border-radius: 5px; margin: 0 0 1.5em; width: 100%;"><tbody><tr><td valign="top"><h4 style="font-size: 22px !important; margin-top: 0 !important; margin-bottom: 0 !important; font-weight: 700;">Product title!</h4></td></tr><tr><td style="padding-top:0; padding-bottom:0; margin-bottom:0; padding-bottom:0;"><div style="padding-top: 8px; opacity: 0.7; font-size: 17px; line-height: 1.4; margin-bottom: -24px;">This product is ok</div></td></tr></tbody></table>
            `);
        }));
    });

    describe('importDOM', function () {
        it('parses product card', editorTest(function () {
            const dom = (new JSDOM(html`
                <div class="kg-card kg-product-card"><div class="kg-product-card-container"><img src="https://example.com/images/ok.jpg" class="kg-product-card-image" /><div class="kg-product-card-header"><div class="kg-product-card-title-container"><h4 class="kg-product-card-title">Product title!</h4></div><div class="kg-product-card-rating"><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"/></svg></span><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"/></svg></span><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"/></svg></span><span class=" kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"/></svg></span><span class=" kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"/></svg></span></div></div><p class="kg-product-card-description">This product is ok</p><a href="https://example.com/product/ok" class="kg-btn kg-btn-accent kg-product-card-button" target="_blank" rel="noopener noreferrer"><span>Click me</span></a></div></div>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);

            const productNode = nodes[0];
            $isProductNode(productNode).should.be.exactly(true);

            productNode.productImageSrc.should.equal('https://example.com/images/ok.jpg');
            productNode.productTitle.should.equal('Product title!');
            productNode.productDescription.should.equal('This product is ok');
            productNode.productRatingEnabled.should.be.exactly(true);
            productNode.productStarRating.should.equal(3);
            productNode.productButtonEnabled.should.be.exactly(true);
            productNode.productButton.should.equal('Click me');
            productNode.productUrl.should.equal('https://example.com/product/ok');
        }));

        it('parses a product card with disabled star rating', editorTest(function () {
            const dom = (new JSDOM(html`
                <div class="kg-card kg-product-card"><div class="kg-product-card-container"><img src="https://example.com/images/ok.jpg" class="kg-product-card-image" /><div class="kg-product-card-header"><div class="kg-product-card-title-container"><h4 class="kg-product-card-title">Product title!</h4></div><p class="kg-product-card-description">This product is ok</p><a href="https://example.com/product/ok" class="kg-btn kg-btn-accent kg-product-card-button" target="_blank" rel="noopener noreferrer"><span>Click me</span></a></div></div>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);

            const productNode = nodes[0];
            $isProductNode(productNode).should.be.exactly(true);

            productNode.productImageSrc.should.equal('https://example.com/images/ok.jpg');
            productNode.productTitle.should.equal('Product title!');
            productNode.productDescription.should.equal('This product is ok');
            productNode.productRatingEnabled.should.be.exactly(false);
            productNode.productButtonEnabled.should.be.exactly(true);
            productNode.productButton.should.equal('Click me');
            productNode.productUrl.should.equal('https://example.com/product/ok');
        }));

        it('parses a product card with disabled button', editorTest(function () {
            const dom = (new JSDOM(html`
                <div class="kg-card kg-product-card"><div class="kg-product-card-container"><img src="https://example.com/images/ok.jpg" class="kg-product-card-image" /><div class="kg-product-card-header"><div class="kg-product-card-title-container"><h4 class="kg-product-card-title">Product title!</h4></div></div><p class="kg-product-card-description">This product is ok</p></div></div>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);

            const productNode = nodes[0];
            $isProductNode(productNode).should.be.exactly(true);

            productNode.productImageSrc.should.equal('https://example.com/images/ok.jpg');
            productNode.productTitle.should.equal('Product title!');
            productNode.productDescription.should.equal('This product is ok');
            productNode.productRatingEnabled.should.be.exactly(false);
            productNode.productButtonEnabled.should.be.exactly(false);
        }));

        it('parses a product card with image width/height', editorTest(function () {
            const dom = (new JSDOM(html`
                <div class="kg-card kg-product-card"><div class="kg-product-card-container"><img src="https://example.com/images/ok.jpg" class="kg-product-card-image" width="200" height="100"/><div class="kg-product-card-header"><div class="kg-product-card-title-container"><h4 class="kg-product-card-title">Product title!</h4></div></div><p class="kg-product-card-description">This product is ok</p></div></div>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);

            const productNode = nodes[0];
            $isProductNode(productNode).should.be.exactly(true);

            productNode.productImageSrc.should.equal('https://example.com/images/ok.jpg');
            productNode.productTitle.should.equal('Product title!');
            productNode.productDescription.should.equal('This product is ok');
            productNode.productRatingEnabled.should.be.exactly(false);
            productNode.productButtonEnabled.should.be.exactly(false);
            productNode.productImageWidth.should.equal('200');
            productNode.productImageHeight.should.equal('100');
        }));

        it('handles arbitrary whitespace in button content', editorTest(function () {
            const dom = (new JSDOM(html`
                <div class="kg-card kg-product-card">
                    <div class="kg-product-card-container">
                        <img src="https://example.com/images/ok.jpg" class="kg-product-card-image" />
                        <div class="kg-product-card-header">
                            <div class="kg-product-card-title-container">
                                <h4 class="kg-product-card-title">Product title!</h4>
                            </div>
                        </div>
                        <p class="kg-product-card-description">This product is ok</p>
                        <a href="https://example.com/product/ok" class="kg-btn kg-btn-accent kg-product-card-button" target="_blank" rel="noopener noreferrer">
                            <span>
                                Click me
                            </span>
                        </a>
                    </div>
                </div>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.length.should.equal(1);

            const productNode = nodes[0];
            $isProductNode(productNode).should.be.exactly(true);

            productNode.productImageSrc.should.equal('https://example.com/images/ok.jpg');
            productNode.productTitle.should.equal('Product title!');
            productNode.productDescription.should.equal('This product is ok');
            productNode.productRatingEnabled.should.be.exactly(false);
            productNode.productButtonEnabled.should.be.exactly(true);
            productNode.productButton.should.equal('Click me');
            productNode.productUrl.should.equal('https://example.com/product/ok');
        }));

        it('falls through if title, description, button and image are missing', editorTest(function () {
            const dom = (new JSDOM(html`
                <div class="kg-card kg-product-card"><div class="kg-product-card-container"><div class="kg-product-card-header"><div class="kg-product-card-title-container"></div><div class="kg-product-card-rating"><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"/></svg></span><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"/></svg></span><span class="kg-product-card-rating-active kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"/></svg></span><span class=" kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"/></svg></span><span class=" kg-product-card-rating-star"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"/></svg></span></div></div></div></div>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);
            $isProductNode(nodes[0]).should.be.exactly(false);
        }));
    });

    describe('getTextContent', function () {
        it('returns contents', editorTest(function () {
            const node = $createProductNode();
            node.getTextContent().should.equal('');

            node.productTitle = 'Product title!';
            node.getTextContent().should.equal('Product title!\n\n');

            node.productDescription = 'This product is ok';
            node.getTextContent().should.equal('Product title!\nThis product is ok\n\n');
        }));
    });
});
