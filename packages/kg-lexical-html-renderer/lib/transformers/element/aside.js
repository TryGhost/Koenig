const {$isAsideNode} = require('@tryghost/kg-default-nodes');

module.exports = {
    export(node, options, exportChildren) {
        if (!$isAsideNode(node)) {
            return null;
        }

        return `<aside class='kg-blockquote-alt'>${exportChildren(node)}</aside>`;
    }
};
