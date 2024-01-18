"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexical_1 = require("lexical");
var link_1 = require("@lexical/link");
// TODO: update once kg-default-nodes is typescript
// eslint-disable-next-line @typescript-eslint/no-var-requires
var $isKoenigCard = require('@tryghost/kg-default-nodes').$isKoenigCard;
var TextContent_1 = require("./utils/TextContent");
var transformers_1 = require("./transformers");
function $convertToHtmlString(options) {
    if (options === void 0) { options = {}; }
    var output = [];
    var children = (0, lexical_1.$getRoot)().getChildren();
    options.usedIdAttributes = options.usedIdAttributes || {};
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        var result = exportTopLevelElementOrDecorator(child, options);
        if (result !== null) {
            output.push(result);
        }
    }
    // Koenig keeps a blank paragraph at the end of a doc but we want to
    // make sure it doesn't get rendered
    var lastChild = children[children.length - 1];
    if (lastChild && (0, lexical_1.$isParagraphNode)(lastChild) && lastChild.getTextContent().trim() === '') {
        output.pop();
    }
    return output.join('');
}
exports.default = $convertToHtmlString;
function exportTopLevelElementOrDecorator(node, options) {
    if ($isKoenigCard(node)) {
        // NOTE: kg-default-nodes appends type in rare cases to make use of this functionality... with moving to typescript,
        //  we should change this implementation because it's confusing, or we should override the DOMExportOutput type
        var _a = node.exportDOM(options), element = _a.element, type = _a.type;
        switch (type) {
            case 'inner':
                return element.innerHTML;
            case 'value':
                return element.value;
            default:
                return element.outerHTML;
        }
    }
    // note: unsure why this type isn't being picked up from the import
    for (var _i = 0, elementTransformers_1 = transformers_1.default; _i < elementTransformers_1.length; _i++) {
        var transformer = elementTransformers_1[_i];
        if (transformer.export !== null) {
            var result = transformer.export(node, options, function (_node) { return exportChildren(_node, options); });
            if (result !== null) {
                return result;
            }
        }
    }
    return (0, lexical_1.$isElementNode)(node) ? exportChildren(node, options) : null;
}
function exportChildren(node, options) {
    var output = [];
    var children = node.getChildren();
    var textContent = new TextContent_1.default(exportChildren, options);
    for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
        var child = children_2[_i];
        if (!textContent.isEmpty() && !(0, lexical_1.$isLineBreakNode)(child) && !(0, lexical_1.$isTextNode)(child) && !(0, link_1.$isLinkNode)(child)) {
            output.push(textContent.render());
            textContent.clear();
        }
        if ((0, lexical_1.$isLineBreakNode)(child) || (0, lexical_1.$isTextNode)(child) || (0, link_1.$isLinkNode)(child)) {
            textContent.addNode(child);
        }
        else if ((0, lexical_1.$isElementNode)(child)) {
            output.push(exportChildren(child, options));
        }
    }
    if (!textContent.isEmpty()) {
        output.push(textContent.render());
    }
    return output.join('');
}
