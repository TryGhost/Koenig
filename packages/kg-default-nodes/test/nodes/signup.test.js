const {createHeadlessEditor} = require('@lexical/headless');
const {SignupNode, $createSignupNode, $isSignupNode} = require('../../');

const editorNodes = [SignupNode];

describe('HeaderNode', function () {
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
            buttonText: 'The button',
            header: 'This is the header card',
            size: 'small',
            style: 'image',
            subheader: 'hello',
            disclaimer: 'disclaimer'
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
});
