import {generateDecoratorNode} from '../../generate-decorator-node.js';
import {parseAudioNode} from './audio-parser.js';
import {renderAudioNode} from './audio-renderer.js';

export interface AudioNode {
    duration: number;
    mimeType: string;
    src: string;
    title: string;
    thumbnailSrc: string;
}

export class AudioNode extends generateDecoratorNode({
    nodeType: 'audio',
    properties: [
        {name: 'duration', default: 0},
        {name: 'mimeType', default: ''},
        {name: 'src', default: '', urlType: 'url'},
        {name: 'title', default: ''},
        {name: 'thumbnailSrc', default: ''}
    ],
    defaultRenderFn: renderAudioNode
}) {
    static importDOM() {
        return parseAudioNode(this);
    }
}

export const $createAudioNode = (dataset: Record<string, unknown>) => {
    return new AudioNode(dataset);
};

export function $isAudioNode(node: unknown): node is AudioNode {
    return node instanceof AudioNode;
}
