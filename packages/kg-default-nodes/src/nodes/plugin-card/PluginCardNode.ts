import {generateDecoratorNode, type DecoratorNodeData, type DecoratorNodeProperty, type DecoratorNodeValueMap} from '../../generate-decorator-node.js';
import {renderPluginCardNode} from './plugin-card-renderer.js';
import {parsePluginCardNode} from './plugin-card-parser.js';

const pluginCardProperties = [
    {name: 'html', default: '', urlType: 'html', wordCount: true},
    {name: 'pluginName', default: ''},
    {name: 'cardName', default: ''},
    {name: 'payload', default: '{}'},
    {name: 'css', default: ''},
    {name: 'template', default: ''},
    {name: 'preprocess', default: ''}
] as const satisfies readonly DecoratorNodeProperty[];

export type PluginCardData = DecoratorNodeData<typeof pluginCardProperties, true>;

export interface PluginCardNode extends DecoratorNodeValueMap<typeof pluginCardProperties, true> {}

export class PluginCardNode extends generateDecoratorNode({
    nodeType: 'plugin-card',
    properties: pluginCardProperties,
    defaultRenderFn: renderPluginCardNode
}) {
    static importDOM() {
        return parsePluginCardNode(this);
    }

    static importJSON(serializedNode: Record<string, unknown>) {
        // Parse payload: handles objects, JSON strings, and double-encoded strings
        let payload = serializedNode.payload;
        if (typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            } catch {
                // Not valid JSON, keep as-is
            }
            // If still a string, it might be double-encoded — try one more parse
            if (typeof payload === 'string') {
                try {
                    payload = JSON.parse(payload);
                } catch {
                    // Keep the string value
                }
            }
        }
        serializedNode = {...serializedNode, payload};

        const data: Record<string, unknown> = {};
        const propNames = ['html', 'pluginName', 'cardName', 'payload', 'css', 'template', 'preprocess'];
        const defaults: Record<string, unknown> = {html: '', pluginName: '', cardName: '', payload: '{}', css: '', template: '', preprocess: ''};
        propNames.forEach((name) => {
            data[name] = serializedNode[name] ?? defaults[name];
        });
        // Use `new this(data)` so the editor subclass (which has decorate())
        // is instantiated, not the bare base class from kg-default-nodes
        return new (this as any)(data);
    }

    isEmpty() {
        return false;
    }
}

export function $createPluginCardNode(dataset: PluginCardData = {}) {
    return new PluginCardNode(dataset);
}

export function $isPluginCardNode(node: unknown): node is PluginCardNode {
    return node instanceof PluginCardNode;
}
