const {DecoratorNode} = require('lexical');

class ImageNode extends DecoratorNode {
    constructor({src, caption, altText}) {
        super();
        this.src = src || '';
        this.caption = caption || '';
        this.altText = altText || '';
    }

    static getType() {
        return 'image';
    }

    static importJSON(serializedNode) {
        return $createImageNode(serializedNode);
    }

    static getSrc() {
        return this.src;
    }

    static getCaption() {
        return this.caption;
    }
}

const $createImageNode = (serializedNode) => {
    const node = new ImageNode(serializedNode);
    return node;
};

const $isImageNode = (node) => {
    return node instanceof ImageNode;
};

module.exports = {
    ImageNode,
    $createImageNode,
    $isImageNode
};