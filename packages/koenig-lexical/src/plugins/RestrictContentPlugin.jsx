import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {RootNode, $getSelection, $isRangeSelection, $isParagraphNode, $createParagraphNode, $createTextNode} from 'lexical';
import {$isListNode} from '@lexical/list';
import React from 'react';

export const RestrictContentPlugin = ({paragraphs}) => {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        return mergeRegister(
            editor.registerNodeTransform(RootNode, (rootNode) => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
                    return;
                }
                const incomingNodes = rootNode.getChildren();

                if (!(incomingNodes.length <= paragraphs && incomingNodes.every($isParagraphNode))) {
                    // remove non-markerable (?) and non-list section
                    var cleanedNodes = incomingNodes.filter((node) => {
                        return $isParagraphNode(node) || $isListNode(node);
                    });

                    // Truncate cleanedNodes to the specified number of paragraphs
                    cleanedNodes = cleanedNodes.slice(0, paragraphs);

                    // for any list nodes, convert first item of list section to a paragraph
                    cleanedNodes = cleanedNodes.map((node) => {
                        if ($isListNode(node)) {
                            const firstListItem = node.getChildren()[0];
                            return $createParagraphNode().append($createTextNode(firstListItem.getTextContent()));
                        } else {
                            return node;
                        }
                    });
                    
                    // remove all existing nodes from state
                    incomingNodes.forEach(node => node.remove());
                    // add our new node to the now empty rootNode
                    cleanedNodes.forEach(node => rootNode.append(node));
                    // move selection to end of new node
                    rootNode.selectEnd();
                }
            })
        );
    }, [editor, paragraphs]);
    return null;
};

export default RestrictContentPlugin;
