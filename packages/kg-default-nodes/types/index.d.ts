declare module "@tryghost/kg-default-nodes" {
    import {LexicalNode, DecoratorNode, LexicalEditor, ElementNode} from 'lexical';
    import * as KgDefaultNodes from '@tryghost/kg-default-nodes';

    export interface RendererOptions {
        usedIdAttributes?: Record<string, number>;
        dom?: import('jsdom').JSDOM,
        type?: 'inner' | 'outer' | 'value'
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type X = any;

    export class KoenigDecoratorNode extends DecoratorNode<X> {
        // TODO: exportDOM override isn't directly compatible with base class, should fix when converting kg-default-nodes
        exportDOM(options: LexicalEditor | RendererOptions): {
            element: HTMLElement | HTMLInputElement | HTMLTextAreaElement;
            type: 'inner' | 'outer' | 'value'
        };
        hasDynamicData?(): boolean;
        getDynamicData?(options: RendererOptions): Promise<{key: number; data: unknown}>;
    }
    export function $isKoenigCard(node: LexicalNode): node is KgDefaultNodes.KoenigDecoratorNode;

    export class AsideNode extends ElementNode {}
    export function $isAsideNode(node: LexicalNode): node is KgDefaultNodes.AsideNode;

    export type DecoratorNodeProperty = {
        /**
         * - The property's name.
         */
        name: string;
        /**
         * - The property's default value
         */
        default: any;
        /**
         * - If the property contains a URL, the URL's type: 'url', 'html' or 'markdown'. Use 'url' is the property contains only a URL, 'html' or 'markdown' if the property contains HTML or markdown code, that may contain URLs.
         */
        urlType: ('url' | 'html' | 'markdown' | null);
        /**
         * - Whether the property should be counted in the word count
         */
        wordCount: boolean;
    };
    export function $createAsideNode(): AsideNode;
    export function $createAudioNode(dataset: any): AudioNode;
    export function $createBookmarkNode(dataset: any): BookmarkNode;
    export function $createButtonNode(dataset: any): ButtonNode;
    export function $createCalloutNode(dataset: any): CalloutNode;
    export function $createCodeBlockNode(dataset: any): CodeBlockNode;
    export function $createCollectionNode(dataset: any): CollectionNode;
    export function $createEmailCtaNode(dataset: any): EmailCtaNode;
    export function $createEmailNode(dataset: any): EmailNode;
    export function $createEmbedNode(dataset: any): EmbedNode;
    export function $createFileNode(dataset: any): FileNode;
    export function $createGalleryNode(dataset: any): GalleryNode;
    export function $createHeaderNode(dataset: any): HeaderNode;
    export function $createHorizontalRuleNode(): HorizontalRuleNode;
    export function $createHtmlNode(dataset: any): HtmlNode;
    export function $createImageNode(dataset: any): ImageNode;
    export function $createMarkdownNode(dataset: any): MarkdownNode;
    export function $createPaywallNode(dataset: any): PaywallNode;
    export function $createProductNode(dataset: any): ProductNode;
    export function $createSignupNode(dataset: any): SignupNode;
    /**
     * Generates a TKNode, which is a string following the format of a # followed by some text, eg. #lexical.
     * @param text - The text used inside the TKNode.
     * @returns - The TKNode with the embedded text.
     */
    export function $createTKNode(text: any): lexical.LexicalNode;
    export function $createToggleNode(dataset: any): ToggleNode;
    export function $createVideoNode(dataset: any): VideoNode;
    export function $isAudioNode(node: any): boolean;
    export function $isBookmarkNode(node: any): boolean;
    export function $isButtonNode(node: any): boolean;
    export function $isCalloutNode(node: any): boolean;
    export function $isCodeBlockNode(node: any): boolean;
    export function $isCollectionNode(node: any): boolean;
    export function $isEmailCtaNode(node: any): boolean;
    export function $isEmailNode(node: any): boolean;
    export function $isEmbedNode(node: any): boolean;
    export function $isFileNode(node: any): boolean;
    export function $isGalleryNode(node: any): boolean;
    export function $isHeaderNode(node: any): boolean;
    export function $isHorizontalRuleNode(node: any): boolean;
    export function $isHtmlNode(node: any): boolean;
    export function $isImageNode(node: any): boolean;
    export function $isKoenigCard(node: any): boolean;
    export function $isMarkdownNode(node: any): boolean;
    export function $isPaywallNode(node: any): boolean;
    export function $isProductNode(node: any): boolean;
    export function $isSignupNode(node: any): boolean;
    /**
     * Determines if node is a TKNode.
     * @param node - The node to be checked.
     * @returns true if node is a TKNode, false otherwise.
     */
    export function $isTKNode(node: any): boolean;
    export function $isToggleNode(node: any): boolean;
    export function $isVideoNode(node: any): boolean;
    const AudioNode_base: any;
    export class AudioNode extends AudioNode_base {
        [x: string]: any;
        static importDOM(): {
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
        };
    }
    const BookmarkNode_base: any;
    export class BookmarkNode extends BookmarkNode_base {
        [x: string]: any;
        static importDOM(): {
            figure: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        static importJSON(serializedNode: any): BookmarkNode;
        constructor({ url, metadata, caption }: {
            url: any;
            metadata: any;
            caption: any;
        }, key: any);
        exportDOM(options?: {}): {
            element: any;
        };
        __url: any;
        __icon: any;
        __title: any;
        __description: any;
        __author: any;
        __publisher: any;
        __thumbnail: any;
        __caption: any;
        getDataset(): {
            url: any;
            metadata: {
                icon: any;
                title: any;
                description: any;
                author: any;
                publisher: any;
                thumbnail: any;
            };
            caption: any;
        };
        exportJSON(): {
            type: string;
            version: number;
            url: any;
            metadata: {
                icon: any;
                title: any;
                description: any;
                author: any;
                publisher: any;
                thumbnail: any;
            };
            caption: any;
        };
        isEmpty(): boolean;
    }
    const ButtonNode_base: any;
    export class ButtonNode extends ButtonNode_base {
        [x: string]: any;
        static importDOM(): {
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
        };
    }
    const CalloutNode_base: any;
    export class CalloutNode extends CalloutNode_base {
        [x: string]: any;
        static importDOM(): {
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        constructor({ calloutText, calloutEmoji, backgroundColor }: {
            calloutText: any;
            calloutEmoji: any;
            backgroundColor: any;
        }, key: any);
        __calloutText: any;
        __calloutEmoji: any;
        __backgroundColor: any;
        exportDOM(options?: {}): {
            element: any;
        };
    }
    const CodeBlockNode_base: any;
    export class CodeBlockNode extends CodeBlockNode_base {
        [x: string]: any;
        static importDOM(): {
            figure: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
            pre: () => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
            type: string;
        } | {
            element: any;
        };
        isEmpty(): boolean;
    }
    const CollectionNode_base: any;
    export class CollectionNode extends CollectionNode_base {
        [x: string]: any;
        static importDOM(): {
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
            type: string;
        } | {
            element: any;
        };
        hasDynamicData(): boolean;
        getDynamicData(options?: {}): Promise<{
            key: any;
            data: any;
        }>;
    }
    export const DEFAULT_NODES: (typeof CalloutNode | typeof AsideNode | typeof BookmarkNode | typeof EmailCtaNode | typeof SignupNode | {
        replace: typeof lexical.TextNode;
        with: (node: any) => ExtendedTextNode;
    } | typeof ExtendedTextNode | {
        replace: typeof richText.HeadingNode;
        with: (node: any) => ExtendedHeadingNode;
    } | typeof ExtendedHeadingNode | {
        replace: typeof richText.QuoteNode;
        with: () => ExtendedQuoteNode;
    } | typeof ExtendedQuoteNode | typeof TKNode)[];
    const EmailCtaNode_base: any;
    export class EmailCtaNode extends EmailCtaNode_base {
        [x: string]: any;
        exportDOM(options?: {}): {
            element: any;
            type: string;
        } | {
            element: any;
        };
    }
    const EmailNode_base: any;
    export class EmailNode extends EmailNode_base {
        [x: string]: any;
        exportDOM(options?: {}): {
            element: any;
            type: string;
        };
    }
    const EmbedNode_base: any;
    export class EmbedNode extends EmbedNode_base {
        [x: string]: any;
        static importDOM(): {
            figure: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
            iframe: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
        };
        isEmpty(): boolean;
    }
    export class ExtendedHeadingNode extends richText.HeadingNode {
        static clone(node: any): ExtendedHeadingNode;
        static importDOM(): {
            p: (node: any) => any;
        };
        static importJSON(serializedNode: any): richText.HeadingNode;
        constructor(tag: any, key: any);
    }
    export class ExtendedQuoteNode extends richText.QuoteNode {
        static clone(node: any): ExtendedQuoteNode;
        static importDOM(): {
            blockquote: typeof convertBlockquoteElement;
        };
        static importJSON(serializedNode: any): richText.QuoteNode;
        constructor(key: any);
        extractWithChild(): boolean;
    }
    export class ExtendedTextNode extends lexical.TextNode {
        static clone(node: any): ExtendedTextNode;
        static importDOM(): {
            span: () => {
                conversion: (node: any) => any;
                priority: 0 | 1 | 2 | 3 | 4;
            };
        };
        static importJSON(serializedNode: any): lexical.TextNode;
        constructor(text: any, key: any);
    }
    const FileNode_base: any;
    export class FileNode extends FileNode_base {
        [x: string]: any;
        static importDOM(): {
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportJSON(): {
            type: string;
            src: any;
            fileTitle: any;
            fileCaption: any;
            fileName: any;
            fileSize: any;
        };
        exportDOM(options?: {}): {
            element: any;
        };
        get formattedFileSize(): string;
    }
    const GalleryNode_base: any;
    export class GalleryNode extends GalleryNode_base {
        [x: string]: any;
        static get urlTransformMap(): {
            caption: string;
            images: {
                src: string;
                caption: string;
            };
        };
        static importDOM(): {
            figure: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
            type: string;
        } | {
            element: any;
        };
        hasEditMode(): boolean;
    }
    const HeaderNode_base: any;
    export class HeaderNode extends HeaderNode_base {
        [x: string]: any;
        static importDOM(): {
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
        };
    }
    const HorizontalRuleNode_base: any;
    export class HorizontalRuleNode extends HorizontalRuleNode_base {
        [x: string]: any;
        static importDOM(): {
            hr: () => {
                conversion(): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
        };
        getTextContent(): string;
        hasEditMode(): boolean;
    }
    const HtmlNode_base: any;
    export class HtmlNode extends HtmlNode_base {
        [x: string]: any;
        static importDOM(): {
            '#comment': (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
            table: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
            type: string;
        };
        isEmpty(): boolean;
    }
    const ImageNode_base: any;
    export class ImageNode extends ImageNode_base {
        [x: string]: any;
        static importDOM(): {
            img: () => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
            figure: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportJSON(): {
            type: string;
            version: number;
            src: any;
            width: any;
            height: any;
            title: any;
            alt: any;
            caption: any;
            cardWidth: any;
            href: any;
        };
        exportDOM(options?: {}): {
            element: any;
            type: string;
        } | {
            element: any;
        };
        hasEditMode(): boolean;
    }
    const MarkdownNode_base: any;
    export class MarkdownNode extends MarkdownNode_base {
        [x: string]: any;
        exportDOM(options?: {}): {
            element: any;
            type: string;
        };
        isEmpty(): boolean;
    }
    const PaywallNode_base: any;
    export class PaywallNode extends PaywallNode_base {
        [x: string]: any;
        static importDOM(): {
            '#comment': (nodeElem: any) => {
                conversion(): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
            type: string;
        };
    }
    const ProductNode_base: any;
    export class ProductNode extends ProductNode_base {
        [x: string]: any;
        static importDOM(): {
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportJSON(): {
            type: string;
            version: number;
            productImageSrc: any;
            productImageWidth: any;
            productImageHeight: any;
            productTitle: any;
            productDescription: any;
            productRatingEnabled: any;
            productStarRating: any;
            productButtonEnabled: any;
            productButton: any;
            productUrl: any;
        };
        exportDOM(options?: {}): {
            element: any;
            type: string;
        } | {
            element: any;
        };
        isEmpty(): boolean;
    }
    const SignupNode_base: any;
    export class SignupNode extends SignupNode_base {
        [x: string]: any;
        static importDOM(): {
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        constructor({ alignment, backgroundColor, backgroundImageSrc, backgroundSize, textColor, buttonColor, buttonTextColor, buttonText, disclaimer, header, labels, layout, subheader, successMessage, swapped }: {
            alignment: any;
            backgroundColor: any;
            backgroundImageSrc: any;
            backgroundSize: any;
            textColor: any;
            buttonColor: any;
            buttonTextColor: any;
            buttonText: any;
            disclaimer: any;
            header: any;
            labels: any;
            layout: any;
            subheader: any;
            successMessage: any;
            swapped: any;
        }, key: any);
        __alignment: any;
        __backgroundColor: any;
        __backgroundImageSrc: any;
        __backgroundSize: any;
        __textColor: any;
        __buttonColor: any;
        __buttonTextColor: any;
        __buttonText: any;
        __disclaimer: any;
        __header: any;
        __labels: any;
        __layout: any;
        __subheader: any;
        __successMessage: any;
        __swapped: any;
        exportDOM(options?: {}): {
            element: any;
        };
        setLabels(labels: any): void;
        addLabel(label: any): void;
        removeLabel(label: any): void;
    }
    export class TKNode extends lexical.TextNode {
        static clone(node: any): TKNode;
        static importJSON(serializedNode: any): lexical.TextNode;
        constructor(text: any, key: any);
        createDOM(config: any): HTMLElement;
        exportJSON(): {
            type: string;
            version: number;
            detail: number;
            format: number;
            mode: lexical.TextModeType;
            style: string;
            text: string;
        };
    }
    const ToggleNode_base: any;
    export class ToggleNode extends ToggleNode_base {
        [x: string]: any;
        static importDOM(): {
            div: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportDOM(options?: {}): {
            element: any;
        };
    }
    const VideoNode_base: any;
    export class VideoNode extends VideoNode_base {
        [x: string]: any;
        static importDOM(): {
            figure: (nodeElem: any) => {
                conversion(domNode: any): {
                    node: any;
                };
                priority: number;
            };
        };
        exportJSON(): {
            type: string;
            version: number;
            src: any;
            caption: any;
            fileName: any;
            mimeType: any;
            width: any;
            height: any;
            duration: any;
            thumbnailSrc: any;
            customThumbnailSrc: any;
            thumbnailWidth: any;
            thumbnailHeight: any;
            cardWidth: any;
            loop: any;
        };
        exportDOM(options?: {}): {
            element: any;
            type: string;
        } | {
            element: any;
        };
        get formattedDuration(): string;
    }
    export namespace extendedHeadingNodeReplacement {
        export let replace: typeof richText.HeadingNode;
        export function _with(node: any): ExtendedHeadingNode;
        export { _with as with };
    }
    export namespace extendedQuoteNodeReplacement {
        let replace_1: typeof richText.QuoteNode;
        export { replace_1 as replace };
        export function _with_1(): ExtendedQuoteNode;
        export { _with_1 as with };
    }
    export namespace extendedTextNodeReplacement {
        let replace_2: typeof lexical.TextNode;
        export { replace_2 as replace };
        export function _with_2(node: any): ExtendedTextNode;
        export { _with_2 as with };
    }
    import lexical = require("lexical");
    import richText = require("@lexical/rich-text");
    function convertBlockquoteElement(): {
        conversion: () => {
            node: ExtendedQuoteNode;
            after: (childNodes: any) => any[];
        };
        priority: 0 | 1 | 2 | 3 | 4;
    };
    export {};
}
