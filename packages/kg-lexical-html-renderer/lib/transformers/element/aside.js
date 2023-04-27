const {$isAsideNode} = require('@tryghost/kg-default-nodes');

module.exports = {
    export(node, options, exportChildren) {
        if (!$isAsideNode(node)) {
            return null;
        }

        return `<aside>${exportChildren(node)}</aside>`;
    }
};
