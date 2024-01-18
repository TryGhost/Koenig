import { LexicalNode } from 'lexical';
import { RendererOptions } from '../convert-to-html-string';
export type ExportChildren = (node: LexicalNode, options?: RendererOptions) => string;
export type ElementTransformer = {
    export: (node: LexicalNode, options: RendererOptions, exportChildren: ExportChildren) => string | null;
};
declare const elementTransformers: ElementTransformer[];
export default elementTransformers;
