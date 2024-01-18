import type { LexicalNode } from 'lexical';
import { RendererOptions } from '../convert-to-html-string';
type ExportChildren = (node: LexicalNode, options: RendererOptions) => string;
export default class TextContent {
    nodes: LexicalNode[];
    exportChildren: ExportChildren;
    options: RendererOptions;
    constructor(exportChildren: ExportChildren, options: RendererOptions);
    addNode(node: LexicalNode): void;
    render(): string;
    isEmpty(): boolean;
    clear(): void;
    _buildAnchorElement(anchor: HTMLElement, node: LexicalNode): void;
}
export {};
