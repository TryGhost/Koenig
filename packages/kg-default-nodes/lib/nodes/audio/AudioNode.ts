/* eslint-disable ghost/filenames/match-exported-class */
import {DOMConversionMap, LexicalNode} from 'lexical';
import {generateDecoratorNode, KoenigDecoratorNodeProperties} from '../../generate-decorator-node';
import {parseAudioNode} from './audio-parser';
import {renderAudioNode} from './audio-renderer';

export type AudioNodeDataset = {
    duration?: number;
    mimeType?: string;
    src?: string;
    title?: string;
    thumbnailSrc?: string;
};

type AudioNodeProps = {
    nodeType: 'audio';
    properties: KoenigDecoratorNodeProperties
};

const audioNodeProps: AudioNodeProps = {
    nodeType: 'audio',
    properties: [
        {name: 'duration', default: 0},
        {name: 'mimeType', default: ''},
        {name: 'src', default: '', urlType: 'url'},
        {name: 'title', default: ''},
        {name: 'thumbnailSrc', default: ''}
    ]
};

export class AudioNode extends generateDecoratorNode(audioNodeProps) {
    constructor(dataset: AudioNodeDataset) {
        super(dataset);    
    }

    static importDOM(): DOMConversionMap | null {
        return parseAudioNode();
    }

    exportDOM(options = {}) {
        return renderAudioNode(this, options);
    }
}

export const $createAudioNode = (dataset: AudioNodeDataset) => {
    return new AudioNode(dataset);
};

export function $isAudioNode(node: LexicalNode) {
    return node instanceof AudioNode;
}
