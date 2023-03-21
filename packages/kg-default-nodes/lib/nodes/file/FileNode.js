import {KoenigDecoratorNode} from '../../KoenigDecoratorNode';
import {renderFileNodeToDOM} from './FileRenderer';
import {FileParser} from './FileParser';
import {createCommand} from 'lexical';

export const INSERT_FILE_COMMAND = createCommand();

export class FileNode extends KoenigDecoratorNode {
    // file payload properties
    __src;
    __title;
    __description;
    __fileName;
    __fileSize;

    static getType() {
        return 'file';
    }

    static clone(node) {
        return new this(
            node.getDataset(),
            node.__key
        );
    }

    static get urlTransformMap() {
        return {
            src: 'url'
        };
    }

    getDataset() {
        const self = this.getLatest();
        return {
            src: self.__src,
            title: self.__title,
            description: self.__description,
            fileName: self.__fileName,
            fileSize: self.__fileSize
        };
    }

    constructor({src, title, description, fileName, fileSize} = {}, key) {
        super(key);
        this.__src = src || '';
        this.__title = title || '';
        this.__description = description || '';
        this.__fileName = fileName || '';
        this.__fileSize = fileSize || '';
    }

    static importJSON(serializedNode) {
        const {src, title, description, fileName, fileSize} = serializedNode;
        return new this({
            src,
            title,
            description,
            fileName,
            fileSize
        });
    }

    exportJSON() {
        const src = this.getSrc();
        const isBlob = src.startsWith('data:');
        return {
            type: this.getType(),
            src: isBlob ? '<base64String>' : this.getSrc(),
            title: this.__title,
            description: this.__description,
            fileName: this.__fileName,
            fileSize: this.__fileSize
        };
    }

    static importDOM() {
        const parser = new FileParser(this);
        return parser.DOMConversionMap;
    }

    exportDOM(options = {}) {
        const element = renderFileNodeToDOM(this, options);
        return {element};
    }

    // c8 ignore start
    createDOM() {
        const element = document.createElement('div');
        return element;
    }

    updateDOM() {
        return false;
    }

    isInline() {
        return false;
    }

    getSrc() {
        const self = this.getLatest();
        return self.__src;
    }

    setSrc(src) {
        const writable = this.getWritable();
        writable.__src = src;
    }

    getTitle() {
        const self = this.getLatest();
        return self.__title;
    }

    setTitle(title) {
        const writable = this.getWritable();
        writable.__title = title;
    }

    getDescription() {
        const self = this.getLatest();
        return self.__description;
    }

    setDescription(description) {
        const writable = this.getWritable();
        writable.__description = description;
    }

    getFileName() {
        const self = this.getLatest();
        return self.__fileName;
    }

    setFileName(fileName) {
        const writable = this.getWritable();
        writable.__fileName = fileName;
    }

    getFileSize() {
        const self = this.getLatest();
        return self.__fileSize;
    }

    setFileSize(fileSize) {
        const writable = this.getWritable();
        writable.__fileSize = fileSize;
    }
    // c8 ignore stop
    decorate() {
        return '';
    }
}

export function $isFileNode(node) {
    return node instanceof FileNode;
}

export const $createFileNode = (dataset) => {
    return new FileNode(dataset);
};

