/* eslint-disable ghost/filenames/match-exported-class */
import {HeadingNode, SerializedHeadingNode} from '@lexical/rich-text';
import {DOMConversion, DOMConversionFn, DOMConversionMap} from 'lexical';

// Since the HeadingNode is foundational to Lexical rich-text, only using a
// custom HeadingNode is undesirable as it means every package would need to
// be updated to work with the custom node. Instead we can use Lexical's node
// override/replacement mechanism to extend the default with our custom parsing
// logic.
//
// https://lexical.dev/docs/concepts/serialization#handling-extended-html-styling

export const extendedHeadingNodeReplacement = {replace: HeadingNode, with: (node: HeadingNode) => new ExtendedHeadingNode(node.__tag)};

type HeadingTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export class ExtendedHeadingNode extends HeadingNode {
    constructor(tag: HeadingTagType, key?: string) {
        super(tag, key);
    }

    static getType(): string {
        return 'extended-heading';
    }

    static clone(node: ExtendedHeadingNode): ExtendedHeadingNode {
        return new ExtendedHeadingNode(node.__tag, node.__key);
    }

    static importDOM(): DOMConversionMap | null {
        const importers = HeadingNode.importDOM();
        const originalParagraphImporter = importers?.p as DOMConversionFn;
        return {
            ...importers,
            p: patchParagraphConversion(originalParagraphImporter)
        };
    }

    static importJSON(serializedNode: SerializedHeadingNode): ExtendedHeadingNode {
        return HeadingNode.importJSON(serializedNode);
    }

    exportJSON(): SerializedHeadingNode {
        const json = super.exportJSON();
        json.type = 'extended-heading';
        return json;
    }
}

function patchParagraphConversion(originalDOMConverter: DOMConversionFn): DOMConversion | null {
    return (node: HTMLElement) => {
        // Original matches Google Docs p node to a null conversion so it's
        // child span is parsed as a heading. Don't prevent that here
        const original = originalDOMConverter(node);
        if (original) {
            return original;
        }

        // Word uses paragraphs with role="heading" to represent headings
        // and an aria-level="x" to represent the heading level
        const hasAriaHeadingRole = p.getAttribute('role') === 'heading';
        const hasAriaLevel = p.getAttribute('aria-level');

        if (hasAriaHeadingRole && hasAriaLevel) {
            const level = parseInt(hasAriaLevel, 10);
            if (level > 0 && level < 7) {
                const tag: HeadingTagType = `h${level}` as HeadingTagType;
                return {
                    conversion: () => {
                        return {
                            node: new ExtendedHeadingNode(tag)
                        };
                    },
                    priority: 1
                };
            }
        }

        return null;
    };
}
