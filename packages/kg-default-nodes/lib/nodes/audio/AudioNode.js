import {generateDecoratorNode} from '../../generate-decorator-node';
import {AudioParser} from './AudioParser';
import {renderAudioNodeToDOM} from './AudioRenderer';

export class AudioNode extends generateDecoratorNode({nodeType: 'audio',
    properties: [
        {name: 'duration', type: 'integer', default: 0},
        {name: 'mimeType', type: 'string', default: ''},
        {name: 'src', type: 'string', default: '', urlType: 'url'},
        {name: 'title', type: 'string', default: ''},
        {name: 'thumbnailSrc', type: 'string', default: ''}
    ]}
) {
    static importDOM() {
        const parser = new AudioParser(this);
        return parser.DOMConversionMap;
    }

    exportDOM(options = {}) {
        const {element, type} = renderAudioNodeToDOM(this, options);
        return {element, type};
    }
}

export const $createAudioNode = (dataset) => {
    return new AudioNode(dataset);
};

export function $isAudioNode(node) {
    return node instanceof AudioNode;
}