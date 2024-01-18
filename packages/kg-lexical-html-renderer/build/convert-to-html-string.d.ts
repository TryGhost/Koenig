/// <reference types="jsdom" />
/// <reference types="jsdom" />
export interface RendererOptions {
    usedIdAttributes?: Record<string, number>;
    dom?: import('jsdom').JSDOM;
    type?: 'inner' | 'outer' | 'value';
}
export default function $convertToHtmlString(options?: RendererOptions): string;
