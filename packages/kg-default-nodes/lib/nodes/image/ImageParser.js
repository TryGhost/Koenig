export class ImageParser {
    constructor($createNode) {
        this.$createNode = $createNode;
    }

    get DOMMap() {
        return {
            img: () => ({
                conversion(domNode) {
                    if (domNode instanceof HTMLImageElement) {
                        const {alt: altText, src, title} = domNode;
                        const node = this.$createNode({altText, src, title});
                        return {node};
                    }

                    return null;
                },
                priority: 1
            })
            // TODO: add <figure> and other handling from kg-parser-plugins
        };
    }
}
