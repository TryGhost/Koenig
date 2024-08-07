import {$isAsideNode, RendererOptions} from '@tryghost/kg-default-nodes';
import type {ElementNode} from 'lexical';
import type {ExportChildren} from '..';

module.exports = {
    export(node: ElementNode, options: RendererOptions, exportChildren: ExportChildren) {
        if (!$isAsideNode(node)) {
            return null;
        }

        if (options.target === 'email') {
            let children = exportChildren(node);

            if (!children.startsWith('<p>')) {
                children = `<p>${children}</p>`;
            }

            return `<blockquote class="kg-blockquote-alt">${children}</blockquote>`;
        }

        return `<blockquote class="kg-blockquote-alt">${exportChildren(node)}</blockquote>`;
    }
};
