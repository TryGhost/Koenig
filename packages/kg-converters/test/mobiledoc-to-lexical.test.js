const assert = require('assert');
const {mobiledocToLexical} = require('../');

const MOBILEDOC_VERSION = '0.3.1';
const GHOST_VERSION = '4.0';

const BLANK_DOC = {
    root: {
        children: [],
        direction: null, 
        format: '',
        indent: 0,
        type: 'root',
        version: 1
    }
};

describe('mobiledocToLexical', function () {
    it('returns empty doc for null', function () {
        const result = mobiledocToLexical(null);
        assert.equal(result, JSON.stringify(BLANK_DOC));
    });

    it('returns empty doc for undefined', function () {
        const result = mobiledocToLexical(undefined);
        assert.equal(result, JSON.stringify(BLANK_DOC));
    });

    it('returns empty doc for empty string', function () {
        const result = mobiledocToLexical('');
        assert.equal(result, JSON.stringify(BLANK_DOC));
    });

    describe('rich-text', function () {
        it('converts a single blank paragraph', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                atoms: [],
                cards: [],
                markups: [],
                sections: [[1,'p',[]]],
                ghostVersion: GHOST_VERSION
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [{
                        children: [],
                        direction: null,
                        format: '',
                        indent: 0,
                        type: 'paragraph',
                        version: 1
                    }],
                    direction: null,
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a single populated paragraph', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                atoms: [],
                cards: [],
                markups: [],
                sections: [
                    [1,'p',[[0,[],0,'This is a paragraph.']]]
                ],
                ghostVersion: GHOST_VERSION
            }));

            assert.equal(result, JSON.stringify({root: {
                children: [{
                    children: [{
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'This is a paragraph.',
                        type: 'text',
                        version: 1
                    }],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1
                }],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1
            }}));
        });

        it('converts multiple paragraphs', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                atoms: [],
                cards: [],
                markups: [],
                sections: [
                    [1,'p',[[0,[],0,'This is a paragraph.']]],
                    [1,'p',[[0,[],0,'This is yet another one!']]]
                ],
                ghostVersion: GHOST_VERSION
            }));

            assert.equal(result, JSON.stringify({root: {
                children: [{
                    children: [{
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'This is a paragraph.',
                        type: 'text',
                        version: 1
                    }],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1
                }, {
                    children: [{
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'This is yet another one!',
                        type: 'text',version: 1
                    }],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1
                }],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1
            }}));
        });

        it('converts a paragraph with strong text', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                atoms: [],
                cards: [],
                markups: [['strong']],
                sections: [
                    [1,'p',[[0,[],0,'Hello '],
                        [0,[0],1,'world'],
                        [0,[],0,'!']]]
                ],
                ghostVersion: GHOST_VERSION
            }));

            assert.equal(result, JSON.stringify({root: {
                children: [{
                    children: [{
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Hello ',
                        type: 'text',
                        version: 1
                    },{
                        detail: 0,
                        format: 1,
                        mode: 'normal',
                        style: '',
                        text: 'world',
                        type: 'text',
                        version: 1
                    },{
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: '!',
                        type: 'text',
                        version: 1
                    }],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1
                }],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1
            }}));
        });

        it('converts a paragraph with italic/emphasis text', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['em']
                ],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'Hello, '],
                        [0, [0], 1, 'world'],
                        [0, [], 0, '!']
                    ]]
                ]
            }));
            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Hello, ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 2,
                                    mode: 'normal',
                                    style: '',
                                    text: 'world',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: '!',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with strong and italic text', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['strong'],
                    ['em']
                ],
                sections: [
                    [1, 'p', [
                        [0, [0], 0, 'Hello, '],
                        [0, [1], 1, 'world'],
                        [0, [], 1, '!']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 1,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Hello, ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 3,
                                    mode: 'normal',
                                    style: '',
                                    text: 'world',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 1,
                                    mode: 'normal',
                                    style: '',
                                    text: '!',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts "Plain. Bold, bold+italic, italic. Plain."', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['strong'],
                    ['em']
                ],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'Plain. '],
                        [0, [0], 0, 'Bold, '],
                        [0, [1], 2, 'bold+italic, '], // both markups close because bold was opened first
                        [0, [1], 1, 'italic.'], // italic then has to re-open
                        [0, [], 0, ' Plain.']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Plain. ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 1,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Bold, ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 3,
                                    mode: 'normal',
                                    style: '',
                                    text: 'bold+italic, ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 2,
                                    mode: 'normal',
                                    style: '',
                                    text: 'italic.',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: ' Plain.',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with code text', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['code']
                ],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'Hello, '],
                        [0, [0], 1, 'world'],
                        [0, [], 0, '!']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Hello, ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 16,
                                    mode: 'normal',
                                    style: '',
                                    text: 'world',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: '!',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with strikethrough text', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['s']
                ],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'Hello, '],
                        [0, [0], 1, 'world'],
                        [0, [], 0, '!']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Hello, ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 4,
                                    mode: 'normal',
                                    style: '',
                                    text: 'world',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: '!',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with superscript text', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['sup']
                ],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'Hello, '],
                        [0, [0], 1, 'world'],
                        [0, [], 0, '!']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Hello, ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 64,
                                    mode: 'normal',
                                    style: '',
                                    text: 'world',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: '!',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with subscript text', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['sub']
                ],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'Hello, '],
                        [0, [0], 1, 'world'],
                        [0, [], 0, '!']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Hello, ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 32,
                                    mode: 'normal',
                                    style: '',
                                    text: 'world',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: '!',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with a link', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['a', ['href', 'https://koenig.ghost.org']]
                ],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'Hello, '],
                        [0, [0], 1, 'world'],
                        [0, [], 0, '!']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Hello, ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    children: [
                                        {
                                            detail: 0,
                                            format: 0,
                                            mode: 'normal',
                                            style: '',
                                            text: 'world',
                                            type: 'text',
                                            version: 1
                                        }
                                    ],
                                    direction: 'ltr',
                                    format: '',
                                    indent: 0,
                                    type: 'link',
                                    rel: null,
                                    target: null,
                                    title: null,
                                    url: 'https://koenig.ghost.org',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: '!',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with a link with a format starting and ending inside', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['a', ['href', 'https://koenig.ghost.org']],
                    ['strong']
                ],
                sections: [
                    [1,'p',[
                        [0, [], 0, 'Hello '],
                        [0, [0], 0, 'there '],
                        [0, [1], 1, 'beautiful'],
                        [0, [], 1, ' world'],
                        [0, [], 0, '!']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Hello ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    children: [
                                        {
                                            detail: 0,
                                            format: 0,
                                            mode: 'normal',
                                            style: '',
                                            text: 'there ',
                                            type: 'text',
                                            version: 1
                                        },
                                        {
                                            detail: 0,
                                            format: 1,
                                            mode: 'normal',
                                            style: '',
                                            text: 'beautiful',
                                            type: 'text',
                                            version: 1
                                        },
                                        {
                                            detail: 0,
                                            format: 0,
                                            mode: 'normal',
                                            style: '',
                                            text: ' world',
                                            type: 'text',
                                            version: 1
                                        }
                                    ],
                                    direction: 'ltr',
                                    format: '',
                                    indent: 0,
                                    type: 'link',
                                    rel: null,
                                    target: null,
                                    title: null,
                                    url: 'https://koenig.ghost.org',
                                    version: 1
                                    
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: '!',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with a link where format starts inside and ends after', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['a', ['href', 'https://koenig.ghost.org']],
                    ['strong']
                ],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'Plain '],
                        [0, [0], 0, 'link '],
                        [0, [1], 2, 'linkbold'],
                        [0, [1], 1, ' bold'],
                        [0, [], 0, ' plain']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Plain ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    children: [
                                        {
                                            detail: 0,
                                            format: 0,
                                            mode: 'normal',
                                            style: '',
                                            text: 'link ',
                                            type: 'text',
                                            version: 1
                                        },
                                        {
                                            detail: 0,
                                            format: 1,
                                            mode: 'normal',
                                            style: '',
                                            text: 'linkbold',
                                            type: 'text',
                                            version: 1
                                        }
                                    ],
                                    direction: 'ltr',
                                    format: '',
                                    indent: 0,
                                    type: 'link',
                                    rel: null,
                                    target: null,
                                    title: null,
                                    url: 'https://koenig.ghost.org',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 1,
                                    mode: 'normal',
                                    style: '',
                                    text: ' bold',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: ' plain',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with a link where format starts before and ends inside', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['strong'],
                    ['a', ['href', 'https://koenig.ghost.org']]
                ],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'Plain '],
                        [0, [0], 1, 'bold '],
                        [0, [1,0], 1, 'boldlink'],
                        [0, [], 1, ' link'],
                        [0, [], 0, ' plain']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Plain ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 1,
                                    mode: 'normal',
                                    style: '',
                                    text: 'bold ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    children: [
                                        {
                                            detail: 0,
                                            format: 1,
                                            mode: 'normal',
                                            style: '',
                                            text: 'boldlink',
                                            type: 'text',
                                            version: 1
                                        },
                                        {
                                            detail: 0,
                                            format: 0,
                                            mode: 'normal',
                                            style: '',
                                            text: ' link',
                                            type: 'text',
                                            version: 1
                                        }
                                    ],
                                    direction: 'ltr',
                                    format: '',
                                    indent: 0,
                                    type: 'link',
                                    rel: null,
                                    target: null,
                                    title: null,
                                    url: 'https://koenig.ghost.org',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: ' plain',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with a link surrounded by and containing formats', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [],
                cards: [],
                markups: [
                    ['strong'],
                    ['a', ['href', 'https://koenig.ghost.org']],
                    ['em']
                ],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'Plain '],
                        [0, [0], 1, 'startbold '],
                        [0, [1,0], 0, 'link '],
                        [0, [2], 1, 'italiclink'],
                        [0, [], 2, ' link'],
                        [0, [0], 1, ' endbold'],
                        [0, [], 0, ' plain']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Plain ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 1,
                                    mode: 'normal',
                                    style: '',
                                    text: 'startbold ',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    children: [
                                        {
                                            detail: 0,
                                            format: 1,
                                            mode: 'normal',
                                            style: '',
                                            text: 'link ',
                                            type: 'text',
                                            version: 1
                                        },
                                        {
                                            detail: 0,
                                            format: 3,
                                            mode: 'normal',
                                            style: '',
                                            text: 'italiclink',
                                            type: 'text',
                                            version: 1
                                        },
                                        {
                                            detail: 0,
                                            format: 1,
                                            mode: 'normal',
                                            style: '',
                                            text: ' link',
                                            type: 'text',
                                            version: 1
                                        }
                                    ],
                                    direction: 'ltr',
                                    format: '',
                                    indent: 0,
                                    type: 'link',
                                    rel: null,
                                    target: null,
                                    title: null,
                                    url: 'https://koenig.ghost.org',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 1,
                                    mode: 'normal',
                                    style: '',
                                    text: ' endbold',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: ' plain',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts a paragraph with line breaks', function () {
            const result = mobiledocToLexical(JSON.stringify({
                version: MOBILEDOC_VERSION,
                ghostVersion: GHOST_VERSION,
                atoms: [
                    ['soft-return', '', {}],
                    ['soft-return', '', {}]
                ],
                cards: [],
                markups: [],
                sections: [
                    [1, 'p', [
                        [0, [], 0, 'First line'],
                        [1, [], 0, 0],
                        [0, [], 0, 'Second line'],
                        [1, [], 0, 1],
                        [0, [], 0, 'Third line']
                    ]]
                ]
            }));

            assert.equal(result, JSON.stringify({
                root: {
                    children: [
                        {
                            children: [
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'First line',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    type: 'linebreak',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Second line',
                                    type: 'text',
                                    version: 1
                                },
                                {
                                    type: 'linebreak',
                                    version: 1
                                },
                                {
                                    detail: 0,
                                    format: 0,
                                    mode: 'normal',
                                    style: '',
                                    text: 'Third line',
                                    type: 'text',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1
                        }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            }));
        });

        it('converts headings');
        it('converts headings with links and formatting');

        it('converts blockquotes');
        it('converts blockquotes with links and formatting');

        it('converts asides');
        it('converts asides with links and formatting');

        it('converts unordered lists');
        it('converts unordered lists with links and formatting');

        it('converts ordered lists');
        it('converts ordered lists with links and formatting');
    });

    describe('cards', function () {
    });
});