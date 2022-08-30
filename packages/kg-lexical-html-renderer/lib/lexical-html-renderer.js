class LexicalHtmlRenderer {
    constructor(options = {}) {
        this.options = {
            transformers: options.transformers || []
        };
    }

    render(editorState, _transformOptions) {
        const {createHeadlessEditor} = require('@lexical/headless');
        const {$convertToHtmlString} = require('./convert-to-html-string');

        const defaultTransformOptions = {
            target: 'html'
        };
        const transformOptions = Object.assign({}, defaultTransformOptions, _transformOptions);

        const editor = createHeadlessEditor({
            nodes: []
        });

        editor.setEditorState(editor.parseEditorState(editorState));

        let html = '';

        editor.update(() => {
            html = $convertToHtmlString(transformOptions);
        });

        return html;
    }
}

module.exports = LexicalHtmlRenderer;
