import {ToggleParser} from './ToggleParser';
import {renderToggleNodeToDOM} from './ToggleRenderer';
import {generateDecoratorNode} from '../../generate-decorator-node';
import readTextContent from '../../utils/read-text-content';
export class ToggleNode extends generateDecoratorNode({nodeType: 'toggle',
    properties: [
        {name: 'content', type: 'string', default: '', urlType: 'html'},
        {name: 'heading', type: 'string', default: '', urlType: 'html'}
    ]}
) {
    static importDOM() {
        const parser = new ToggleParser(this);
        return parser.DOMConversionMap;
    }

    exportDOM(options = {}) {
        const {element, type} = renderToggleNodeToDOM(this, options);
        return {element, type};
    }

    getTextContent() {
        const self = this.getLatest();

        const text = [
            readTextContent(self, 'heading'),
            readTextContent(self, 'content')
        ].filter(Boolean).join('\n');

        return text ? `${text}\n\n` : '';
    }
}

export const $createToggleNode = (dataset) => {
    return new ToggleNode(dataset);
};

export function $isToggleNode(node) {
    return node instanceof ToggleNode;
}
