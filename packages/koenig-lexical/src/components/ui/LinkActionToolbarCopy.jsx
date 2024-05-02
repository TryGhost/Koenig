import React from 'react';
import {$createRangeSelection, $getSelection, $setSelection} from 'lexical';
import {LinkInputCopy} from './LinkInputCopy.jsx';
import {TOGGLE_LINK_COMMAND} from '@lexical/link';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function LinkActionToolbarCopy({href, onClose, ...props}) {
    const [editor] = useLexicalComposerContext();

    const onLinkUpdate = (updatedHref) => {
        editor.update(() => {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, updatedHref || null);
            // remove selection to avoid format menu popup
            const selection = $getSelection();
            const focusNode = selection.focus.getNode();
            const rangeSelection = $createRangeSelection();
            rangeSelection.setTextNodeRange(focusNode, focusNode.getTextContentSize(), focusNode, focusNode.getTextContentSize());
            $setSelection(rangeSelection);
            onClose();
        });
    };
    return (
        <LinkInputCopy
            cancel={onClose}
            href={href}
            update={onLinkUpdate}
            {...props}
        />
    );
}
