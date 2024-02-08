import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {readCaptionFromElement} from '../../utils/read-caption-from-element';
import {$createCodeBlockNode, CodeBlockNodeDataset} from './CodeBlockNode';

export function parseCodeBlockNode(): DOMConversionMap | null {
    return {
        figure: (nodeElem: HTMLElement): DOMConversion | null => {
            const pre = nodeElem.querySelector('pre');
            if (nodeElem.tagName === 'FIGURE' && pre) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput | null {        
                        const code = pre.querySelector('code');
                        const figcaption = domNode.querySelector('figcaption');
    
                        // if there's no caption the pre key should pick it up
                        if (!code || !figcaption) {
                            return null;
                        }
    
                        const payload = {
                            code: code.textContent,
                            caption: readCaptionFromElement(domNode)
                        } as CodeBlockNodeDataset;
    
                        const preClass = pre.getAttribute('class') || '';
                        const codeClass = code.getAttribute('class') || '';
                        const langRegex = /lang(?:uage)?-(.*?)(?:\s|$)/i;
                        const languageMatches = preClass.match(langRegex) || codeClass.match(langRegex);
                        if (languageMatches) {
                            payload.language = languageMatches[1].toLowerCase();
                        }
    
                        const node = $createCodeBlockNode(payload);
                        return {node};
                    },
                    priority: 2 // falls back to pre if no caption
                };
            }
            return null;
        },
        pre: (): DOMConversion | null => ({
            conversion(domNode: HTMLElement): DOMConversionOutput | null {
                if (domNode.tagName === 'PRE') {
                    const [codeElement] = domNode.children;

                    if (codeElement && codeElement.tagName === 'CODE') {
                        const payload = {
                            code: codeElement.textContent
                        } as CodeBlockNodeDataset;
                        const preClass = domNode.getAttribute('class') || '';
                        const codeClass = codeElement.getAttribute('class') || '';
                        const langRegex = /lang(?:uage)?-(.*?)(?:\s|$)/i;
                        const languageMatches = preClass.match(langRegex) || codeClass.match(langRegex);
                        if (languageMatches) {
                            payload.language = languageMatches[1].toLowerCase();
                        }
                        const node = $createCodeBlockNode(payload);
                        return {node};
                    }
                }

                return null;
            },
            priority: 1
        })
    };
}
