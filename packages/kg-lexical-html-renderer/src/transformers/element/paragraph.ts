import {$isParagraphNode} from 'lexical';
import type {ElementNode} from 'lexical';
import type {ExportChildren} from '../index.js';
import type {RendererOptions} from '@tryghost/kg-default-nodes';

export default {
    export(node: ElementNode, options: RendererOptions, exportChildren: ExportChildren) {
        if (!$isParagraphNode(node)) {
            return null;
        }

        return `<p>${exportChildren(node)}</p>`;
    }
};
