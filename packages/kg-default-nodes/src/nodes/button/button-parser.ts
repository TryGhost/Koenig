import type {LexicalNode} from 'lexical';

export function parseButtonNode(ButtonNode: new (data: Record<string, unknown>) => unknown) {
    return {
        div: (nodeElem: HTMLElement) => {
            const isButtonCard = nodeElem.classList?.contains('kg-button-card');
            if (nodeElem.tagName === 'DIV' && isButtonCard) {
                return {
                    conversion(domNode: HTMLElement) {
                        const alignmentClass = nodeElem.className.match(/kg-align-(left|center)/);

                        let alignment;
                        if (alignmentClass) {
                            alignment = alignmentClass[1];
                        }

                        const buttonNode = domNode?.querySelector('.kg-btn');
                        const buttonUrl = buttonNode?.getAttribute('href') ?? '';
                        const buttonText = buttonNode?.textContent ?? '';

                        const payload: Record<string, unknown> = {
                            buttonText: buttonText,
                            alignment: alignment,
                            buttonUrl: buttonUrl
                        };

                        const node = new ButtonNode(payload);
                        return {node: node as LexicalNode};
                    },
                    priority: 1 as const
                };
            }
            return null;
        }
    };
}
