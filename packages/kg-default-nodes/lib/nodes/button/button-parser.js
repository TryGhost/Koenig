import {rgbToHex} from '../../utils/rgb-to-hex';

export function parseButtonNode(ButtonNode) {
    return {
        div: (nodeElem) => {
            const isButtonCard = nodeElem.classList?.contains('kg-button-card');
            if (nodeElem.tagName === 'DIV' && isButtonCard) {
                return {
                    conversion(domNode) {
                        const alignmentClass = nodeElem.className.match(/kg-align-(left|center)/);

                        let alignment;
                        if (alignmentClass) {
                            alignment = alignmentClass[1];
                        }

                        const buttonNode = domNode?.querySelector('.kg-btn');
                        const buttonUrl = buttonNode?.getAttribute('href');
                        const buttonText = buttonNode?.textContent;
                        const isAccentButton = buttonNode?.classList?.contains('kg-btn-accent') ?? false;
                        const buttonColor = isAccentButton ? 'accent' : (rgbToHex(buttonNode?.style?.backgroundColor) || 'accent');
                        const buttonTextColor = rgbToHex(buttonNode?.style?.color) || '#ffffff';

                        const payload = {
                            buttonText: buttonText,
                            alignment: alignment,
                            buttonUrl: buttonUrl,
                            buttonColor: buttonColor,
                            buttonTextColor: buttonTextColor
                        };

                        const node = new ButtonNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}
