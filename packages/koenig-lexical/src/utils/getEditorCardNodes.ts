import type {LexicalEditor} from 'lexical';

export function getEditorCardNodes(editor: LexicalEditor): Array<[string, unknown]> {
    // TODO: open upstream PR to add public method of getting nodes
    const allNodes = (editor as unknown as {_nodes: Map<string, {klass: unknown}>})._nodes;
    const cardNodes: Array<[string, unknown]> = [];

    for (const [nodeType, {klass}] of allNodes) {
        if (!(klass as {kgMenu?: unknown}).kgMenu) {
            continue;
        }

        cardNodes.push([nodeType, klass]);
    }

    return cardNodes;
}
