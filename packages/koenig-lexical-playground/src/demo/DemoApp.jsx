import {
    KoenigComposer,
    KoenigEditor,
    CodeBlockNode,
    DEFAULT_NODES,
    CODE_BLOCK_TRANSFORMER,
    DEFAULT_TRANSFORMERS
} from '../lib';
import SlashMenuPlugin from '../lib/plugins/SlashMenu';
import TreeViewPlugin from './TreeViewPlugin';
import Preview from './preview';

const nodes = [...DEFAULT_NODES, CodeBlockNode];

const transformers = [
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
