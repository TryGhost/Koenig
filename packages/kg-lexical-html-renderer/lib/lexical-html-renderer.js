class LexicalHTMLRenderer {
    render(lexicalState, userOptions = {}) {
        const {createHeadlessEditor} = require('@lexical/headless');
        const {$generateHtmlFromNodes} = require('@lexical/html');
        const jsdom = require('jsdom');
        const {JSDOM} = jsdom;

        // set up rendering options
        const defaultOptions = {
            target: 'html'
        };
        // TODO: use our own version of $generateHtmlFromNodes that can pass options to the `exportDOM()` node methods
        const options = Object.assign({}, defaultOptions, userOptions); // eslint-disable-line no-unused-vars

        // set up lexical editor instance
        const editor = createHeadlessEditor({
            nodes: [],
            theme: require('./themes/default')
        });
        editor.setEditorState(editor.parseEditorState(lexicalState));

        // generate the HTML
        try {
            const {window} = new JSDOM();
            global.window = window;
            global.document = window.document;
            global.DocumentFragment = window.DocumentFragment;

            let html = '';

            editor.update(() => {
                html = $generateHtmlFromNodes(editor, null);
            });

            return html;
        } finally {
            delete global.window;
            delete global.document;
            delete global.DocumentFragment;
        }
    }
}

module.exports = LexicalHTMLRenderer;
