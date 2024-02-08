import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {sizeToBytes} from '../../utils/size-byte-converter';
import {$createFileNode, FileNodeDataset} from './FileNode';

export function parseFileNode(): DOMConversionMap | null {
    return {
        div: (nodeElem: HTMLElement): DOMConversion | null => {
            const isKgFileCard = nodeElem.classList?.contains('kg-file-card');
            if (nodeElem.tagName === 'DIV' && isKgFileCard) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput {
                        const link = domNode.querySelector('a') as HTMLAnchorElement;
                        const src = link.getAttribute('href');
                        const fileTitle = domNode.querySelector('.kg-file-card-title')?.textContent || '';
                        const fileCaption = domNode.querySelector('.kg-file-card-caption')?.textContent || '';
                        const fileName = domNode.querySelector('.kg-file-card-filename')?.textContent || '';
                        const fileSize = sizeToBytes(domNode.querySelector('.kg-file-card-filesize')?.textContent || '');
                        const payload = {
                            src,
                            fileTitle,
                            fileCaption,
                            fileName,
                            fileSize
                        } as FileNodeDataset;

                        const node = $createFileNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}
