import {parseToggleNode} from './ToggleParser';
import {renderToggleNode} from './ToggleRenderer';
import {generateDecoratorNode} from '../../generate-decorator-node';

export class ToggleNode extends generateDecoratorNode({nodeType: 'toggle',
    properties: [
        {name: 'heading', type: 'string', default: '', urlType: 'html', wordCount: true},
        {name: 'content', type: 'string', default: '', urlType: 'html', wordCount: true}
    ]}
) {
    static importDOM() {
        return parseToggleNode(this);
    }

    exportDOM(options = {}) {
        return renderToggleNode(this, options);
    }
}

export const $createToggleNode = (dataset) => {
    return new ToggleNode(dataset);
};

export function $isToggleNode(node) {
    return node instanceof ToggleNode;
}
