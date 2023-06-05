import {ToggleParser} from './ToggleParser';
import {renderToggleNodeToDOM} from './ToggleRenderer';
import {generateDecoratorNodeFromAttrs} from '../../utils/generate-decorator-node-from-attributes';

export class ToggleNode extends generateDecoratorNodeFromAttrs({nodeType: 'toggle',
    attributes: [
        {name: 'content', type: 'string', default: '', urlType: 'url'},
        {name: 'heading', type: 'string', default: '', urlType: 'url'}
    ]}
) {
    static importDOM() {
        const parser = new ToggleParser(this);
        return parser.DOMConversionMap;
    }

    exportDOM(options = {}) {
        const element = renderToggleNodeToDOM(this, options);
        return {element};
    }
}

export const $createToggleNode = (dataset) => {
    return new ToggleNode(dataset);
};

export function $isToggleNode(node) {
    return node instanceof ToggleNode;
}
