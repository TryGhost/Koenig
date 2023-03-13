export class ToggleParser {
    constructor(NodeClass) {
        this.NodeClass = NodeClass;
    }

    get DOMConversionMap() {
        const self = this;

        return {
            div: () => ({
                conversion(domNode) {
                    const isKgToggleCard = domNode.classList?.contains('kg-toggle-card');
                    if (domNode.tagName === 'DIV' && isKgToggleCard) {
                        const headerWrapper = domNode.querySelector('.kg-toggle-card-header > .kg-toggle-card-heading > .koenig-basic-html-input__editor-wrappper > div');
                        const headerPlaceholder = headerWrapper.getAttribute('data-placeholder');
                        const header = headerWrapper.textContent;

                        const contentWrapper = domNode.querySelector('.kg-toggle-card-content > .koenig-basic-html-textarea__editor-wrappper > div');
                        const contentPlaceholder = contentWrapper.getAttribute('data-placeholder');
                        const content = contentWrapper.textContent;

                        const node = new self.NodeClass({content, contentPlaceholder, header, headerPlaceholder});
                        return {node};
                    }

                    return null;
                },
                priority: 1
            })
        };
    }
}