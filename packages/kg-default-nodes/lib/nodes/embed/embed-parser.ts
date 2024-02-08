import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical/LexicalNode.js';
import {readCaptionFromElement} from '../../utils/read-caption-from-element.js';
import {$createEmbedNode, EmbedNodeDataset} from './EmbedNode.js';

// TODO: add NFT card parser
export function parseEmbedNode(): DOMConversionMap | null {
    return {
        figure: (nodeElem: HTMLElement): DOMConversion | null => {
            if (nodeElem.nodeType === 1 && nodeElem.tagName === 'FIGURE') {
                const iframe = nodeElem.querySelector('iframe');
                if (iframe) {
                    return {
                        conversion(domNode: HTMLElement): DOMConversionOutput | null {
                            const payload = _createPayloadForIframe(iframe) as EmbedNodeDataset;

                            if (!payload) {
                                return null;
                            }

                            payload.caption = readCaptionFromElement(domNode);

                            const node = $createEmbedNode(payload);
                            return {node};
                        },
                        priority: 1
                    };
                }
                const blockquote = nodeElem.querySelector('blockquote');
                if (blockquote) {
                    return {
                        conversion(domNode: HTMLElement): DOMConversionOutput | null {
                            const link = domNode.querySelector('a');
                            if (!link) {
                                return null;
                            }

                            const url = link.getAttribute('href');

                            // If we don't have a url, or it's not an absolute URL, we can't handle this
                            if (!url || !url.match(/^https?:\/\//i)) {
                                return null;
                            }

                            const payload = {url: url} as EmbedNodeDataset;

                            // append caption, remove element from blockquote
                            payload.caption = readCaptionFromElement(domNode);
                            const figcaption = domNode.querySelector('figcaption');
                            figcaption?.remove();

                            payload.html = domNode.innerHTML;

                            const node = $createEmbedNode(payload);
                            return {node};
                        },
                        priority: 1
                    };
                }
            }
            return null;
        },
        iframe: (nodeElem: HTMLElement): DOMConversion | null => {
            if (nodeElem.nodeType === 1 && nodeElem.tagName === 'IFRAME') {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput | null {
                        const payload = _createPayloadForIframe(domNode as HTMLIFrameElement);

                        if (!payload) {
                            return null;
                        }

                        const node = $createEmbedNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}

function _createPayloadForIframe(iframe: HTMLIFrameElement): EmbedNodeDataset | undefined {
    // If we don't have a src Or it's not an absolute URL, we can't handle this
    // This regex handles http://, https:// or //
    if (!iframe.src || !iframe.src.match(/^(https?:)?\/\//i)) {
        return;
    }

    // if it's a schemaless URL, convert to https
    if (iframe.src.match(/^\/\//)) {
        iframe.src = `https:${iframe.src}`;
    }

    const payload = {
        url: iframe.src,
        html: ''
    };

    payload.html = iframe.outerHTML;

    return payload;
}