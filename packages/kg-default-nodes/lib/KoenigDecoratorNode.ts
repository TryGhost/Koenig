/* eslint-disable ghost/filenames/match-exported-class */
/* c8 ignore start */
import {DecoratorNode} from 'lexical';
import type {LexicalNode} from 'lexical';

export class KoenigDecoratorNode extends DecoratorNode<JSX.Element> {
}

export function $isKoenigCard(node: LexicalNode): boolean {
    return node instanceof KoenigDecoratorNode;
}
/* c8 ignore end */