import {ExtendedTextNode} from '@tryghost/kg-default-nodes';
// import {TextNode} from 'lexical';
import {useEffect} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

function replacementStringTransform(node) {
    if (node.hasFormat('code')) { // prevent infinite loop
        return;
    }
    const regex = /{{.*?}}/g;
    const textContent = node.getTextContent();
    // replace {{placeholder}} with a new text node that has the code format applied
    const replacementString = textContent.match(regex);
    console.log(`replacementString`,replacementString);
    if (replacementString) {        
        const replacementTextNode = new ExtendedTextNode(replacementString);
        replacementTextNode.setFormat('code');

        // todo: split node in case someone puts placeholder in the middle of the string
        node.setTextContent(node.getTextContent().replace(replacementString, ''));
        node.insertAfter(replacementTextNode);
        // todo: fix selection not going to end....
        replacementTextNode.select();
    }
}

function useReplacementStrings(editor) {
    useEffect(() => {
        const removeTransform = editor.registerNodeTransform(ExtendedTextNode, replacementStringTransform);
        return () => {
            removeTransform();
        };
    }, [editor]);

    // useEffect(() => {
    //     const removeTransform = editor.registerNodeTransform(TextNode, replacementStringTransform);
    //     return () => {
    //         removeTransform();
    //     };
    // }, [editor]);
}

export default function ReplacementStringsPlugin() {
    const [editor] = useLexicalComposerContext();
    return useReplacementStrings(editor);
}