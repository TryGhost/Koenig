import {generateDecoratorNode} from '../../generate-decorator-node';
import {renderPostNode} from './PostRenderer';
import {parsePostNode} from './PostParser';

export class PostNode extends generateDecoratorNode({nodeType: 'post',
    properties: [
        {name: 'content', type: 'string', default: '', urlType: 'html', wordCount: true}
    ]}
) {
    exportDOM(options = {}) {
        return renderPostNode(this, options);
    }

    static importDOM() {
        return parsePostNode(this);
    }
}

export const $createPostNode = (dataset) => {
    return new PostNode(dataset);
};

export function $isPostNode(node) {
    return node instanceof PostNode;
}