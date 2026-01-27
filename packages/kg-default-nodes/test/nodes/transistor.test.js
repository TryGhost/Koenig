const {createHeadlessEditor} = require('@lexical/headless');
const {$getRoot} = require('lexical');
const {dom} = require('../test-utils');
const {TransistorNode, $isTransistorNode} = require('../../');

const editorNodes = [TransistorNode];

describe('TransistorNode', function () {
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
            accentColor: '#8B5CF6',
            backgroundColor: '#FFFFFF'
        };
        exportOptions = {
            exportFormat: 'html',
            dom
        };
    });

    it('matches node with $isTransistorNode', editorTest(function () {
        const transistorNode = new TransistorNode(dataset);
        $isTransistorNode(transistorNode).should.be.true();
    }));

    describe('data access', function () {
        it('has getters for all properties', editorTest(function () {
            const transistorNode = new TransistorNode(dataset);

            transistorNode.accentColor.should.equal(dataset.accentColor);
            transistorNode.backgroundColor.should.equal(dataset.backgroundColor);
            // Default visibility should be members-only (nonMember: false)
            transistorNode.visibility.web.nonMember.should.be.false();
            transistorNode.visibility.web.memberSegment.should.equal('status:free,status:-free');
            transistorNode.visibility.email.memberSegment.should.equal('status:free,status:-free');
        }));

        it('has setters for all properties', editorTest(function () {
            const transistorNode = new TransistorNode();

            transistorNode.accentColor.should.equal('');
            transistorNode.accentColor = '#FF0000';
            transistorNode.accentColor.should.equal('#FF0000');

            transistorNode.backgroundColor.should.equal('');
            transistorNode.backgroundColor = '#000000';
            transistorNode.backgroundColor.should.equal('#000000');

            transistorNode.visibility = {
                web: {
                    nonMember: false,
                    memberSegment: 'status:free'
                },
                email: {
                    memberSegment: 'status:free'
                }
            };
            transistorNode.visibility.should.deepEqual({
                web: {
                    nonMember: false,
                    memberSegment: 'status:free'
                },
                email: {
                    memberSegment: 'status:free'
                }
            });
        }));

        it('has getDataset() convenience method', editorTest(function () {
            const transistorNode = new TransistorNode(dataset);
            const transistorNodeDataset = transistorNode.getDataset();

            transistorNodeDataset.accentColor.should.equal(dataset.accentColor);
            transistorNodeDataset.backgroundColor.should.equal(dataset.backgroundColor);
            transistorNodeDataset.visibility.web.nonMember.should.be.false();
        }));
    });

    describe('getType', function () {
        it('returns the correct node type', editorTest(function () {
            TransistorNode.getType().should.equal('transistor');
        }));
    });

    describe('clone', function () {
        it('returns a copy of the current node', editorTest(function () {
            const transistorNode = new TransistorNode(dataset);
            const transistorNodeDataset = transistorNode.getDataset();
            const clone = TransistorNode.clone(transistorNode);
            const cloneDataset = clone.getDataset();

            cloneDataset.should.deepEqual({...transistorNodeDataset});
        }));
    });

    describe('hasEditMode', function () {
        it('returns true', editorTest(function () {
            const transistorNode = new TransistorNode(dataset);
            transistorNode.hasEditMode().should.be.true();
        }));
    });

    describe('isEmpty', function () {
        it('returns false', editorTest(function () {
            const transistorNode = new TransistorNode(dataset);
            transistorNode.isEmpty().should.be.false();
        }));
    });

    describe('default visibility', function () {
        it('defaults to members-only (nonMember: false)', editorTest(function () {
            const transistorNode = new TransistorNode();
            transistorNode.visibility.web.nonMember.should.be.false();
            transistorNode.visibility.web.memberSegment.should.equal('status:free,status:-free');
            transistorNode.visibility.email.memberSegment.should.equal('status:free,status:-free');
        }));

        it('preserves custom visibility when provided', editorTest(function () {
            const customVisibility = {
                web: {
                    nonMember: false,
                    memberSegment: 'status:-free' // paid only
                },
                email: {
                    memberSegment: 'status:-free'
                }
            };
            const transistorNode = new TransistorNode({visibility: customVisibility});
            transistorNode.visibility.should.deepEqual(customVisibility);
        }));
    });

    describe('exportDOM', function () {
        // Public visibility for basic rendering tests (no visibility wrapping)
        const publicVisibility = {
            web: {
                nonMember: true,
                memberSegment: 'status:free,status:-free'
            },
            email: {
                memberSegment: 'status:free,status:-free'
            }
        };

        it('renders an iframe with the correct base URL', editorTest(function () {
            const transistorNode = new TransistorNode({visibility: publicVisibility});
            const {element} = transistorNode.exportDOM(exportOptions);

            element.tagName.should.equal('FIGURE');
            element.classList.contains('kg-card').should.be.true();
            element.classList.contains('kg-transistor-card').should.be.true();

            const iframe = element.querySelector('iframe');
            iframe.should.exist;
            iframe.getAttribute('src').should.equal('https://partner.transistor.fm/ghost/embed/{uuid}');
            iframe.getAttribute('width').should.equal('100%');
            iframe.getAttribute('height').should.equal('180');
            iframe.getAttribute('frameborder').should.equal('no');
            iframe.getAttribute('scrolling').should.equal('no');
            iframe.hasAttribute('seamless').should.be.true();
        }));

        it('includes color param when accentColor is set', editorTest(function () {
            const transistorNode = new TransistorNode({accentColor: '#8B5CF6', visibility: publicVisibility});
            const {element} = transistorNode.exportDOM(exportOptions);

            const iframe = element.querySelector('iframe');
            iframe.getAttribute('src').should.equal('https://partner.transistor.fm/ghost/embed/{uuid}?color=8B5CF6');
        }));

        it('includes background param when backgroundColor is set', editorTest(function () {
            const transistorNode = new TransistorNode({backgroundColor: '#FFFFFF', visibility: publicVisibility});
            const {element} = transistorNode.exportDOM(exportOptions);

            const iframe = element.querySelector('iframe');
            iframe.getAttribute('src').should.equal('https://partner.transistor.fm/ghost/embed/{uuid}?background=FFFFFF');
        }));

        it('includes both color params when both are set', editorTest(function () {
            const transistorNode = new TransistorNode({
                accentColor: '#8B5CF6',
                backgroundColor: '#1F2937',
                visibility: publicVisibility
            });
            const {element} = transistorNode.exportDOM(exportOptions);

            const iframe = element.querySelector('iframe');
            iframe.getAttribute('src').should.equal('https://partner.transistor.fm/ghost/embed/{uuid}?color=8B5CF6&background=1F2937');
        }));

        it('strips # from color values', editorTest(function () {
            const transistorNode = new TransistorNode({
                accentColor: '#FF0000',
                backgroundColor: '#00FF00',
                visibility: publicVisibility
            });
            const {element} = transistorNode.exportDOM(exportOptions);

            const iframe = element.querySelector('iframe');
            const src = iframe.getAttribute('src');
            src.should.not.containEql('#');
            src.should.containEql('color=FF0000');
            src.should.containEql('background=00FF00');
        }));

        it('renders with web visibility gating', editorTest(function () {
            exportOptions.target = 'web';
            // Default visibility has nonMember: false
            const transistorNode = new TransistorNode({});
            const {element} = transistorNode.exportDOM(exportOptions);

            // Should be wrapped in visibility gating
            element.tagName.should.equal('TEXTAREA');
            element.value.should.match(/<!--kg-gated-block:begin nonMember:false memberSegment:"status:free,status:-free" -->/);
        }));

        it('renders with email visibility when segment is restricted', editorTest(function () {
            exportOptions.target = 'email';
            const transistorNode = new TransistorNode({
                visibility: {
                    web: {nonMember: false, memberSegment: 'status:free,status:-free'},
                    email: {memberSegment: 'status:-free'} // paid only
                }
            });
            const {element, type} = transistorNode.exportDOM(exportOptions);

            type.should.equal('html');
            element.tagName.should.equal('DIV');
            element.dataset.ghSegment.should.equal('status:-free');
        }));
    });

    describe('exportJSON', function () {
        it('contains all data', editorTest(function () {
            const transistorNode = new TransistorNode(dataset);
            const json = transistorNode.exportJSON();

            json.should.deepEqual({
                type: 'transistor',
                version: 1,
                accentColor: '#8B5CF6',
                backgroundColor: '#FFFFFF',
                visibility: {
                    web: {
                        nonMember: false,
                        memberSegment: 'status:free,status:-free'
                    },
                    email: {
                        memberSegment: 'status:free,status:-free'
                    }
                }
            });
        }));

        it('exports empty strings for unset colors', editorTest(function () {
            const transistorNode = new TransistorNode({});
            const json = transistorNode.exportJSON();

            json.accentColor.should.equal('');
            json.backgroundColor.should.equal('');
        }));
    });

    describe('importJSON', function () {
        it('imports all data', function (done) {
            const serializedData = JSON.stringify({
                root: {
                    children: [{
                        type: 'transistor',
                        version: 1,
                        accentColor: '#FF5500',
                        backgroundColor: '#000000',
                        visibility: {
                            web: {
                                nonMember: false,
                                memberSegment: 'status:-free'
                            },
                            email: {
                                memberSegment: 'status:-free'
                            }
                        }
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
                    const [transistorNode] = $getRoot().getChildren();
                    $isTransistorNode(transistorNode).should.be.true();
                    transistorNode.accentColor.should.equal('#FF5500');
                    transistorNode.backgroundColor.should.equal('#000000');
                    transistorNode.visibility.web.nonMember.should.be.false();
                    transistorNode.visibility.web.memberSegment.should.equal('status:-free');

                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });

    describe('getTextContent', function () {
        it('returns empty string', editorTest(function () {
            const transistorNode = new TransistorNode(dataset);
            transistorNode.getTextContent().should.equal('');
        }));
    });
});
