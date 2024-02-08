import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createButtonNode} from './ButtonNode';

export const parseButtonNode = (): DOMConversionMap | null => {
    return {
        div: (nodeElem: HTMLElement): DOMConversion | null => {
            const isButtonCard = nodeElem.classList?.contains('kg-button-card');
            if (nodeElem.tagName === 'DIV' && isButtonCard) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput {
                        const alignmentClass = nodeElem.className.match(/kg-align-(left|center)/);

                        let alignment;
                        if (alignmentClass) {
                            alignment = alignmentClass[1];
                        }

                        const buttonNode = domNode?.querySelector('.kg-btn');
                        const buttonUrl = buttonNode?.getAttribute('href');
                        const buttonText = buttonNode?.textContent;

                        const payload = {
                            buttonText: buttonText,
                            alignment: alignment,
                            buttonUrl: buttonUrl
                        };

                        const node = $createButtonNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
};
