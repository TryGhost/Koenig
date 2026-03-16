import type {ElementNode} from 'lexical';
import type {RendererOptions} from '@tryghost/kg-default-nodes';

import paragraphTransformer from './element/paragraph.js';
import headingTransformer from './element/heading.js';
import listTransformer from './element/list.js';
import blockquoteTransformer from './element/blockquote.js';
import asideTransformer from './element/aside.js';

export type ExportChildren = (node: ElementNode, options?: RendererOptions) => string;
export type ElementTransformer = {
    export: (node: ElementNode, options: RendererOptions, exportChildren: ExportChildren) => string | null;
};

const elementTransformers: ElementTransformer[] = [
    paragraphTransformer,
    headingTransformer,
    listTransformer,
    blockquoteTransformer,
    asideTransformer
];

export default elementTransformers;
