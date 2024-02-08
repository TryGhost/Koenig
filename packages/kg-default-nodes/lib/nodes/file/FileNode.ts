/* eslint-disable ghost/filenames/match-exported-class */
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {renderFileNode} from './file-renderer';
import {parseFileNode} from './file-parser';
import {bytesToSize} from '../../utils/size-byte-converter';
import {LexicalNode, SerializedLexicalNode, Spread} from 'lexical';

export type FileNodeDataset = {
    src?: string;
    fileTitle?: string;
    fileCaption?: string;
    fileName?: string;
    fileSize?: string;
};

type FileNodeProps = {
    nodeType: 'file';
    properties: KoenigDecoratorNodeProperties;
};

const fileNodeProps: FileNodeProps = {
    nodeType: 'file',
    properties: [
        {name: 'src', default: '', urlType: 'url'},
        {name: 'fileTitle', default: '', wordCount: true},
        {name: 'fileCaption', default: '', wordCount: true},
        {name: 'fileName', default: ''},
        {name: 'fileSize', default: ''}
    ]
};

export type SerializedFileNode = Spread<FileNodeDataset, SerializedLexicalNode>;

export class FileNode extends generateDecoratorNode(fileNodeProps) {
    /* @override */
    exportJSON(): SerializedFileNode {
        const {src, fileTitle, fileCaption, fileName, fileSize} = this;
        const isBlob = src.startsWith('data:');

        return {
            type: 'file',
            version: 1,
            src: isBlob ? '<base64String>' : src,
            fileTitle,
            fileCaption,
            fileName,
            fileSize
        };
    }

    static importDOM() {
        return parseFileNode(this);
    }

    exportDOM(options = {}) {
        return renderFileNode(this, options);
    }

    get formattedFileSize() {
        return bytesToSize(this.fileSize);
    }
}

export const $createFileNode = (dataset: FileNodeDataset) => {
    return new FileNode(dataset);
};

export function $isFileNode(node: LexicalNode) {
    return node instanceof FileNode;
}
