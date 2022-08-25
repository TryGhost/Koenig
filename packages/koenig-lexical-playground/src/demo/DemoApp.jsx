import {
    KoenigComposer,
    KoenigEditor,
    CodeBlockNode,
    DEFAULT_NODES,
    CODE_BLOCK_TRANSFORMER,
    DEFAULT_TRANSFORMERS
} from '../lib';
import {
    IframeLoadTestNode,
    $isIframeLoadTestNode,
    $createIframeLoadTestNode
} from './nodes/IframeLoadTestNode';
import SlashMenuPlugin from '../lib/plugins/SlashMenu';
import TreeViewPlugin from './TreeViewPlugin';
import Preview from './preview';

const nodes = [...DEFAULT_NODES, IframeLoadTestNode, CodeBlockNode];

const IFRAME_LOAD_TEST_TRANSFORMER = {
    export: (node) => {
        return $isIframeLoadTestNode(node) ? 'iframetest' : null;
    },
    regExp: /^(iframe)\s?$/,
    replace: (parentNode, _1, _2, isImport) => {
        const iframe = $createIframeLoadTestNode();

        // TODO: Get rid of isImport flag
        if (isImport || parentNode.getNextSibling() != null) { // eslint-disable-line
            parentNode.replace(iframe);
        } else {
            parentNode.insertBefore(iframe);
        }

        iframe.selectNext();
    },
    type: 'element'
};

const transformers = [
    IFRAME_LOAD_TEST_TRANSFORMER,
    CODE_BLOCK_TRANSFORMER,
    ...DEFAULT_TRANSFORMERS
];

function DemoApp() {
    return (
        <KoenigComposer nodes={nodes}>
            <div className="demo-container">
                <div className="demo-editor">
                    <KoenigEditor autoFocus={true} markdownTransformers={transformers}>
                        <SlashMenuPlugin />
                    </KoenigEditor>
                </div>
                <div className="demo-tree">
                    <TreeViewPlugin />
                </div>
            </div>
            <Preview />
        </KoenigComposer>
    );
}

export default DemoApp;
