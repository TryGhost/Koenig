/* eslint-disable ghost/filenames/match-exported-class */
import {LexicalNode} from 'lexical';
import {generateDecoratorNode} from '../../generate-decorator-node';
import {parseAudioNode} from './audio-parser';
import {renderAudioNode} from './audio-renderer';

export type AudioNodeDataset = {
    duration?: number;
    mimeType?: string;
    src?: string;
    title?: string;
    thumbnailSrc?: string;
};

export class AudioNode extends generateDecoratorNode(
    {
        nodeType: 'audio',
        properties: [
            {name: 'duration', default: 0},
            {name: 'mimeType', default: ''},
            {name: 'src', default: '', urlType: 'url'},
            {name: 'title', default: ''},
            {name: 'thumbnailSrc', default: ''}
        ]
    }
) {
    static importDOM() {
        return parseAudioNode();
    }

    exportDOM(options = {}) {
        return renderAudioNode(this, options);
    }
}

// TODO: Not sure how to handle the 'any' here; it's a result of the `generateDecoratorNode` function
//  and the fact that the constructor is obscured, so it's pulling from the DecoratorNode class
// 
// Given that we call the $create methods in koenig-lexical, we really want to have type safety on the dataset properties
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const $createAudioNode = (dataset: any) => {
    return new AudioNode(dataset);
};

export function $isAudioNode(node: LexicalNode) {
    return node instanceof AudioNode;
}
