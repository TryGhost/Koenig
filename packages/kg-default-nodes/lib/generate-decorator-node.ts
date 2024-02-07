import {NodeKey} from 'lexical';
import {KoenigDecoratorNode} from './KoenigDecoratorNode';
import readTextContent from './utils/read-text-content';
/**
 * Validates the required arguments passed to `generateDecoratorNode`
 * @see https://lexical.dev/docs/concepts/nodes#extending-decoratornode
*/

// NOTE: There's some liberal use of 'any' in this file despite moving it to typescript. This is a difficult one to get right
//  because we're generating classes.

export type KoenigDecoratorProperty = {
    name: string;
    default?: number | string | boolean | null;
    urlType?: 'url'|'html'|'markdown';
    wordCount?: boolean;
};

export type KoenigDecoratorNodeProperties = KoenigDecoratorProperty[];

function validateArguments(nodeType: string, properties: KoenigDecoratorNodeProperties) {
    /* eslint-disable ghost/ghost-custom/no-native-error */
    /* c8 ignore start */
    if (!nodeType) {
        throw new Error('[generateDecoratorNode] A unique "nodeType" should be provided');
    }

    properties.forEach((prop) => {
        if (!('name' in prop) || !('default' in prop)){
            throw new Error('[generateDecoratorNode] Properties should have both "name" and "default" attributes.');
        }

        if (prop.urlType && !['url', 'html', 'markdown'].includes(prop.urlType)) {
            throw new Error('[generateDecoratorNode] "urlType" should be either "url", "html" or "markdown"');
        }

        if ('wordCount' in prop && typeof prop.wordCount !== 'boolean') {
            throw new Error('[generateDecoratorNode] "wordCount" should be of boolean type.');
        }
    });
    /* c8 ignore stop */
}

// expand the properties to include a privateName field
type PrivateKoenigProperty = KoenigDecoratorProperty & {privateName: string};

type GenerateKoenigDecoratorNodeFn = (options: GenerateKoenigDecoratorNodeOptions) => typeof GeneratedKoenigDecoratorNode;

type GenerateKoenigDecoratorNodeOptions = {
    nodeType: string;
    properties?: KoenigDecoratorNodeProperties;
    version?: number;
};

type SerializedKoenigDecoratorNode = {
    type: string;
    version: number;
    [key: string]: any;
};

class GeneratedKoenigDecoratorNode extends KoenigDecoratorNode {
    
    constructor(data: GenerateKoenigDecoratorNodeOptions) {
        super();
        this.generateDecoratorNode(data);
    }
}

export const generateDecoratorNode: GenerateKoenigDecoratorNodeFn = ({nodeType, properties = [], version = 1}) => {
    validateArguments(nodeType, properties);

    // Adds a `privateName` field to the properties for convenience (e.g. `__name`):
    // properties: [{name: 'name', privateName: '__name', type: 'string', default: 'hello'}, {...}]
    const __properties: PrivateKoenigProperty[] = properties.map((prop) => {
        return {...prop, privateName: `__${prop.name}`};
    });

    class GeneratedDecoratorNode extends KoenigDecoratorNode {
        // allow any type here for ease of use
        constructor(data: any = {}, key?: NodeKey) {
            super(key);
            __properties.forEach((prop) => {
                if (typeof prop.default === 'boolean') {
                    this[prop.privateName] = data[prop.name] ?? prop.default;
                } else {
                    this[prop.privateName] = data[prop.name] || prop.default;
                }
            });
        }

        static getType(): string {
            return nodeType;
        }

        static clone(node: KoenigDecoratorNode) {
            return new this(node.getDataset(), node.__key);
        }

        /**
         * Transforms URLs contained in the payload to relative paths (`__GHOST_URL__/relative/path/`),
         * so that URLs to be changed without having to update the database
         * @see https://github.com/TryGhost/SDK/tree/main/packages/url-utils
         */
        static get urlTransformMap() {
            let map: any = {};

            __properties.forEach((prop) => {
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

            let dataset: any = {};
            __properties.forEach((prop) => {
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

        static importJSON(serializedNode: SerializedKoenigDecoratorNode): KoenigDecoratorNode {
            const data: any = {};

            __properties.forEach((prop) => {
                data[prop.name] = serializedNode[prop.name];
            });

            return new this(data);
        }

        /**
         * Serializes a Lexical node to JSON. The JSON content is then saved to the database.
         * @extends DecoratorNode
         * @see https://lexical.dev/docs/concepts/serialization#lexicalnodeexportjson
         */
        exportJSON(): SerializedKoenigDecoratorNode {
            const dataset = {
                type: nodeType,
                version: version,
                ...__properties.reduce((obj: any, prop) => {
                    obj[prop.name] = this[prop.name];
                    return obj;
                }, {})
            };
            return dataset;
        }

        /* c8 ignore start */
        createDOM(): HTMLElement {
            return document.createElement('div');
        }

        updateDOM(): false {
            return false;
        }

        // Defines whether a node is a top-level block.
        isInline(): false {
            // All our cards are top-level blocks. Override if needed.
            return false;
        }
        /* c8 ignore stop */

        // Defines whether a node has dynamic data that needs to be fetched from the server when rendering
        hasDynamicData(): false {
            return false;
        }

        // Defines whether a node has an edit mode in the editor UI
        hasEditMode(): true {
            // Most of our cards have an edit mode. Override if needed.
            return true;
        }

        // Returns the text content of the node, used by the editor to calculate the word count
        // This method filters out properties without `wordCount: true`
        getTextContent(): string {
            const self = this.getLatest();
            const propertiesWithText = __properties.filter(prop => !!prop.wordCount);

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
    __properties.forEach((prop) => {
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