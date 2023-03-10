import * as React from 'react';
import CardContext from '../context/CardContext';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {$getNodeByKey} from 'lexical';
import {CodeBlockNode as BaseCodeBlockNode} from '@tryghost/kg-default-nodes';
import {CodeBlockCard} from '../components/ui/cards/CodeBlockCard';
import {ReactComponent as CodeBlockIcon} from '../assets/icons/kg-card-type-gen-embed.svg';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_CODE_BLOCK_COMMAND} from '@tryghost/kg-default-nodes';

function CodeBlockNodeComponent({nodeKey, caption, code, language}) {
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
            nodeKey={nodeKey}
            caption={caption}
            code={code}
            updateCode={updateCode}
            language={language}
            updateLanguage={updateLanguage}
            isEditing={cardContext.isEditing}
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
    }

    getIcon() {
        return CodeBlockIcon;
    }

    clearOpenInEditMode() {
        const self = this.getWritable();
        self.__openInEditMode = false;
    }

    decorate() {
        return (
            <KoenigCardWrapper wrapperStyle="code-card" nodeKey={this.getKey()} width={this.__cardWidth} openInEditMode={this.__openInEditMode}>
                <CodeBlockNodeComponent
                    nodeKey={this.getKey()}
                    caption={this.__caption}
                    code={this.__code}
                    language={this.__language}
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
