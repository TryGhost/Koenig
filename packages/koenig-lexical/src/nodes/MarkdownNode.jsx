import CardContext from '../context/CardContext';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import KoenigComposerContext from '../context/KoenigComposerContext.jsx';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {MarkdownNode as BaseMarkdownNode, INSERT_MARKDOWN_COMMAND} from '@tryghost/kg-default-nodes';
import {MarkdownCard} from '../components/ui/cards/MarkdownCard';
import {ReactComponent as MarkdownCardIcon} from '../assets/icons/kg-card-type-markdown.svg';
import {ReactComponent as MarkdownIndicatorIcon} from '../assets/icons/kg-indicator-markdown.svg';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_MARKDOWN_COMMAND} from '@tryghost/kg-default-nodes';

function MarkdownNodeComponent({nodeKey, markdown}) {
    const [editor] = useLexicalComposerContext();
    const cardContext = React.useContext(CardContext);
    const {fileUploader, cardConfig} = React.useContext(KoenigComposerContext);

    const updateMarkdown = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setMarkdown(value);
        });
    };

    return (
        <MarkdownCard
            nodeKey={nodeKey}
            markdown={markdown}
            updateMarkdown={updateMarkdown}
            isEditing={cardContext.isEditing}
            imageUploader={fileUploader.useFileUpload}
            unsplashConf={cardConfig.unsplash}
        />
    );
}

export class MarkdownNode extends BaseMarkdownNode {
    static kgMenu = {
        label: 'Markdown',
        desc: 'Insert a Markdown editor card',
        Icon: MarkdownCardIcon,
        insertCommand: INSERT_MARKDOWN_COMMAND,
        matches: ['markdown', 'md']
    };

    static getType() {
        return 'markdown';
    }

    // transient properties used to control node behaviour
    __openInEditMode = false;

    constructor(dataset = {}, key) {
        super(dataset, key);

        const {_openInEditMode} = dataset;
        this.__openInEditMode = _openInEditMode || false;
    }

    getIcon() {
        return MarkdownCardIcon;
    }

    clearOpenInEditMode() {
        const self = this.getWritable();
        self.__openInEditMode = false;
    }

    decorate() {
        return (
            <KoenigCardWrapper
                nodeKey={this.getKey()}
                wrapperStyle="wide"
                width={this.__cardWidth}
                openInEditMode={this.__openInEditMode}
                IndicatorIcon={MarkdownIndicatorIcon}
            >
                <MarkdownNodeComponent
                    nodeKey={this.getKey()}
                    markdown={this.__markdown}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createMarkdownNode(dataset) {
    return new MarkdownNode(dataset);
}

export function $isMarkdownNode(node) {
    return node instanceof MarkdownNode;
}
