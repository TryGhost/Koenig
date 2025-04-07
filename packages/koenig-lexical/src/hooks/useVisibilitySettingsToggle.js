import React from 'react';
import {SELECT_CARD_COMMAND} from '../plugins/KoenigBehaviourPlugin';

export function useVisibilitySettingsToggle(editor, nodeKey, isSelected, showVisibilitySettings, setShowVisibilitySettings) {
    return React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        editor.update(() => {
            setShowVisibilitySettings(!showVisibilitySettings);
            if (!isSelected) {
                editor.dispatchCommand(SELECT_CARD_COMMAND, {cardKey: nodeKey, focusEditor: true});
            }
        });
    }, [editor, isSelected, nodeKey, setShowVisibilitySettings, showVisibilitySettings]);
}
