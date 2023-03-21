import CardContext from '../context/CardContext';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar.jsx';
import {ButtonNode as BaseButtonNode, INSERT_BUTTON_COMMAND} from '@tryghost/kg-default-nodes';
import {ButtonCard} from '../components/ui/cards/ButtonCard';
import {ReactComponent as ButtonCardIcon} from '../assets/icons/kg-card-type-button.svg';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_BUTTON_COMMAND} from '@tryghost/kg-default-nodes';

function ButtonNodeComponent({alignment, buttonUrl, nodeKey, buttonText}) {
    const [editor] = useLexicalComposerContext();
    const {isSelected, isEditing, setEditing} = React.useContext(CardContext);

    const handleButtonTextChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setButtonText(value);
        });
    };

    const handleButtonUrlChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setButtonUrl(value);
        });
    };

    const handleAlignmentChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setAlignment(value);
        });
    };

    const handleToolbarEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setEditing(true);
    };

    return (
        <>
            <ButtonCard
                alignment={alignment}
                buttonUrl={buttonUrl}
                isEditing={isEditing}
                nodeKey={nodeKey}
                setEditing={setEditing}
                buttonText={buttonText}
                updateAlingment={handleAlignmentChange}
                updateButtonUrl={handleButtonUrlChange}
                updateButtonText={handleButtonTextChange}
            />
            <ActionToolbar 
                data-kg-card-toolbar="button"
                isVisible={isSelected && !isEditing}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem dataTestId="edit-button-card" icon="edit" isActive={false} label="Edit" onClick={handleToolbarEdit} />
                    <ToolbarMenuSeparator />
                    <ToolbarMenuItem icon="snippet" isActive={false} label="Snippet" />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}

export class ButtonNode extends BaseButtonNode {
    static kgMenu = {
        label: 'Button',
        desc: 'Add a button to your post',
        insertCommand: INSERT_BUTTON_COMMAND,
        matches: ['button']
    };

    constructor(dataset = {}, key) {
        super(dataset, key);
    }

    getIcon() {
        return ButtonCardIcon;
    }

    createDOM() {
        const div = document.createElement('div');
        return div;
    }

    decorate() {
        return (
            <KoenigCardWrapper
                nodeKey={this.getKey()}
                width={this.__cardWidth}
            >
                <ButtonNodeComponent
                    alignment={this.__alignment}
                    buttonText={this.__buttonText}
                    buttonUrl={this.__buttonUrl}
                    nodeKey={this.getKey()}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createButtonNode(dataset) {
    return new ButtonNode(dataset);
}

export function $isButtonNode(node) {
    return node instanceof ButtonNode;
}
