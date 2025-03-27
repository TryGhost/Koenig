import React from 'react';
import {$getNodeByKey} from 'lexical';
import {SELECT_CARD_COMMAND} from '../plugins/KoenigBehaviourPlugin';

export function useVisibilitySettingsToggle(editor, nodeKey, isSelected, showVisibilitySettings, setShowVisibilitySettings) {
    return React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        editor.update(() => {
            const cardNode = $getNodeByKey(nodeKey);

            if (cardNode) {
                // When first activated, set to true, otherwise toggle
                setShowVisibilitySettings(showVisibilitySettings ? false : true);
                
                // If not selected, select the card but don't enter edit mode
                if (!isSelected) {
                    editor.dispatchCommand(SELECT_CARD_COMMAND, {cardKey: nodeKey, focusEditor: true});
                }
            }
        });
    }, [editor, isSelected, nodeKey, setShowVisibilitySettings, showVisibilitySettings]);
} 