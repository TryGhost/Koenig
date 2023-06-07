import {KoenigDecoratorNode} from './KoenigDecoratorNode';

/**
 * @typedef {Object} DecoratorNodeProperty
 * @property {string} name - The property's name.
 * @property {string} type - The property's type.
 * @property {*} default - The property's default value.
 * @property {string|null} urlType - If the property contains a URL, the URL's type (e.g. 'url', 'html', 'markdown')
 *
 * @param {string} nodeType – The node's type (must be unique)
 * @param {DecoratorNodeProperty[]} properties - An array of properties for the generated class
 * @returns {Object} - The generated class.
 */
export function generateDecoratorNode({nodeType = '', properties = []}) {
    properties = properties.map((obj) => {
        return {...obj, privateName: `__${obj.name}`};
    });

    class GeneratedDecoratorNode extends KoenigDecoratorNode {
        constructor(data = {}, key) {
            super(key);
            properties.forEach((prop) => {
                this[prop.privateName] = data[prop.name] || prop.default;
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

            properties.forEach((prop) => {
                if (prop.urlType) {
                    map[prop.name] = prop.urlType;
                }
            });

            return map;
        }

        getDataset() {
            const self = this.getLatest();

            let dataset = {};
            properties.forEach((prop) => {
                dataset[prop.name] = self[prop.privateName];
            });

            return dataset;
        }

        static importJSON(serializedNode) {
            const data = {};

            properties.forEach((prop) => {
                data[prop.name] = serializedNode[prop.name];
            });

            return new this(data);
        }

        exportJSON() {
            const dataset = {
                type: nodeType,
                version: 1,
                ...properties.reduce((obj, prop) => {
                    obj[prop.name] = this[prop.name];
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
    properties.forEach((prop) => {
        Object.defineProperty(GeneratedDecoratorNode.prototype, prop.name, {
            get: function () {
                const self = this.getLatest();
                return self[prop.privateName];
            },
            set: function (newVal) {
                const writable = this.getWritable();
                writable[prop.privateName] = newVal;
            }
        });
    });

    return GeneratedDecoratorNode;
}