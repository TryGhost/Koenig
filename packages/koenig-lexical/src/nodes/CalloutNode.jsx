import CardContext from '../context/CardContext';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {CalloutNode as BaseCalloutNode, INSERT_CALLOUT_COMMAND} from '@tryghost/kg-default-nodes';
import {CalloutCard} from '../components/ui/cards/CalloutCard';
import {ReactComponent as CalloutCardIcon} from '../assets/icons/kg-card-type-callout.svg';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_CALLOUT_COMMAND} from '@tryghost/kg-default-nodes';

function CalloutNodeComponent({nodeKey, text, hasEmoji, backgroundColor}) {
    const [editor] = useLexicalComposerContext();

    const {isSelected, isEditing, setEditing} = React.useContext(CardContext);

    const setText = (newText) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setText(newText);
        });
    };

    return (
        <CalloutCard
            color={backgroundColor}
            editor={editor}
            emoji={hasEmoji}
            isEditing={true}
            isSelected={isSelected}
            nodeKey={nodeKey}
            setEditing={setEditing}
            text={text}
            updateText={setText}
        />
    );
}

export class CalloutNode extends BaseCalloutNode {
    static kgMenu = [{
        label: 'Callout',
        desc: 'Info boxes that stand out',
        Icon: CalloutCardIcon,
        insertCommand: INSERT_CALLOUT_COMMAND,
        matches: ['callout']
    }];

    getIcon() {
        return CalloutCardIcon;
    }

    constructor(dataset = {}, key) {
        super(dataset, key);
    }

    createDOM() {
        return document.createElement('div');
    }

    getDataset() {
        return super.getDataset();
    }

    updateDOM() {
        return false;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()}>
                <CalloutNodeComponent
                    backgroundColor={this.__backgroundColor}
                    hasEmoji={this.__hasEmoji}
                    nodeKey={this.getKey()}
                    text={this.__text}
                />
            </KoenigCardWrapper>
        );
    }
}

export const $createCalloutNode = (dataset) => {
    return new CalloutNode(dataset);
};

export function $isCalloutNode(node) {
    return node instanceof CalloutNode;
}
