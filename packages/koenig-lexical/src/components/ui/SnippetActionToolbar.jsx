import KoenigComposerContext from '../../context/KoenigComposerContext.jsx';
import React from 'react';
import {$createAsideNode, $isAsideNode} from '../../nodes/AsideNode.js';
import {$createNodeSelection, $getSelection, $isTextNode} from 'lexical';
import {$createQuoteNode, $isQuoteNode} from '@lexical/rich-text';
import {$generateJSONFromSelectedNodes} from '@lexical/clipboard';
import {SELECT_CARD_COMMAND} from '../../plugins/KoenigBehaviourPlugin.jsx';
import {SnippetInput} from './SnippetInput';
import {useKoenigSelectedCardContext} from '../../context/KoenigSelectedCardContext.jsx';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function SnippetActionToolbar({onClose, ...props}) {
    const {cardConfig: {snippets, createSnippet}, darkMode} = React.useContext(KoenigComposerContext);
    const [editor] = useLexicalComposerContext();
    const {selectedCardKey} = useKoenigSelectedCardContext();
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSnippetCreation = (snippetName) => {
        editor.update(() => {
            if (selectedCardKey) {
                const nodeSelection = $createNodeSelection();
                nodeSelection.add(selectedCardKey);

                const nodeJson = $generateJSONFromSelectedNodes(editor, nodeSelection);
                createSnippet({name: snippetName, value: JSON.stringify(nodeJson)});
                editor.dispatchCommand(SELECT_CARD_COMMAND, {cardKey: selectedCardKey});
            } else {
                const selection = $getSelection();
                let nodeJson;

                const selectedNodes = selection.getNodes();
                if (selectedNodes.length === 1 && $isTextNode(selectedNodes[0])) {
                    const node = selectedNodes[0];
                    const parentNode = node.getParent(); // textNodes must have a parent
                    if ($isQuoteNode(parentNode)) {
                        const quoteNode = $createQuoteNode();
                        const childJson = [node.exportJSON()];
                        nodeJson = {namespace: 'KoenigEditor', nodes: [quoteNode.exportJSON()]};
                        nodeJson.nodes[0].children = childJson;
                    }
                    if ($isAsideNode(parentNode)) {
                        const asideNode = $createAsideNode();
                        const childJson = [node.exportJSON()];
                        nodeJson = {namespace: 'KoenigEditor', nodes: [asideNode.exportJSON()]};
                        nodeJson.nodes[0].children = childJson;
                    }
                }

                nodeJson = nodeJson || $generateJSONFromSelectedNodes(editor, selection);
                createSnippet({name: snippetName, value: JSON.stringify(nodeJson)});
            }

            onClose?.();
            editor.getRootElement().focus(); // don't force focus to be handled in each implementation
        });
    };

    return (
        <SnippetInput
            darkMode={darkMode}
            snippets={snippets}
            value={value}
            onChange={handleChange}
            onClose={onClose}
            onCreateSnippet={() => handleSnippetCreation(value)}
            onUpdateSnippet={name => handleSnippetCreation(name)}
            {...props}
        />
    );
}
