import {KoenigDecoratorNode} from './KoenigDecoratorNode';
import readTextContent from './utils/read-text-content';
/**
 * Validates the required arguments passed to `generateDecoratorNode`
*/
function validateArguments(nodeType, properties) {
    /* eslint-disable ghost/ghost-custom/no-native-error */
    /* c8 ignore start */
    if (!nodeType) {
        throw new Error({message: '[generateDecoratorNode] A unique "nodeType" should be provided'});
    }

    properties.forEach((prop) => {
        if (!('name' in prop) || !('default' in prop)){
            throw new Error({message: '[generateDecoratorNode] Properties should have both "name" and "default" attributes.'});
        }

        if (prop.urlType && !['url', 'html', 'markdown'].includes(prop.urlType)) {
            throw new Error({message: '[generateDecoratorNode] "urlType" should be either "url", "html" or "markdown"'});
        }

        if ('wordCount' in prop && typeof prop.wordCount !== 'boolean') {
            throw new Error({message: '[generateDecoratorNode] "wordCount" should be of boolean type.'});
        }
    });
    /* c8 ignore stop */
}

/**
 * @typedef {Object} DecoratorNodeProperty
 * @property {string} name - The property's name.
 * @property {*} default - The property's default value
 * @property {('url'|'html'|'markdown'|null)} urlType - If the property contains a URL, the URL's type: 'url', 'html' or 'markdown'. Use 'url' is the property contains only a URL, 'html' or 'markdown' if the property contains HTML or markdown code, that may contain URLs.
 * @property {boolean} wordCount - Whether the property should be counted in the word count
 *
 * @param {string} nodeType – The node's type (must be unique)
 * @param {DecoratorNodeProperty[]} properties - An array of properties for the generated class
 * @returns {Object} - The generated class.
 */
export function generateDecoratorNode({nodeType, properties = [], version = 1}) {
    validateArguments(nodeType, properties);

    // Adds a `privateName` field to the properties for convenience (e.g. `__name`):
    // properties: [{name: 'name', privateName: '__name', type: 'string', default: 'hello'}, {...}]
    properties = properties.map((prop) => {
        return {...prop, privateName: `__${prop.name}`};
    });

    class GeneratedDecoratorNode extends KoenigDecoratorNode {
        constructor(data = {}, key) {
            super(key);
            properties.forEach((prop) => {
                if (typeof prop.default === 'boolean') {
                    this[prop.privateName] = data[prop.name] ?? prop.default;
                } else {
                    this[prop.privateName] = data[prop.name] || prop.default;
                }
            });
        }

        /**
         * Returns the node's unique type
         * @extends DecoratorNode
         * @see https://lexical.dev/docs/concepts/nodes#extending-decoratornode
         * @returns {string}
         */
        static getType() {
            return nodeType;
        }

        /**
         * Creates a copy of an existing node with all its properties
         * @extends DecoratorNode
         * @see https://lexical.dev/docs/concepts/nodes#extending-decoratornode
         */
        static clone(node) {
            return new this(node.getDataset(), node.__key);
        }

        /**
         * Transforms URLs contained in the payload to relative paths (`__GHOST_URL__/relative/path/`),
         * so that URLs to be changed without having to update the database
         * @see https://github.com/TryGhost/SDK/tree/main/packages/url-utils
         */
        static get urlTransformMap() {
            let map = {};

            properties.forEach((prop) => {
                if (prop.urlType) {
                    map[prop.name] = prop.urlType;
                }
            });

            return map;
        }

        /**
         * Convenience method to get all properties of the node
         * @returns {Object} - The node's properties
         */
        getDataset() {
            const self = this.getLatest();

            let dataset = {};
            properties.forEach((prop) => {
                dataset[prop.name] = self[prop.privateName];
            });

            return dataset;
        }

        /**
         * Converts JSON to a Lexical node
         * @see https://lexical.dev/docs/concepts/serialization#lexicalnodeimportjson
         * @extends DecoratorNode
         * @param {Object} serializedNode - Lexical's representation of the node, in JSON format
         */
        static importJSON(serializedNode) {
            const data = {};

            properties.forEach((prop) => {
                data[prop.name] = serializedNode[prop.name];
            });

            return new this(data);
        }

        /**
         * Serializes a Lexical node to JSON. The JSON content is then saved to the database.
         * @extends DecoratorNode
         * @see https://lexical.dev/docs/concepts/serialization#lexicalnodeexportjson
         */
        exportJSON() {
            const dataset = {
                type: nodeType,
                version: version,
                ...properties.reduce((obj, prop) => {
                    obj[prop.name] = this[prop.name];
                    return obj;
                }, {})
            };
            return dataset;
        }

        /* c8 ignore start */
        /**
         * Inserts node in the DOM. Required when extending the DecoratorNode.
         * @extends DecoratorNode
         * @see https://lexical.dev/docs/concepts/nodes#extending-decoratornode
         */
        createDOM() {
            return document.createElement('div');
        }

        /**
         * Required when extending the DecoratorNode
         * @extends DecoratorNode
         * @see https://lexical.dev/docs/concepts/nodes#extending-decoratornode
         */
        updateDOM() {
            return false;
        }

        /**
         * Defines whether a node is a top-level block.
         * @see https://lexical.dev/docs/api/classes/lexical.DecoratorNode#isinline
         */
        isInline() {
            // All our cards are top-level blocks. Override if needed.
            return false;
        }
        /* c8 ignore stop */

        /**
         * Defines whether a node has dynamic data that needs to be fetched from the server when rendering
         */
        hasDynamicData() {
            return false;
        }

        /**
         * Defines whether a node has an edit mode in the editor UI
         */
        hasEditMode() {
            // Most of our cards have an edit mode. Override if needed.
            return true;
        }

        /*
        * Returns the text content of the node, used by the editor to calculate the word count
        * This method filters out properties without `wordCount: true`
        */
        getTextContent() {
            const self = this.getLatest();
            const propertiesWithText = properties.filter(prop => !!prop.wordCount);

            const text = propertiesWithText.map(
                prop => readTextContent(self, prop.name)
            ).filter(Boolean).join('\n');

            return text ? `${text}\n\n` : '';
        }
    }

    /**
     * Generates getters and setters for each property, following ES6 syntax
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
     *
     * Example: for a given property 'content', the generated getter and setter will be:
     * get content() {
     *    const self = this.getLatest();
     *    return self.__content;
     * }
     *
     * set content(newVal) {
     *   const writable = this.getWritable();
     *   writable.__content = newVal;
     * }
     *
     * They can be used as `node.content` (getter) and `node.content = 'new value'` (setter)
     */
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