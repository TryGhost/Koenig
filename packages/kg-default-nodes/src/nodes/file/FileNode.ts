import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {renderFileNode} from './file-renderer.js';
import {parseFileNode} from './file-parser.js';
import {bytesToSize} from '../../utils/size-byte-converter.js';

export interface FileNode {
    src: string;
    fileTitle: string;
    fileCaption: string;
    fileName: string;
    fileSize: string;
}

export class FileNode extends generateDecoratorNode({
    nodeType: 'file',
    properties: [
        {name: 'src', default: '', urlType: 'url'},
        {name: 'fileTitle', default: '', wordCount: true},
        {name: 'fileCaption', default: '', wordCount: true},
        {name: 'fileName', default: ''},
        {name: 'fileSize', default: ''}
    ],
    defaultRenderFn: renderFileNode
}) {
    /* @override */
    exportJSON() {
        const {src, fileTitle, fileCaption, fileName, fileSize} = this;
        const isBlob = src && src.startsWith('data:');

        return {
            type: 'file' as const,
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

    get formattedFileSize() {
        return bytesToSize(Number(this.fileSize));
    }
}

export function $isFileNode(node: unknown): node is FileNode {
    return node instanceof FileNode;
}

export const $createFileNode = (dataset: Record<string, unknown>) => {
    return new FileNode(dataset);
};
