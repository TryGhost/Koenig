import CardContext from '../context/CardContext';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar';
import {EDIT_CARD_COMMAND} from '../plugins/KoenigBehaviourPlugin';
import {PaywallCard} from '../components/ui/cards/PaywallCard';
import {ToolbarMenu, ToolbarMenuItem} from '../components/ui/ToolbarMenu';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function PaywallNodeComponent({nodeKey, heading, description, buttonText}) {
    const [editor] = useLexicalComposerContext();
    const {isEditing, isSelected} = React.useContext(CardContext);

    const handleToolbarEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        editor.dispatchCommand(EDIT_CARD_COMMAND, {cardKey: nodeKey, focusEditor: false});
    };

    const updateProperty = propertyName => (event) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node[propertyName] = event.target.value;
        });
    };

    return (
        <>
            <PaywallCard
                buttonText={buttonText}
                description={description}
                heading={heading}
                isEditing={isEditing}
                updateButtonText={updateProperty('buttonText')}
                updateDescription={updateProperty('description')}
                updateHeading={updateProperty('heading')}
            />

            <ActionToolbar
                data-kg-card-toolbar="paywall"
                isVisible={isSelected && !isEditing}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem dataTestId="edit-paywall-cta" icon="edit" isActive={false} label="Customize upgrade message" onClick={handleToolbarEdit} />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}
