import Portal from './Portal.jsx';
import React from 'react';
import {$createRangeSelection, $getSelection, $setSelection} from 'lexical';
import {$getSelectionRangeRect} from '../../utils/$getSelectionRangeRect.js';
import {LinkInputCopy} from './LinkInputCopy.jsx';
import {TOGGLE_LINK_COMMAND} from '@lexical/link';
import {getScrollParent} from '../../utils/getScrollParent.js';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function LinkActionToolbarCopy({anchorElem, href, onClose, ...props}) {
    const [editor] = useLexicalComposerContext();

    const [portalContainer] = React.useState(() => {
        return getScrollParent(editor.getRootElement());
    });

    const linkToolbarRef = React.useRef(null);

    // Position the link input and search results when they open.
    // By default appears below the selected text.
    const updateLinkToolbarPosition = React.useCallback(() => {
        editor.update(() => {
            const toolbarElement = linkToolbarRef.current;
            if (!toolbarElement) {
                return;
            }

            const selection = $getSelection();
            const rangeRect = $getSelectionRangeRect({editor, selection});

            const scrollerElem = anchorElem.parentElement;

            if (!rangeRect || !scrollerElem || !toolbarElement) {
                return;
            }

            const editorScrollerRect = scrollerElem.getBoundingClientRect();

            const top = rangeRect.bottom + 10;
            const left = editorScrollerRect.left;
            const right = editorScrollerRect.right;

            toolbarElement.style.top = `${top}px`;
            toolbarElement.style.left = `${left}px`;
            toolbarElement.style.width = `${right - left}px`;
        });
    }, [anchorElem, editor]);

    React.useEffect(() => {
        updateLinkToolbarPosition();
    }, [updateLinkToolbarPosition]);

    // update padding on the portal container so the portal can always be scrolled
    // into view when it would otherwise be cut off at the bottom of the screen
    React.useEffect(() => {
        const toolbarElement = linkToolbarRef.current;

        if (toolbarElement) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.target === toolbarElement) {
                        portalContainer.style.paddingBottom = `${entry.contentRect.height}px`;
                    }
                }
            });

            resizeObserver.observe(toolbarElement);

            return () => {
                resizeObserver.unobserve(toolbarElement);
                portalContainer.style.paddingBottom = null;
            };
        }
    }, [portalContainer]);

    React.useEffect(() => {
        const scrollElement = getScrollParent(anchorElem);

        window.addEventListener('resize', updateLinkToolbarPosition);
        if (scrollElement) {
            scrollElement.addEventListener('scroll', updateLinkToolbarPosition);
        }

        return () => {
            window.removeEventListener('resize', updateLinkToolbarPosition);
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', updateLinkToolbarPosition);
            }
        };
    }, [anchorElem, updateLinkToolbarPosition]);

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
        <Portal to={portalContainer}>
            <div ref={linkToolbarRef} className="not-kg-prose fixed z-[10000]">
                <LinkInputCopy
                    cancel={onClose}
                    href={href}
                    update={onLinkUpdate}
                    {...props}
                />
            </div>
        </Portal>
    );
}
