import * as React from 'react';
import CardContext from '../context/CardContext';
import cleanBasicHtml from '@tryghost/kg-clean-basic-html';
import populateNestedEditor from '../utils/populateNestedEditor';
import {$generateHtmlFromNodes} from '@lexical/html';
import {$getNodeByKey} from 'lexical';
import {BASIC_NODES, KoenigCardWrapper} from '../index.js';
import {CodeBlockNode as BaseCodeBlockNode} from '@tryghost/kg-default-nodes';
import {CodeBlockCard} from '../components/ui/cards/CodeBlockCard';
import {ReactComponent as CodeBlockIcon} from '../assets/icons/kg-card-type-gen-embed.svg';
import {createEditor} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_CODE_BLOCK_COMMAND} from '@tryghost/kg-default-nodes';

function CodeBlockNodeComponent({nodeKey, captionEditor, code, language}) {
    const [editor] = useLexicalComposerContext();
    const cardContext = React.useContext(CardContext);

    const updateCode = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setCode(value);
        });
    };

    const updateLanguage = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setLanguage(value);
        });
    };

    return (
        <CodeBlockCard
            captionEditor={captionEditor}
            code={code}
            isEditing={cardContext.isEditing}
            language={language}
            nodeKey={nodeKey}
            updateCode={updateCode}
            updateLanguage={updateLanguage}
        />
    );
}

export class CodeBlockNode extends BaseCodeBlockNode {
    // transient properties used to control node behaviour
    __openInEditMode = false;

    constructor(dataset = {}, key) {
        super(dataset, key);

        const {_openInEditMode} = dataset;
        this.__openInEditMode = _openInEditMode || false;
        
        // set up and populate nested editors from the serialized HTML
        this.__captionEditor = dataset.captionEditor || createEditor({nodes: BASIC_NODES});
        if (!dataset.captionEditor) {
            populateNestedEditor({editor: this.__captionEditor, initialHtml: dataset.caption});
        }
    }

    getIcon() {
        return CodeBlockIcon;
    }

    clearOpenInEditMode() {
        const self = this.getWritable();
        self.__openInEditMode = false;
    }

    getDataset() {
        const dataset = super.getDataset();

        // client-side only data properties such as nested editors
        const self = this.getLatest();
        dataset.captionEditor = self.__captionEditor;

        return dataset;
    }

    exportJSON() {
        const json = super.exportJSON();

        // convert nested editor instances back into HTML because their content may not
        // be automatically updated when the nested editor changes
        if (this.__captionEditor) {
            this.__captionEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__captionEditor, null);
                const cleanedHtml = cleanBasicHtml(html);
                json.caption = cleanedHtml;
            });
        }

        return json;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()} width={this.__cardWidth} wrapperStyle="code-card">
                <CodeBlockNodeComponent
                    caption={this.__caption}
                    code={this.__code}
                    language={this.__language}
                    nodeKey={this.getKey()}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createCodeBlockNode(dataset) {
    return new CodeBlockNode(dataset);
}

export function $isCodeBlockNode(node) {
    return node instanceof CodeBlockNode;
}
