import {SerializedEditorState, LexicalEditor, LexicalNode} from 'lexical';

interface RenderOptions {
    target?: 'html' | 'plaintext';
    dom?: import('jsdom').JSDOM;
    // TODO: we should define some standard here once we move to more cards with dynamic data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderData?: Map<number, any>;
}

class LexicalHTMLRenderer {
    dom: import('jsdom').JSDOM;
    nodes: LexicalNode[];

    constructor({dom, nodes}: {dom?: import('jsdom').JSDOM, nodes?: LexicalNode[]} = {}) {
        if (!dom) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const jsdom = require('jsdom');
            const {JSDOM} = jsdom;

            this.dom = new JSDOM();
        } else {
            this.dom = dom;
        }

        this.nodes = nodes || [];
    }

    async render(lexicalState: SerializedEditorState | string, userOptions: RenderOptions = {}) {
        // TODO: we can't move these to imports unless they are top level
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {createHeadlessEditor} = require('@lexical/headless');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {ListItemNode, ListNode} = require('@lexical/list');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {HeadingNode, QuoteNode} = require('@lexical/rich-text');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {LinkNode} = require('@lexical/link');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {$convertToHtmlString} = require('./convert-to-html-string');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {getDynamicDataNodes} = require('./get-dynamic-data-nodes');

        const defaultOptions: RenderOptions = {
            target: 'html',
            dom: this.dom
        };
        const options = Object.assign({}, defaultOptions, userOptions);

        const DEFAULT_NODES = [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            LinkNode,
            ...this.nodes
        ];

        const editor: LexicalEditor = createHeadlessEditor({
            nodes: DEFAULT_NODES
        });

        const editorState = editor.parseEditorState(lexicalState);

        // gather nodes that require dynamic data
        const dynamicDataNodes = getDynamicDataNodes(editorState);

        // fetch dynamic data
        const renderData = new Map();
        await Promise.all(dynamicDataNodes.map(async (node: LexicalNode) => {
            const {key, data} = await node.getDynamicData(options);
            renderData.set(key, data);
        }));

        options.renderData = renderData;

        // render nodes
        editor.setEditorState(editorState);
        let html = '';

        editor.update(async () => {
            html = $convertToHtmlString(options);
        });

        return html;
    }
}

module.exports = LexicalHTMLRenderer;
