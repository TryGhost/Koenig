"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list_1 = require("@lexical/list");
var exportList = function (node, options, exportChildren) {
    if (!(0, list_1.$isListNode)(node)) {
        return null;
    }
    var tag = node.getTag();
    var start = node.getStart();
    // track an open <li> outside of the child loop, we do this so we can nest lists
    // inside <li> elements that already have their contents rendered, e.g.:
    // <li>one
    //   <ol>
    //     <li>one.two</li>
    //   </ol>
    // </li>
    var liOpen = false;
    var exportListContent = function (listNode) {
        var output = [];
        var children = listNode.getChildren();
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            if (!(0, list_1.$isListItemNode)(child)) {
                continue;
            }
            var listChildren = child.getChildren();
            if ((0, list_1.$isListNode)(listChildren[0])) {
                output.push(exportList(listChildren[0], options, exportChildren));
                if (liOpen) {
                    output.push('</li>');
                    liOpen = false;
                }
            }
            else {
                if (liOpen) {
                    output.push('</li>');
                    liOpen = false;
                }
                output.push("<li>".concat(exportChildren(child, options)));
                liOpen = true;
            }
        }
        if (liOpen) {
            output.push('</li>');
            liOpen = false;
        }
        return output.join('');
    };
    var listContent = exportListContent(node);
    // CASE: list has a start value specified > 1
    if (start !== 1 && start !== null && start !== undefined) {
        return "<".concat(tag, " start=\"").concat(start, "\">").concat(listContent, "</").concat(tag, ">");
    }
    else {
        return "<".concat(tag, ">").concat(listContent, "</").concat(tag, ">");
    }
};
module.exports = {
    export: function (node, options, exportChildren) {
        return exportList(node, options, exportChildren);
    }
};
