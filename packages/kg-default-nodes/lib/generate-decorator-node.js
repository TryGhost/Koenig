import {KoenigDecoratorNode} from './KoenigDecoratorNode';

/**
 * @typedef {Object} DecoratorNodeAttribute
 * @property {string} name - The attribute's name.
 * @property {string} type - The attribute's type.
 * @property {*} default - The attribute's default value.
 * @property {string|null} urlType - If the attribute contains a URL, the URL's type (e.g. 'url', 'html', 'markdown')
 *
 * @param {string} nodeType – The node's type (must be unique)
 * @param {DecoratorNodeAttribute[]} attributes - An array of attributes for the generated class
 * @returns {Object} - The generated class.
 */
export function generateDecoratorNode({nodeType = '', attributes = []}) {
    attributes = attributes.map((obj) => {
        return {...obj, privateName: `__${obj.name}`};
    });

    class GeneratedDecoratorNode extends KoenigDecoratorNode {
        constructor(data = {}, key) {
            super(key);
            attributes.forEach((attr) => {
                this[attr.privateName] = data[attr.name] || attr.default;
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
                dataset[attr.name] = self[attr.privateName];
            });

            return dataset;
        }

        static importJSON(serializedNode) {
            const data = {};
            attributes.forEach((attr) => {
                data[attr.name] = serializedNode[attr.name];
            });

            return new this(data);
        }

        exportJSON() {
            const dataset = {
                type: nodeType,
                version: 1,
                ...attributes.reduce((obj, attr) => {
                    obj[attr.name] = this[attr.name];
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
    }

    // Add getters and setters to the class prototype
    attributes.forEach((attr) => {
        Object.defineProperty(GeneratedDecoratorNode.prototype, attr.name, {
            get: function () {
                const self = this.getLatest();
                return self[attr.privateName];
            },
            set: function (newVal) {
                const writable = this.getWritable();
                writable[attr.privateName] = newVal;
            }
        });
    });

    return GeneratedDecoratorNode;
}