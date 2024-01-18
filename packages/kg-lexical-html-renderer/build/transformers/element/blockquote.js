"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rich_text_1 = require("@lexical/rich-text");
module.exports = {
    export: function (node, options, exportChildren) {
        if (!(0, rich_text_1.$isQuoteNode)(node)) {
            return null;
        }
        return "<blockquote>".concat(exportChildren(node), "</blockquote>");
    }
};
