import {$createParagraphNode, $setSelection} from 'lexical';
import {$generateNodesFromDOM} from '@lexical/html';
import {$getRoot, $insertNodes} from 'lexical';

export default function generateEditorState({editor, initialHtml}) {
    if (initialHtml) {
        // convert html in `text` to Lexical nodes and populate the editor
        editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(initialHtml, 'text/html');

            const nodes = $generateNodesFromDOM(editor, dom);

            // There are few recent issues related to $generateNodesFromDOM
            // https://github.com/facebook/lexical/issues/2807
            // https://github.com/facebook/lexical/issues/3677
            // As a temporary fix, checking node content to remove additional spaces and br
            const filteredNodes = nodes.filter(n => n.getTextContent().trim());

            // Select the root
            $getRoot().select();

            if (filteredNodes.length === 0) {
                $getRoot().clear();
            }

            // Insert them at a selection.
            $insertNodes(filteredNodes);

            // $insertNodes is focusing an editor (https://github.com/facebook/lexical/issues/4546)
            // This behaviour can break the ability to autofocus the editor because
            // initial state filling can happen after the component is already mounted.
            // Reset selection to make it easier to manage editor focus in components instead of editor state generation
            if (filteredNodes.length) {
                $setSelection(null);
            }
        }, {discrete: true, tag: 'history-merge'}); // use history merge to prevent undo clearing the initial state
    } else {
        // for empty initial values, create a paragraph because a completely empty
        // root won't accept focus
        editor.update(() => {
            $getRoot().append($createParagraphNode());
        }, {discrete: true, tag: 'history-merge'}); // use history merge to prevent undo clearing the initial state
    }

    return editor.getEditorState();
}
