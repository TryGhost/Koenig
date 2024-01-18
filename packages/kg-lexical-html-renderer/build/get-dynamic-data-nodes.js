"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexical_1 = require("lexical");
// TODO: update to import when this is moved to typescript
// eslint-disable-next-line @typescript-eslint/no-var-requires
var $isKoenigCard = require('@tryghost/kg-default-nodes').$isKoenigCard;
function getDynamicDataNodes(editorState) {
    var dynamicNodes = [];
    editorState.read(function () {
        var root = (0, lexical_1.$getRoot)();
        var nodes = root.getChildren();
        nodes.forEach(function (node) {
            var _a;
            if ($isKoenigCard(node) && ((_a = node.hasDynamicData) === null || _a === void 0 ? void 0 : _a.call(node))) {
                dynamicNodes.push(node);
            }
        });
    });
    return dynamicNodes;
}
exports.default = getDynamicDataNodes;
