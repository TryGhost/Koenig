const {createHeadlessEditor} = require('@lexical/headless');
const {SignupNode, $createSignupNode, $isSignupNode} = require('../../');

const editorNodes = [SignupNode];

describe('SignupNode', function () {
    let editor;
    let dataset;

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
            backgroundImageSrc: 'https://example.com/image.jpg',
            buttonText: 'Button',
            disclaimer: 'Disclaimer',
            header: 'Header',
            subheader: 'Subheader',
            size: 'small',
            style: 'image'
        };
    });

    it('matches node with $isSignupNode', editorTest(function () {
        const signupNode = $createSignupNode(dataset);
        $isSignupNode(signupNode).should.be.true;
    }));

    describe('hasEditMode', function () {
        it('returns true', editorTest(function () {
            const signupNode = $createSignupNode(dataset);
            signupNode.hasEditMode().should.be.true;
        }));
    });

    describe('data access', function () {
        it('has getters for all properties', editorTest(function () {
            const signupNode = $createSignupNode(dataset);
            signupNode.getBackgroundImageSrc().should.equal(dataset.backgroundImageSrc);
            signupNode.getButtonText().should.equal(dataset.buttonText);
            signupNode.getDisclaimer().should.equal(dataset.disclaimer);
            signupNode.getHeader().should.equal(dataset.header);
            signupNode.getSubheader().should.equal(dataset.subheader);
            signupNode.getSize().should.equal(dataset.size);
            signupNode.getStyle().should.equal(dataset.style);
        }));

        it ('has setters for all properties', editorTest(function () {
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
            node.setSize('large');
            node.getSize().should.equal('large');
            node.setStyle('light');
            node.getStyle().should.equal('light');
        }));

        it('has getDataset() method', editorTest(function () {
            const signupNode = $createSignupNode(dataset);
            const nodeData = signupNode.getDataset();
            nodeData.should.deepEqual(dataset);
        }));
    });
});
