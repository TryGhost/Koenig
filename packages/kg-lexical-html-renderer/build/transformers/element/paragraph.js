"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexical_1 = require("lexical");
module.exports = {
    export: function (node, options, exportChildren) {
        if (!(0, lexical_1.$isParagraphNode)(node)) {
            return null;
        }
        return "<p>".concat(exportChildren(node), "</p>");
    }
};
