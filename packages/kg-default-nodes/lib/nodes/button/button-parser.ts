import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createButtonNode} from './ButtonNode';
import {KoenigDecoratorNode} from '../../KoenigDecoratorNode';

// TODO: This is a workaround for the moment until we can get the generator fn output to be recognized as an extended KoenigDecoratorNode
type ButtonNode = KoenigDecoratorNode;

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

                        const node = $createButtonNode(payload) as ButtonNode;
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
};
