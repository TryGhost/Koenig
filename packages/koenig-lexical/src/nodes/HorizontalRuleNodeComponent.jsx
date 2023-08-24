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
    height,
    width,
    style
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

    const handleColorChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.color = value;
        });
    };

    const handleHeightChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.height = value;
        });
    };

    const handleWidthChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.width = value;
        });
    };

    const handleStyleChange = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.style = value;
        });
    };

    return (
        <>
            <HorizontalRuleCard
                color={color}
                handleColorChange={handleColorChange}
                handleHeightChange={handleHeightChange}
                handleStyleChange={handleStyleChange}
                handleWidthChange={handleWidthChange}
                height={height}
                isEditing={isEditing}
                style={style}
                width={width}
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