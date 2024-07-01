import {LineBreakNode} from 'lexical';

// NOTE: We never create or serialize an extended line break node, we only use
// this class to add a higher priority importDOM conversion for line breaks to
// cover parsing cases that the default line break node does not handle.
export class ExtendedLineBreakNode extends LineBreakNode {
    /* c8 ignore start */
    constructor(key) {
        super(key);
    }

    static getType() {
        return 'extended-line-break';
    }

    static clone(node) {
        return new ExtendedLineBreakNode(node.__key);
    }

    static importJSON(serializedNode) {
        return LineBreakNode.importJSON(serializedNode);
    }

    exportJSON() {
        const json = super.exportJSON();
        json.type = 'extended-line-break';
        return json;
    }
    /* c8 ignore stop */

    static importDOM() {
        return {
            br: (node) => {
                const isGoogleDocs = !!node.closest('[id^="docs-internal-guid-"]');

                // render nothing for GDoc line breaks in-between paragraphs
                // otherwise we end up with empty paragraphs
                if (
                    isGoogleDocs &&
                    node.previousElementSibling?.nodeName === 'P' &&
                    node.nextElementSibling?.nodeName === 'P'
                ) {
                    return {
                        conversion: () => null,
                        priority: 1
                    };
                }

                // allow lower priority converter to handle (i.e. default LineBreakNode.importDOM)
                return null;
            }
        };
    }
}
