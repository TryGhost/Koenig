/* eslint-disable ghost/filenames/match-exported-class */
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {renderHtmlNode} from './html-renderer';
import {parseHtmlNode} from './html-parser';
import {DOMConversionMap, LexicalNode} from 'lexical';

export type HtmlNodeDataset = {
    html?: string;
};

type HtmlNodeProps = {
    nodeType: 'html';
    properties: KoenigDecoratorNodeProperties;
};

const htmlNodeProps: HtmlNodeProps = {
    nodeType: 'html',
    properties: [
        {name: 'html', default: '', urlType: 'html', wordCount: true}
    ]
};

export class HtmlNode extends generateDecoratorNode(htmlNodeProps) {
    static importDOM(): DOMConversionMap | null {
        return parseHtmlNode();
    }

    exportDOM(options = {}) {
        return renderHtmlNode(this, options);
    }

    isEmpty() {
        return !this.__html;
    }
}

export function $createHtmlNode(dataset: HtmlNodeDataset) {
    return new HtmlNode(dataset);
}

export function $isHtmlNode(node: LexicalNode) {
    return node instanceof HtmlNode;
}
