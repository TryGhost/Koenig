import {KoenigDecoratorNode} from '../KoenigDecoratorNode';

/**
 * @typedef {Object} DecoratorNodeAttribute
 * @property {string} name - The attribute's name.
 * @property {string} type - The attribute's type.
 * @property {*} default - The attribute's default value.
 * @property {string|null} urlType - If the attribute contains a URL, the URL's type (e.g. 'url', 'html', 'markdown')
 *
 * @typedef {string} nodeType – The node's type (must be unique)
 * @param {DecoratorNodeAttribute[]} attributes - An array of attributes for the generated class
 * @returns {Object} - The generated class.
 */
export function generateDecoratorNodeFromAttrs({nodeType = '', attributes = []}) {
    const attributeNames = attributes.map(attr => attr.name);

    let generatedClass = class extends KoenigDecoratorNode {
        constructor(data = {}, key) {
            super(key);
            attributes.forEach((attr) => {
                this['__' + attr.name] = data[attr.name] || attr.default;
            });
        }

        static getType() {
            return nodeType;
        }
  
        static clone(node) {
            return new this(node.getDataset(), node.__key);
        }

        // Transforms URLs contained in the payload to relative paths (`__GHOST_URL__/relative/path/`),
        // so that URLs to be changed without having to update the database
        // (cf. `@tryghost/url-utils` for more information)
        static get urlTransformMap() {
            let map = {};
            attributes.forEach((attr) => {
                if (attr.urlType) {
                    map[attr.name] = attr.urlType;
                }
            });
            return map;
        }

        getDataset() {
            const self = this.getLatest();

            let dataset = {};
            attributes.forEach((attr) => {
                dataset[attr.name] = self['__' + attr.name];
            });

            return dataset;
        }

        static importJSON(serializedNode) {
            const data = {};
            attributeNames.forEach((name) => {
                data[name] = serializedNode[name];
            });

            return new this(data);
        }

        exportJSON() {
            const dataset = {
                type: nodeType,
                version: 1,
                ...attributeNames.reduce((obj, name) => {
                    obj[name] = this['get' + toPascalCase(name)]();
                    return obj;
                }, {})
            };
            return dataset;
        }

        /* c8 ignore start */
        createDOM() {
            return document.createElement('div');
        }

        updateDOM() {
            return false;
        }

        // All our cards are top-level blocks
        isInline() {
            return false;
        }

        // Most of our cards are editable
        // If not, override this method
        hasEditMode() {
            return true;
        }
        /* c8 ignore stop */
    };

    // Define getters and setters for each attribute, using getAttribute() and setAttribute(attr) formats
    attributeNames.forEach((name) => {
        const capName = toPascalCase(name);
        Object.defineProperty(generatedClass.prototype, `get${capName}`, {
            value: function () {
                const self = this.getLatest();
                return self['__' + name];
            },
            configurable: true,
            writable: true
        });
    
        Object.defineProperty(generatedClass.prototype, `set${capName}`, {
            value: function (value) {
                const writable = this.getWritable();
                writable['__' + name] = value;
            },
            configurable: true,
            writable: true
        });
    });

    return generatedClass;
}

function toPascalCase(str) {
    return str.replace(/(^\w|-\w)/g, text => text.replace(/-/, '').toUpperCase());
}