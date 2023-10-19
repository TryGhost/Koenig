import assert from 'assert/strict';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {ListItemNode, ListNode} from '@lexical/list';
import {LinkNode} from '@lexical/link';
import {DEFAULT_NODES} from '@tryghost/kg-default-nodes';
import {createHeadlessEditor} from '@lexical/headless';
import {CreateEditorArgs} from 'lexical';
import {registerDefaultTransforms} from '../';

const defaultNodes: any[] = [
    // basic HTML nodes
    HeadingNode,
    LinkNode,
    ListItemNode,
    ListNode,
    QuoteNode,

    // Koenig nodes
    ...DEFAULT_NODES
];

const defaultEditorConfig: CreateEditorArgs = {
    nodes: defaultNodes,
    onError(e: Error) {
        throw e;
    }
};

const createEditor = function (config?: CreateEditorArgs) {
    const editorConfig: CreateEditorArgs = Object.assign({}, defaultEditorConfig, config);
    const editor = createHeadlessEditor(editorConfig);

    return editor;
};

describe('Default transforms', function () {
    it('registerDefaultTransforms() registers all transforms', function () {
        const editor = createEditor();

        // method under test
        registerDefaultTransforms(editor);

        // "invalid" editor state that should be transformed
        const state = JSON.stringify({
            root: {
                children: [
                    // nested paragraphs
                    {
                        children: [
                            {
                                detail: 0,
                                format: 0,
                                mode: 'normal',
                                style: '',
                                text: 'Normal',
                                type: 'extended-text',
                                version: 1
                            },
                            {
                                children: [
                                    {
                                        detail: 0,
                                        format: 0,
                                        mode: 'normal',
                                        style: '',
                                        text: 'Nested',
                                        type: 'extended-text',
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
                        type: 'paragraph',
                        version: 1
                    },

                    // adjacent lists
                    {
                        children: [
                            {
                                children: [
                                    {
                                        detail: 0,
                                        format: 0,
                                        mode: 'normal',
                                        style: '',
                                        text: 'one',
                                        type: 'extended-text',
                                        version: 1
                                    }
                                ],
                                direction: 'ltr',
                                format: '',
                                indent: 0,
                                type: 'listitem',
                                version: 1,
                                value: 1
                            }
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        type: 'list',
                        version: 1,
                        listType: 'bullet',
                        start: 1,
                        tag: 'ul'
                    },
                    {
                        children: [
                            {
                                children: [
                                    {
                                        detail: 0,
                                        format: 0,
                                        mode: 'normal',
                                        style: '',
                                        text: 'two',
                                        type: 'extended-text',
                                        version: 1
                                    }
                                ],
                                direction: 'ltr',
                                format: '',
                                indent: 0,
                                type: 'listitem',
                                version: 1,
                                value: 1
                            }
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        type: 'list',
                        version: 1,
                        listType: 'bullet',
                        start: 1,
                        tag: 'ul'
                    },

                    // heading with center alignment
                    {
                        children: [
                            {
                                detail: 0,
                                format: 0,
                                mode: 'normal',
                                style: '',
                                text: 'Aligned header',
                                type: 'extended-text',
                                version: 1
                            }
                        ],
                        direction: 'ltr',
                        format: 2,
                        indent: 0,
                        type: 'heading',
                        version: 1,
                        tag: 'h1'
                    }
                ]
            }
        });

        const editorState = editor.parseEditorState(state);
        editor.setEditorState(editorState);

        const transformedEditorState = editor.getEditorState().toJSON();
        assert.deepEqual(transformedEditorState, {
            root: {
                children: [
                    // de-nested paragraphs
                    {
                        children: [
                            {
                                detail: 0,
                                format: 0,
                                mode: 'normal',
                                style: '',
                                text: 'Normal',
                                type: 'extended-text',
                                version: 1
                            }
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        type: 'paragraph',
                        version: 1
                    },
                    {
                        children: [
                            {
                                detail: 0,
                                format: 0,
                                mode: 'normal',
                                style: '',
                                text: 'Nested',
                                type: 'extended-text',
                                version: 1
                            }
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        type: 'paragraph',
                        version: 1
                    },

                    // adjacent lists merged
                    {
                        children: [
                            {
                                children: [
                                    {
                                        detail: 0,
                                        format: 0,
                                        mode: 'normal',
                                        style: '',
                                        text: 'one',
                                        type: 'extended-text',
                                        version: 1
                                    }
                                ],
                                direction: 'ltr',
                                format: '',
                                indent: 0,
                                type: 'listitem',
                                version: 1,
                                value: 1
                            },
                            {
                                children: [
                                    {
                                        detail: 0,
                                        format: 0,
                                        mode: 'normal',
                                        style: '',
                                        text: 'two',
                                        type: 'extended-text',
                                        version: 1
                                    }
                                ],
                                direction: 'ltr',
                                format: '',
                                indent: 0,
                                type: 'listitem',
                                version: 1,
                                value: 2
                            }
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        type: 'list',
                        version: 1,
                        listType: 'bullet',
                        start: 1,
                        tag: 'ul'
                    },

                    // heading with alignment format reset
                    {
                        children: [
                            {
                                detail: 0,
                                format: 0,
                                mode: 'normal',
                                style: '',
                                text: 'Aligned header',
                                type: 'extended-text',
                                version: 1
                            }
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        type: 'heading',
                        version: 1,
                        tag: 'h1'
                    }
                ]
            }
        });
    });
});
