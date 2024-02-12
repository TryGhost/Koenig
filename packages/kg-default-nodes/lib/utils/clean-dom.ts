import {LexicalNode} from 'lexical';

// create a type with a key of one of the following tags
type HTMLTags = [
    'A',
    'STRONG',
    'EM',
    'B',
    'I',
    'BR',
    'CODE',
    'MARK',
    'S',
    'DEL',
    'U',
    'SUP',
    'SUB'
]

export type AllowedTags = Array<keyof HTMLTags>;

export function cleanDOM(node: LexicalNode, allowedTags: AllowedTags) {
    for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === 1 && !allowedTags.includes(child.tagName)) {
            while (child.firstChild) {
                node.insertBefore(child.firstChild, child);
            }
            node.removeChild(child);
            i -= 1;
        } else if (child.nodeType === 1) {
            cleanDOM(child, allowedTags);
        }
    }
}
