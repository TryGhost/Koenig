"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: update to import when converted to typescript, for now disable next line
// eslint-disable-next-line
var slugify = require('@tryghost/kg-utils').slugify;
function generateId(text, options) {
    if (!options.usedIdAttributes) {
        options.usedIdAttributes = {};
    }
    var id = slugify(text, options);
    var deduplicatedId = id;
    if (options.usedIdAttributes[id] !== undefined) {
        deduplicatedId += "-".concat(options.usedIdAttributes[id]);
        options.usedIdAttributes[id] += 1;
    }
    else {
        options.usedIdAttributes[id] = 1;
    }
    return deduplicatedId;
}
exports.default = generateId;
