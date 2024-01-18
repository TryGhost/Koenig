/// <reference types="jsdom" />
/// <reference types="jsdom" />
import { SerializedEditorState, LexicalNode } from 'lexical';
interface RenderOptions {
    target?: 'html' | 'plaintext';
    dom?: import('jsdom').JSDOM;
    renderData?: Map<number, any>;
}
export default class LexicalHTMLRenderer {
    dom: import('jsdom').JSDOM;
    nodes: LexicalNode[];
    constructor({ dom, nodes }?: {
        dom?: import('jsdom').JSDOM;
        nodes?: LexicalNode[];
    });
    render(lexicalState: SerializedEditorState | string, userOptions?: RenderOptions): Promise<string>;
}
export {};
