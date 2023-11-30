import KoenigComposerContext from '../context/KoenigComposerContext';
import {$createTKNode, $isKoenigCard, $isTKNode, ExtendedTextNode, TKNode} from '@tryghost/kg-default-nodes';
import {$getNodeByKey, $getSelection, $isRangeSelection, $nodesOfType} from 'lexical';
import {EDIT_CARD_COMMAND} from './KoenigBehaviourPlugin';
import {createPortal} from 'react-dom';
import {useCallback, useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useKoenigSelectedCardContext} from '../context/KoenigSelectedCardContext';
import {useKoenigTextEntity} from '../hooks/useKoenigTextEntity';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const REGEX = new RegExp(/(^|.)([^a-zA-Z0-9\s]?(TK)+[^a-zA-Z0-9\s]?)($|.)/);

function TKIndicator({editor, rootElement, containingElement, nodeKeys, parentKey}) {
    const tkClasses = editor._config.theme.tk?.split(' ') || [];
    const tkHighlightClasses = editor._config.theme.tkHighlighted?.split(' ') || [];

    // position element relative to the TK Node containing element
    const calculateTop = useCallback(() => {
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
            if ($isKoenigCard($getNodeByKey(parentKey))) {
                editor.dispatchCommand(EDIT_CARD_COMMAND, {cardKey: parentKey});
                return;
            }

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
        // TODO: this isn't going to work for cards/nested editors unless we crawl each nested editor instance and apply styles
        let isCard = false;
        editor.getEditorState().read(() => {
            if ($isKoenigCard($getNodeByKey(parentKey))) {
                isCard = true;
            }
        });
        if (isCard) {
            return;
        }
        nodeKeys.forEach((key) => {
            editor.getElementByKey(key).classList.remove(...tkClasses);
            editor.getElementByKey(key).classList.add(...tkHighlightClasses);
        });
    };

    const onMouseLeave = (e) => {
        // TODO: this isn't going to work for cards/nested editors unless we crawl each nested editor instance and apply styles
        let isCard = false;
        editor.getEditorState().read(() => {
            if ($isKoenigCard($getNodeByKey(parentKey))) {
                isCard = true;
            }
        });
        if (isCard) {
            return;
        }
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

export default function TKPlugin({onCountChange = () => {}, nodeType = ExtendedTextNode}) {
    const [editor] = useLexicalComposerContext();
    const {tkNodeMap, setTkNodeMap} = useContext(KoenigComposerContext);
    const [tkNodes, setTkNodes] = useState([]);
    const {selectedCardKey} = useKoenigSelectedCardContext();
    
    useEffect(() => {
        if (!editor.hasNodes([TKNode])) {
            throw new Error('TKPlugin: TKNode not registered on editor');
        }
    }, [editor]);

    const getTKNodesForIndicators = useCallback((editorState) => {
        let foundNodes = [];

        if (!editorState) {
            return foundNodes;
        }

        // this collects all nodes
        editorState.read(() => {
            foundNodes = $nodesOfType(TKNode);
        });

        // here we could set the TKNodeMap to the foundNodes for this particular parent
        return foundNodes;
    }, []);

    const buildTkNodeMap = useCallback((nodes) => {
        let nodeForIndicator;

        // nested editors all roll up to the containing card as the parent
        if (editor._parentEditor) {
            /* 
            tkNodeMap = {
                [nodeForIndicator.getKey()]: {
                    [editorKey]: {
                        nodes: tkNodeKeys
                    },
                }
            }
            */ 

            // if this is a nested editor, we want to get the selected card from the parent editor    
            editor._parentEditor.getEditorState().read(() => {
                nodeForIndicator = $getNodeByKey(selectedCardKey);
            });

            // build the map of the editor instance
            let tkNodeKeys = nodes.map(node => node.getKey());
            let newTkNodeMap = {
                [editor.getKey()]: {
                    tkNodeKeys
                }
            };

            // if there's already an entry for this parent key, we need to merge the new editor instance into the existing map
            if (tkNodeMap[nodeForIndicator.getKey()]) {
                newTkNodeMap = Object.assign({}, tkNodeMap[nodeForIndicator.getKey()], newTkNodeMap);
            }

            setTkNodeMap(Object.assign({}, tkNodeMap, {[nodeForIndicator.getKey()]: newTkNodeMap}));
        // otherwise, we need to parse the set of nodes and group by parents to build the data for the indicator(s)
        } else {
            /*
            tkNodeMap = {
                [parentKey]: {
                    tkNodeKeys: [nodeKeys]
                }
            } 
            */
            // build the map of parent nodes to child nodes
            editor.getEditorState().read(() => {
                let tkParentNodesMap = {};
                nodes.forEach((tkNode) => {
                    let parentKey = tkNode.getParent().getKey();
    
                    // prevent duplication, add node keys to existing indicator
                    // for nodes that are contained in the same parent
                    if (tkParentNodesMap[parentKey]) {
                        tkParentNodesMap[parentKey].push(tkNode.getKey());
                        return;
                    }
    
                    tkParentNodesMap[parentKey] = [tkNode.getKey()];
                });
                // then push each parent to the tkNodeMap
                Object.entries(tkParentNodesMap).forEach(([parentKey, nodeKeys]) => {
                    let newTkNodeMap = {
                        tkNodeKeys: nodeKeys
                    };
    
                    setTkNodeMap(Object.assign({}, tkNodeMap, {[parentKey]: newTkNodeMap}));
                });
            });
        }
    }, [editor, selectedCardKey, tkNodeMap, setTkNodeMap]);

    const calculateNodeCount = useCallback(() => {
        let count = 0;
        Object.entries(tkNodeMap).forEach(([parentKey, {tkNodeKeys}]) => {
            let editorInstance = editor._parentEditor ? editor._parentEditor : editor;
            editorInstance.getEditorState().read(() => {
                let parent = $getNodeByKey(parentKey);
                if ($isKoenigCard(parent)) {
                    // need to loop over nested editor instances
                    Object.entries(tkNodeMap[parentKey]).forEach(([editorKey, e]) => {
                        count += e.tkNodeKeys.length;
                    });
                } else {
                    count += tkNodeKeys.length;
                }
            });
        });
        console.log(`count`,count); // TODO: seems to be one behind, doesn't re-calculate with the nodeTransform
        onCountChange(count);
    }, [tkNodeMap, onCountChange, editor]);

    // run once on mount and then let the editor state listener handle updates
    useLayoutEffect(() => {
        const nodes = getTKNodesForIndicators(editor.getEditorState()); 
        setTkNodes(nodes);
        buildTkNodeMap(nodes);
        calculateNodeCount();
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    // update TKs on editor state updates
    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            const foundNodes = getTKNodesForIndicators(editorState);
            // this is a simple way to check that the nodes actually changed before we re-render indicators on the dom
            if (JSON.stringify(foundNodes) !== JSON.stringify(tkNodes)) {
                setTkNodes(foundNodes);
                buildTkNodeMap(foundNodes);
                calculateNodeCount();
            }
        });
    }, [editor, getTKNodesForIndicators, setTkNodes, tkNodes, onCountChange, buildTkNodeMap, calculateNodeCount]);

    const createTKNode = useCallback((textNode) => {
        return $createTKNode(textNode.getTextContent());
    }, []);

    const getTKMatch = useCallback((text) => {
        const matchArr = REGEX.exec(text);

        if (matchArr === null) {
            return null;
        }

        // negative lookbehind isn't supported before Safari 16.4
        // so we capture the preceding char and test it here
        if (matchArr[1] && /\w/.test(matchArr[1])) {
            return null;
        }

        // we also check any following char in code to avoid an overly
        // complex regex when looking for word-chars following the optional
        // trailing symbol char
        if (matchArr[4] && !/\s/.test(matchArr[4])) {
            return null;
        }

        const startOffset = matchArr.index + matchArr[1].length;
        const endOffset = startOffset + matchArr[2].length;

        return {
            end: endOffset,
            start: startOffset
        };
    }, []);

    useKoenigTextEntity(
        getTKMatch,
        TKNode,
        createTKNode,
        nodeType
    );

    const editorRoot = editor._parentEditor ? editor._parentEditor.getRootElement() : editor.getRootElement();
    const editorRootParent = editorRoot?.parentElement;

    if (!editorRootParent) {
        return null;
    }

    // only the root editor should render the indicators (prevent duplicates)
    if (editor._parentEditor) {
        return null;
    }

    console.log(`TKNodeMap`, tkNodeMap);
    const TKIndicators = Object.entries(tkNodeMap).map(([parentKey, {tkNodeKeys}]) => {
        return (
            <TKIndicator
                key={parentKey}
                containingElement={editor._parentEditor ? editor._parentEditor.getElementByKey(parentKey) : editor.getElementByKey(parentKey)}
                editor={editor}
                nodeKeys={tkNodeKeys}
                parentKey={parentKey}
                rootElement={editorRoot}
            />
        );
    });

    return createPortal(
        Object.values(TKIndicators),
        editorRootParent
    );
}
