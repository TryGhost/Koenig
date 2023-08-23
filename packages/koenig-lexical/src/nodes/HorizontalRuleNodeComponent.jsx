import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext.jsx';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar.jsx';
import {HorizontalRuleCard} from '../components/ui/cards/HorizontalRuleCard';
import {SnippetActionToolbar} from '../components/ui/SnippetActionToolbar.jsx';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu.jsx';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function HorizontalRuleNodeComponent({
    color, 
    nodeKey,
    size 
}) {
    const [editor] = useLexicalComposerContext();
    const {isEditing, isSelected, setEditing} = React.useContext(CardContext);
    const {cardConfig} = React.useContext(KoenigComposerContext);
    const [showSnippetToolbar, setShowSnippetToolbar] = React.useState(false);

    const handleToolbarEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setEditing(true);
    };

    const handleSizeChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.size = value;
        });
    };

    const handleColorChange = (color) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.color = color;
        });
    };

    return (
        <>
            <HorizontalRuleCard
                size={size}
                handleSizeChange={handleSizeChange}
                color={color}
                handleColorChange={handleColorChange}
                isEditing={isEditing}
            />
            <ActionToolbar
                data-kg-card-toolbar="horizontalrule"
                isVisible={showSnippetToolbar}
            >
                <SnippetActionToolbar onClose={() => setShowSnippetToolbar(false)} />
            </ActionToolbar>

            <ActionToolbar
                data-kg-card-toolbar="horizontalrule"
                isVisible={isSelected && !isEditing}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem dataTestId="edit-horizontalrule-card" icon="edit" isActive={false} label="Edit" onClick={handleToolbarEdit} />
                    <ToolbarMenuSeparator hide={!cardConfig.createSnippet} />
                    <ToolbarMenuItem
                        dataTestId="create-snippet"
                        hide={!cardConfig.createSnippet}
                        icon="snippet"
                        isActive={false}
                        label="Create snippet"
                        onClick={() => setShowSnippetToolbar(true)}
                    />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}