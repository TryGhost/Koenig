"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rich_text_1 = require("@lexical/rich-text");
var generate_id_1 = require("../../utils/generate-id");
module.exports = {
    export: function (node, options, exportChildren) {
        if (!(0, rich_text_1.$isHeadingNode)(node)) {
            return null;
        }
        var tag = node.getTag();
        var id = (0, generate_id_1.default)(node.getTextContent(), options);
        return "<".concat(tag, " id=\"").concat(id, "\">").concat(exportChildren(node), "</").concat(tag, ">");
    }
};
