import {LexicalEditor} from 'lexical/LexicalEditor.js';
import {registerDenestTransform} from './transforms/denest.js';
import {registerRemoveAlignmentTransform} from './transforms/remove-alignment.js';
import {mergeRegister} from '@lexical/utils/index.js';
import {$createParagraphNode, ParagraphNode} from 'lexical/index.js';
import {$createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode} from '@lexical/rich-text/index.js';
import {ExtendedHeadingNode} from '@tryghost/kg-default-nodes';

export * from './transforms/denest.js';
export * from './transforms/remove-alignment.js';

export function registerDefaultTransforms(editor: LexicalEditor) {
    return mergeRegister(
        // strip unwanted alignment formats
        registerRemoveAlignmentTransform(editor, ParagraphNode),
        registerRemoveAlignmentTransform(editor, HeadingNode),
        registerRemoveAlignmentTransform(editor, ExtendedHeadingNode),
        registerRemoveAlignmentTransform(editor, QuoteNode),

        // fix invalid nesting of nodes
        registerDenestTransform(editor, ParagraphNode, () => ($createParagraphNode())),
        registerDenestTransform(editor, HeadingNode, node => ($createHeadingNode(node.getTag()))),
        registerDenestTransform(editor, ExtendedHeadingNode, node => ($createHeadingNode(node.getTag()))),
        registerDenestTransform(editor, QuoteNode, () => ($createQuoteNode()))
    );
}
