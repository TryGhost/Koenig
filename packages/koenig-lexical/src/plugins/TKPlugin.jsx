import CardContext from '../context/CardContext';
import {$createTKNode, $isTKNode, ExtendedTextNode, TKNode} from '@tryghost/kg-default-nodes';
import {$getNodeByKey, $getSelection, $isRangeSelection, $nodesOfType, TextNode} from 'lexical';
import {createPortal} from 'react-dom';
import {useCallback, useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useKoenigTextEntity} from '../hooks/useKoenigTextEntity';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useTKContext} from '../context/TkContext';

const REGEX = new RegExp(/(^|.)([^\p{L}\p{N}\s]*(TK)+[^\p{L}\p{N}\s]*)(.)?/u);
const WORD_CHAR_REGEX = new RegExp(/\p{L}|\p{N}/u);

function TKIndicator({editor, rootElement, containingElement, nodeKeys}) {
    const tkClasses = editor._config.theme.tk?.split(' ') || [];
    const tkHighlightClasses = editor._config.theme.tkHighlighted?.split(' ') || [];

    // position element relative to the TK Node containing element
    const calculateTop = useCallback(() => {
        if (!containingElement) {
            return 0;
        }

        const rootElementRect = rootElement.getBoundingClientRect();
        const containerElementRect = containingElement.getBoundingClientRect();

        return containerElementRect.top - rootElementRect.top + 4;
    }, [rootElement, containingElement]);

    const [top, setTop] = useState(calculateTop());

    // select the TK node when the indicator is clicked,
    // cycle selection through associated TK nodes when clicked multiple times
    // TODO: may be some competition with the listener for clicking outside the editor since clicking on the indicator sometimes focuses the document body
    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        editor.update(() => {
            let nodeKeyToSelect = nodeKeys[0];

            // if there is a selection, and it is a TK node, select the next one
            const selection = $getSelection();
            if ($isRangeSelection(selection) && $isTKNode(selection.getNodes()[0])) {
                const selectedIndex = nodeKeys.indexOf(selection.getNodes()[0].getKey());
                if (selectedIndex === nodeKeys.length - 1) {
                    nodeKeyToSelect = nodeKeys[0];
                } else {
                    nodeKeyToSelect = nodeKeys[selectedIndex + 1];
                }
            }

            const node = $getNodeByKey(nodeKeyToSelect);
            node.select(0, node.getTextContentSize());
        });
    };

    // highlight all associated TK nodes when the indicator is hovered
    const onMouseEnter = (e) => {
        nodeKeys.forEach((key) => {
            editor.getElementByKey(key).classList.remove(...tkClasses);
            editor.getElementByKey(key).classList.add(...tkHighlightClasses);
        });
    };

    const onMouseLeave = (e) => {
        nodeKeys.forEach((key) => {
            editor.getElementByKey(key).classList.add(...tkClasses);
            editor.getElementByKey(key).classList.remove(...tkHighlightClasses);
        });
    };

    // set up an observer to reposition the indicator when the TK node containing
    // element moves relative to the root element
    useEffect(() => {
        const observer = new ResizeObserver(() => (setTop(calculateTop())));

        observer.observe(rootElement);
        observer.observe(containingElement);

        return () => {
            observer.disconnect();
        };
    }, [rootElement, containingElement, calculateTop]);

    const style = {
        top: `${top}px`
    };

    return (
        <div
            className="absolute -right-14 cursor-pointer p-1 text-xs font-medium text-grey-600"
            data-testid="tk-indicator"
            style={style}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >TK</div>
    );
}

export default function TKPlugin() {
    const [editor] = useLexicalComposerContext();
    const {tkNodeMap, editorTkNodeMap, setEditorTkNodes} = useTKContext();
    const {nodeKey: parentEditorNodeKey} = useContext(CardContext);

    useEffect(() => {
        if (!editor.hasNodes([TKNode])) {
            throw new Error('TKPlugin: TKNode not registered on editor');
        }
    }, [editor]);

    // we need to update context with this editor's node map
    // [{topLevelNodeKey, tkNodes}, {topLevelNodeKey, tkNodes}, ...]
    // for nested editors topLevelNodeKey will be the key of the node that contains the nested editor
    const getTKNodeMap = useCallback((editorState) => {
        if (!editorState) {
            return null;
        }

        const internalNodeMap = {};

        // this collects all nodes
        editorState.read(() => {
            const foundNodes = $nodesOfType(TKNode);

            // now we need to build a map of topLevelNodeKey -> tkNodes
            foundNodes.forEach((tkNode) => {
                const topLevelNodeKey = tkNode.getTopLevelElement()?.getKey();

                if (internalNodeMap[topLevelNodeKey] === undefined) {
                    internalNodeMap[topLevelNodeKey] = [tkNode.getKey()];
                } else {
                    internalNodeMap[topLevelNodeKey].push(tkNode.getKey());
                }
            });
        });

        // convert to array of {topLevelNodeKey, tkNodes: [nodeKeys]} pairs
        return Object.entries(internalNodeMap).map(([topLevelNodeKey, tkNodeKeys]) => {
            return {topLevelNodeKey: parentEditorNodeKey || topLevelNodeKey, tkNodeKeys};
        });
    }, [parentEditorNodeKey]);

    // run once on mount and then let the editor state listener handle updates
    useLayoutEffect(() => {
        const editorKey = editor.getKey();
        const nodeMap = getTKNodeMap(editor.getEditorState());
        setEditorTkNodes(editor, nodeMap);

        return () => {
            setEditorTkNodes(editorKey, undefined);
        };
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    // update TKs on editor state updates
    // TODO: switch to registerMutationListener for better performance
    useEffect(() => {
        const editorKey = editor.getKey();

        return editor.registerUpdateListener(({editorState}) => {
            const nodeMap = getTKNodeMap(editorState);
            // this is a simple way to check that the nodes actually changed before we re-render indicators on the dom
            if (JSON.stringify(nodeMap) !== JSON.stringify(editorTkNodeMap[editorKey])) {
                setEditorTkNodes(editorKey, nodeMap);
            }
        });
    }, [editor, getTKNodeMap, setEditorTkNodes, editorTkNodeMap]);

    const createTKNode = useCallback((textNode) => {
        return $createTKNode(textNode.getTextContent());
    }, []);

    const getTKMatch = useCallback((text) => {
        let matchArr = REGEX.exec(text);

        if (matchArr === null) {
            return null;
        }

        function isValidMatch(match) {
            // negative lookbehind isn't supported before Safari 16.4
            // so we capture the preceding char and test it here
            if (match[1] && match[1].trim() && WORD_CHAR_REGEX.test(match[1])) {
                return false;
            }

            // we also check any following char in code to avoid an overly
            // complex regex when looking for word-chars following the optional
            // trailing symbol char
            if (match[4] && match[4].trim() && WORD_CHAR_REGEX.test(match[4])) {
                return false;
            }

            return true;
        }

        // our regex will match invalid TKs because we can't use negative lookbehind
        // so we need to loop through the matches discarding any that are invalid
        // and keeping track of the original input so we have correct offsets
        // when we find a valid match
        let textBeforeMatch = '';

        while (matchArr !== null && !isValidMatch(matchArr)) {
            textBeforeMatch += text.slice(0, matchArr.index + matchArr[0].length - 1);
            text = text.slice(matchArr.index + matchArr[0].length - 1);
            matchArr = REGEX.exec(text);
        }

        if (matchArr === null) {
            return null;
        }

        const offsetAdjustment = textBeforeMatch.length;

        const startOffset = offsetAdjustment + matchArr.index + matchArr[1].length;
        const endOffset = startOffset + matchArr[2].length;

        return {
            end: endOffset,
            start: startOffset
        };
    }, []);

    // TODO: register ExtendedTextNode + replacement on nested editors
    const nodeType = editor.hasNode(ExtendedTextNode) ? ExtendedTextNode : TextNode;

    useKoenigTextEntity(
        getTKMatch,
        TKNode,
        createTKNode,
        nodeType
    );

    // we only want to render TK indicators for the top level editor
    if (parentEditorNodeKey) {
        return null;
    }

    const editorRoot = editor.getRootElement();
    const editorRootParent = editor.getRootElement()?.parentElement;

    if (!editorRootParent) {
        return null;
    }

    const TKIndicators = Object.entries(tkNodeMap).map(([parentKey, nodeKeys]) => {
        const parentContainer = editor.getElementByKey(parentKey);

        if (!parentContainer) {
            return false;
        }

        return (
            <TKIndicator
                key={parentKey}
                containingElement={parentContainer}
                editor={editor}
                nodeKeys={nodeKeys}
                rootElement={editorRoot}
            />
        );
    }).filter(Boolean);

    return createPortal(
        TKIndicators,
        editorRootParent
    );
}
