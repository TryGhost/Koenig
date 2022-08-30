import React from 'react';
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
import SerializedJSON from './SerializedJson';

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
    const [outputType, setOutputType] = React.useState('html');

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
            <hr />
            <div>
                <input type="radio" name="preview-type" value='html' checked={outputType === 'html'} onChange={() => setOutputType('html')} /> HTML
                <input type="radio" name="preview-type" value='json' checked={outputType === 'json'} onChange={() => setOutputType('json')} /> Serialized JSON
            </div>
            <div className='koenig-react mt-6'>
                {outputType === 'html' && <Preview />}
                {outputType === 'json' && <SerializedJSON />}
            </div>
        </KoenigComposer>
    );
}

export default DemoApp;
