"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var elementTransformers = [
    require('./element/paragraph'),
    require('./element/heading'),
    require('./element/list'),
    require('./element/blockquote'),
    require('./element/aside')
];
exports.default = elementTransformers;
