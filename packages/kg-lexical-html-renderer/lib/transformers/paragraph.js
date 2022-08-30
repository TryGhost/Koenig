const {$isParagraphNode} = require('lexical');

module.exports = {
    export(node, exportChildren) {
        if (!$isParagraphNode(node)) {
            return null;
        }

        return `<p>${exportChildren(node)}</p>`;
    }
};
