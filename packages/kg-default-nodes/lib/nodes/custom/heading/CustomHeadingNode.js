import {$applyNodeReplacement} from 'lexical';
import {HeadingNode} from '@lexical/rich-text';

export class CustomHeadingNode extends HeadingNode {
    __version = 1;

    constructor(tag, key) {
        super(key);
        this.__tag = tag;
        this.__version = 1;
    }

    static getType() {
        return 'koenig-heading';
    }

    static clone(node) {
        return new CustomHeadingNode(node.__tag, node.__key);
    }

    static importJSON(serializedNode) {
        const node = $createCustomHeadingNode(serializedNode.tag);
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        node.setVersion(serializedNode.version);
        return node;
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            type: 'koenig-heading',
            version: this.__version
        };
    }

    getVersion() {
        const self = this.getLatest();
        return self.__version;
    }

    setVersion(version) {
        const writable = this.getWritable();
        writable.__version = version;
    }
}

export const $createCustomHeadingNode = (headingTag, version = 1) => {
    return $applyNodeReplacement(new CustomHeadingNode(headingTag, version));
};

export function $isCustomHeadingNode(node) {
    return node instanceof CustomHeadingNode;
}
