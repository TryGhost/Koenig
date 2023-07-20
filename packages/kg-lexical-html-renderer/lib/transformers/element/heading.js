const {$isHeadingNode} = require('@lexical/rich-text');
const generateId = require('../../utils/generate-id');

module.exports = {
    export(node, options, exportChildren) {
        if (!$isHeadingNode(node)) {
            return null;
        }

        const tag = node.getTag();
        const version = node.getVersion();

        if (typeof version !== 'number') {
            options.ghostVersion = version;
        }

        const id = generateId(node.getTextContent(), options);

        return `<${tag} id="${id}">${exportChildren(node)}</${tag}>`;
    }
};
