import KoenigComposerContext from '../context/KoenigComposerContext';
import Portal from '../components/ui/Portal';
import React from 'react';
import useBasicTypeaheadTriggerMatch from '../hooks/useTypeaheadTriggerMatch';
import {$createLinkNode} from '@lexical/link';
import {$createTextNode, $getSelection, $isRangeSelection} from 'lexical';
import {$getSelectionRangeRect} from '../utils/$getSelectionRangeRect';
import {InputListGroup, InputListItem, InputListLoadingItem} from '../components/ui/InputListCopy';
import {KeyboardSelectionWithGroups} from '../components/ui/KeyboardSelectionWithGroups';
import {LexicalTypeaheadMenuPlugin} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {getScrollParent} from '../utils/getScrollParent';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useSearchLinks} from '../hooks/useSearchLinks';

export const KoenigAtLinkPlugin = ({editor, searchLinks}) => {
    const [queryString, setQueryString] = React.useState('');
    const {listOptions, isSearching} = useSearchLinks(queryString, searchLinks, {showNoResults: false, showUrlResult: false});

    const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('@', {minLength: 0, maxLength: 75, allowSpace: true});

    const onLinkSelect = React.useCallback((selectedOption, nodeToRemove, closeMenu) => {
        editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection) || selectedOption === null) {
                return;
            }

            if (nodeToRemove) {
                nodeToRemove.remove();
            }

            const textNode = $createTextNode(selectedOption.label);
            textNode.setFormat(selection.format);

            const linkNode = $createLinkNode(selectedOption.value);
            linkNode.append(textNode);

            selection.insertNodes([linkNode]);

            closeMenu();
        });
    }, [editor]);

    function getItem(item, selected, onMouseOver) {
        return (
            <InputListItem
                key={item.value}
                dataTestId="at-menu"
                highlightString={queryString}
                item={item}
                selected={selected}
                onClick={onLinkSelect}
                onMouseOver={onMouseOver}
            />
        );
    }

    function getGroup(group) {
        return (
            <InputListGroup dataTestId="at-menu" group={group} />
        );
    }

    function renderMenu(
        anchorElementRef,
        {selectedIndex, selectOptionAndCleanUp, setHighlightedIndex}
    ) {
        if (anchorElementRef.current === null || !listOptions || listOptions.length === 0) {
            return null;
        }

        // TODO: check for competing keyboard control

        return (
            <PopupMenu
                anchorElem={anchorElementRef.current}
                editor={editor}
                getGroup={getGroup}
                getItem={getItem}
                isSearching={isSearching}
                listOptions={listOptions}
                selectOptionAndCleanUp={selectOptionAndCleanUp}
            />
        );
    }

    return (
        <LexicalTypeaheadMenuPlugin
            menuRenderFn={renderMenu}
            options={listOptions}
            triggerFn={checkForTriggerMatch}
            onQueryChange={setQueryString}
            onSelectOption={onLinkSelect}
        />
    );
};

// wrapping KoenigAtLinkPlugin means we can ensure all dependencies are available
// before rendering the plugin, avoiding complex conditionals in the plugin itself
export const AtLinkPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const {cardConfig} = React.useContext(KoenigComposerContext);

    // do nothing if we haven't been passed a way to search internal links
    if (!cardConfig?.searchLinks || !cardConfig?.feature?.internalLinking) {
        return null;
    }

    return <KoenigAtLinkPlugin editor={editor} searchLinks={cardConfig.searchLinks} />;
};

const PopupMenu = ({editor, getGroup, getItem, isSearching, listOptions, selectOptionAndCleanUp}) => {
    const popupRef = React.useRef(null);

    const scrollContainer = React.useMemo(() => {
        return getScrollParent(editor.getRootElement());
    }, [editor]);

    // Position the link input and search results when they open.
    // Appears below the selected text unless at bottom of the document where it appears above toolbar.
    const updatePopupPosition = React.useCallback(() => {
        editor.update(() => {
            const popupElement = popupRef.current;
            if (!popupElement) {
                return;
            }

            const selection = $getSelection();
            if (!selection) {
                return;
            }

            const rangeRect = $getSelectionRangeRect({editor, selection});

            const editorElem = editor.getRootElement();

            if (!rangeRect || !editorElem || !popupElement) {
                return;
            }

            const editorRect = editorElem.getBoundingClientRect();

            const top = rangeRect.bottom + 10;
            const left = editorRect.left;
            const right = editorRect.right;

            popupElement.style.top = `${top}px`;
            popupElement.style.left = `${left}px`;
            popupElement.style.width = `${right - left}px`;

            // TODO: Max height is hardcoded to 30% of window height for results list + 54px (toolbar height),
            //  this is based on current styling and will need adjusting if styles change. We make this calculation
            //  to avoid the toolbar jumping between above/below positioning when the results list changes size.
            const toolbarMaxHeight = (window.innerHeight / 100 * 30) + 54;
            const toolbarRect = popupElement.getBoundingClientRect();

            if (scrollContainer.scrollTop + toolbarRect.top + toolbarMaxHeight > scrollContainer.scrollHeight) {
                popupElement.style.top = `${rangeRect.top - toolbarRect.height - 55}px`;
            }
        });
    }, [editor, scrollContainer]);

    React.useEffect(() => {
        updatePopupPosition();
    }, [updatePopupPosition]);

    // re-position on document scroll, window resize,
    // plus search results change to avoid gap appearing when positioned above the toolbar
    React.useEffect(() => {
        window.addEventListener('resize', updatePopupPosition);
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', updatePopupPosition);
        }

        const popupElement = popupRef.current;
        const toolbarMutationObserver = new MutationObserver(updatePopupPosition);
        toolbarMutationObserver.observe(popupElement, {childList: true, subtree: true});

        return () => {
            window.removeEventListener('resize', updatePopupPosition);
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', updatePopupPosition);
            }
            if (popupElement) {
                toolbarMutationObserver.disconnect();
            }
        };
    }, [scrollContainer, updatePopupPosition]);

    return (
        <Portal>
            <div ref={popupRef} className="not-kg-prose fixed z-[10000]">
                <div className="relative m-0 flex w-full flex-col rounded-lg bg-white p-1 px-2 font-sans text-sm font-medium shadow-md dark:bg-grey-950">
                    <ul className="max-h-[30vh] w-full overflow-y-auto bg-white py-1 dark:bg-grey-950">
                        {isSearching && <InputListLoadingItem dataTestId="at-menu"/>}
                        <KeyboardSelectionWithGroups
                            getGroup={getGroup}
                            getItem={getItem}
                            groups={listOptions}
                            onSelect={selectOptionAndCleanUp}
                        />
                    </ul>
                </div>
            </div>
        </Portal>
    );
};

export default AtLinkPlugin;
