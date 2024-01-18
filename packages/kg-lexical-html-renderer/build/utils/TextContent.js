"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var link_1 = require("@lexical/link");
var lexical_1 = require("lexical");
var FORMAT_TAG_MAP = {
    bold: 'STRONG',
    italic: 'EM',
    strikethrough: 'S',
    underline: 'U',
    code: 'CODE',
    subscript: 'SUB',
    superscript: 'SUP',
    highlight: 'MARK'
};
// Builds and renders text content, useful to ensure proper format tag opening/closing
// and html escaping
var TextContent = /** @class */ (function () {
    function TextContent(exportChildren, options) {
        this.exportChildren = exportChildren;
        this.options = options;
        this.nodes = [];
    }
    TextContent.prototype.addNode = function (node) {
        this.nodes.push(node);
    };
    TextContent.prototype.render = function () {
        // NOTE: dom would always be defined here because this is called by the renderer, which instantiates it if it's not passed in
        //  so this needs to be cleaned up.. maybe by a new interface for TextContent
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        var document = this.options.dom.window.document;
        var root = document.createElement('div');
        var currentNode = root;
        var openFormats = [];
        var _loop_1 = function (i) {
            var node = this_1.nodes[i];
            if ((0, lexical_1.$isLineBreakNode)(node)) {
                currentNode.append(document.createElement('BR'));
                return "continue";
            }
            if ((0, link_1.$isLinkNode)(node)) {
                var anchor = document.createElement('A');
                this_1._buildAnchorElement(anchor, node);
                currentNode.append(anchor);
                return "continue";
            }
            if ((0, lexical_1.$isTextNode)(node)) {
                // shortcut format code for plain text
                if (node.getFormat() === 0) {
                    currentNode.append(node.getTextContent());
                    return "continue";
                }
                // open format tags in correct order
                var formatsToOpen_1 = [];
                // get base list of formats that need to open
                Object.entries(FORMAT_TAG_MAP).forEach(function (_a) {
                    var format = _a[0];
                    if (node.hasFormat(format) && !openFormats.includes(format)) {
                        formatsToOpen_1.push(format);
                    }
                });
                // re-order formats to open based on next nodes - we want to make
                // sure tags that will be kept open for later nodes are opened first
                var remainingNodes = this_1.nodes.slice(i + 1);
                // avoid checking any nodes after a link node because those cause all formats to close
                var nextLinkNodeIndex = remainingNodes.findIndex(function (n) { return (0, link_1.$isLinkNode)(n); });
                var remainingSortNodes_1 = nextLinkNodeIndex === -1 ? remainingNodes : remainingNodes.slice(0, nextLinkNodeIndex);
                // ensure we're only working with text nodes as they're the only ones that can open/close formats
                remainingSortNodes_1 = remainingSortNodes_1.filter(function (n) { return (0, lexical_1.$isTextNode)(n); });
                formatsToOpen_1.sort(function (a, b) {
                    var aIndex = remainingSortNodes_1.findIndex(function (n) { return n.hasFormat(a); });
                    var bIndex = remainingSortNodes_1.findIndex(function (n) { return n.hasFormat(b); });
                    if (aIndex === -1) {
                        return 1;
                    }
                    if (bIndex === -1) {
                        return -1;
                    }
                    return aIndex - bIndex;
                });
                // open new tags
                formatsToOpen_1.forEach(function (format) {
                    var formatTag = document.createElement(FORMAT_TAG_MAP[format]);
                    currentNode.append(formatTag);
                    currentNode = formatTag;
                    openFormats.push(format);
                });
                // insert text
                currentNode.append(node.getTextContent());
                // close tags in correct order if next node doesn't have the format
                // links are their own formatting islands so all formats need to close before a link
                var nextNode_1 = remainingNodes.find(function (n) { return (0, lexical_1.$isTextNode)(n) || (0, link_1.$isLinkNode)(n); });
                __spreadArray([], openFormats, true).forEach(function (format) {
                    if (!nextNode_1 || (0, link_1.$isLinkNode)(nextNode_1) || !nextNode_1.hasFormat(format)) {
                        currentNode = currentNode.parentNode;
                        openFormats.pop();
                    }
                });
                return "continue";
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.nodes.length; i++) {
            _loop_1(i);
        }
        return root.innerHTML;
    };
    TextContent.prototype.isEmpty = function () {
        return this.nodes.length === 0;
    };
    TextContent.prototype.clear = function () {
        this.nodes = [];
    };
    // PRIVATE -----------------------------------------------------------------
    TextContent.prototype._buildAnchorElement = function (anchor, node) {
        // Only set the href if we have a URL, otherwise we get a link to the current page
        if (node.getURL()) {
            anchor.setAttribute('href', node.getURL());
        }
        if (node.getRel()) {
            anchor.setAttribute('rel', node.getRel());
        }
        anchor.innerHTML = this.exportChildren(node, this.options);
    };
    return TextContent;
}());
module.exports = TextContent;
