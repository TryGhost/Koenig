const {$isParagraphNode} = require('lexical');

module.exports = {
    export(node, options, exportChildren) {
        if (!$isParagraphNode(node)) {
            return null;
        }

        // TODO: remove, used for demo of different render targets
        if (options.target === 'email') {
            return `<p class="for-mail">${exportChildren(node)}</p>`;
        }

        return `<p>${exportChildren(node)}</p>`;
    }
};
