"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: update this to an import once we move kg-default-nodes to typescript
// eslint-disable-next-line @typescript-eslint/no-var-requires
var $isAsideNode = require('@tryghost/kg-default-nodes').$isAsideNode;
module.exports = {
    export: function (node, options, exportChildren) {
        if (!$isAsideNode(node)) {
            return null;
        }
        return "<blockquote class=\"kg-blockquote-alt\">".concat(exportChildren(node), "</blockquote>");
    }
};
