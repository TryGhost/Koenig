import type {Doc} from "yjs";

declare module "components/DesignSandbox" {
    export default DesignSandbox;
    function DesignSandbox(): import("react/jsx-runtime").JSX.Element;
}
declare module "context/CardContext" {
    export default CardContext;
    const CardContext: React.Context<{}>;
    import React from "react";
}
declare module "components/ui/CardWrapper" {
    export const CardWrapper: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
    import React from "react";
}
declare module "nodes/AsideNode" {
    export function $createAsideNode(): AsideNode;
    export function $isAsideNode(node: any): boolean;
    export class AsideNode extends BaseAsideNode {
        createDOM(config: any): HTMLElement;
        insertNewAfter(): import("lexical").ParagraphNode;
        collapseAtStart(): boolean;
    }
    import { AsideNode as BaseAsideNode } from "@tryghost/kg-default-nodes";
}
declare module "context/KoenigComposerContext" {
    export default KoenigComposerContext;
    const KoenigComposerContext: React.Context<{}>;
    import React from "react";
}
declare module "context/KoenigSelectedCardContext" {
    export function KoenigSelectedCardContext({ children }: {
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function useKoenigSelectedCardContext(): {};
}
declare module "components/ui/ActionToolbar" {
    export function ActionToolbar({ isVisible, children, ...props }: {
        [x: string]: any;
        isVisible: any;
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/Portal" {
    export default Portal;
    function Portal({ children, to, className }: {
        children: any;
        to: any;
        className: any;
    }): any;
}
declare module "utils/analytics" {
    export default function trackEvent(eventName: any, props?: {}): void;
}
declare module "hooks/useTypeaheadTriggerMatch" {
    export default function useBasicTypeaheadTriggerMatch(trigger: any, { minLength, maxLength }: {
        minLength?: number;
        maxLength?: number;
    }): (text: any) => {
        leadOffset: number;
        matchingString: string;
        replaceableString: string;
    };
}
declare module "plugins/EmojiPickerPlugin" {
    export function EmojiPickerPlugin(): import("react/jsx-runtime").JSX.Element;
    export default EmojiPickerPlugin;
}
declare module "components/KoenigCaptionEditor" {
    export default KoenigCaptionEditor;
    function KoenigCaptionEditor({ paragraphs, captionEditor, captionEditorInitialState, placeholderText, className }: {
        paragraphs?: number;
        captionEditor: any;
        captionEditorInitialState: any;
        placeholderText: any;
        className?: string;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/TextInput" {
    export function TextInput({ value, onChange, ...args }: {
        [x: string]: any;
        value: any;
        onChange: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/isEditorEmpty" {
    export function isEditorEmpty(editor: any): any;
}
declare module "components/ui/CardCaptionEditor" {
    export function CardCaptionEditor({ altText, altTextPlaceholder, setAltText, captionEditor, captionEditorInitialState, captionPlaceholder, isSelected, readOnly, dataTestId }: {
        altText: any;
        altTextPlaceholder: any;
        setAltText: any;
        captionEditor: any;
        captionEditorInitialState: any;
        captionPlaceholder: any;
        isSelected: any;
        readOnly: any;
        dataTestId: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/CodeBlockCard" {
    export function CodeEditor({ code, language, updateCode, updateLanguage }: {
        code: any;
        language: any;
        updateCode: any;
        updateLanguage: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace CodeEditor {
        namespace propTypes {
            let code: PropTypes.Requireable<string>;
            let language: PropTypes.Requireable<string>;
            let updateCode: PropTypes.Requireable<(...args: any[]) => any>;
            let updateLanguage: PropTypes.Requireable<(...args: any[]) => any>;
        }
    }
    export function CodeBlock({ code, darkMode, language }: {
        code: any;
        darkMode: any;
        language: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace CodeBlock {
        export namespace propTypes_1 {
            let code_1: PropTypes.Requireable<string>;
            export { code_1 as code };
            export let darkMode: PropTypes.Requireable<boolean>;
            let language_1: PropTypes.Requireable<string>;
            export { language_1 as language };
        }
        export { propTypes_1 as propTypes };
    }
    export function CodeBlockCard({ captionEditor, captionEditorInitialState, code, darkMode, isEditing, isSelected, language, updateCode, updateLanguage }: {
        captionEditor: any;
        captionEditorInitialState: any;
        code: any;
        darkMode: any;
        isEditing: any;
        isSelected: any;
        language: any;
        updateCode: any;
        updateLanguage: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace CodeBlockCard {
        export namespace propTypes_2 {
            let code_2: PropTypes.Requireable<string>;
            export { code_2 as code };
            let darkMode_1: PropTypes.Requireable<boolean>;
            export { darkMode_1 as darkMode };
            let language_2: PropTypes.Requireable<string>;
            export { language_2 as language };
            export let captionEditor: PropTypes.Requireable<object>;
            export let captionEditorInitialState: PropTypes.Requireable<object>;
            export let isEditing: PropTypes.Requireable<boolean>;
            export let isSelected: PropTypes.Requireable<boolean>;
            let updateCode_1: PropTypes.Requireable<(...args: any[]) => any>;
            export { updateCode_1 as updateCode };
            let updateLanguage_1: PropTypes.Requireable<(...args: any[]) => any>;
            export { updateLanguage_1 as updateLanguage };
        }
        export { propTypes_2 as propTypes };
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/SnippetInput/Dropdown" {
    export function Dropdown({ snippets, onCreateSnippet, onUpdateSnippet, value, isCreateButtonActive, onKeyDown, activeMenuItem }: {
        snippets: any;
        onCreateSnippet: any;
        onUpdateSnippet: any;
        value: any;
        isCreateButtonActive: any;
        onKeyDown: any;
        activeMenuItem: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/SnippetInput/Input" {
    export function Input({ value, onChange, onClear, onKeyDown, arrowStyles }: {
        value: any;
        onChange: any;
        onClear: any;
        onKeyDown: any;
        arrowStyles: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/SnippetInput" {
    export function SnippetInput({ value, onChange, onCreateSnippet, onUpdateSnippet, onClose, snippets, arrowStyles }: {
        value: any;
        onChange: any;
        onCreateSnippet: any;
        onUpdateSnippet: any;
        onClose: any;
        snippets?: any[];
        arrowStyles: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace SnippetInput {
        namespace propTypes {
            let value: PropTypes.Requireable<string>;
            let onChange: PropTypes.Requireable<(...args: any[]) => any>;
            let onCreateSnippet: PropTypes.Requireable<(...args: any[]) => any>;
            let onReplaceSnippet: PropTypes.Requireable<(...args: any[]) => any>;
            let onClose: PropTypes.Requireable<(...args: any[]) => any>;
            let suggestedList: PropTypes.Requireable<PropTypes.InferProps<{
                name: PropTypes.Validator<string>;
                value: PropTypes.Validator<string>;
            }>[]>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/SnippetActionToolbar" {
    export function SnippetActionToolbar({ onClose, ...props }: {
        [x: string]: any;
        onClose: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/ToolbarMenu" {
    export function ToolbarMenu({ children, hide, arrowStyles, ...props }: {
        [x: string]: any;
        children: any;
        hide: any;
        arrowStyles: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function ToolbarMenuItem({ label, isActive, onClick, icon, dataTestId, hide, ...props }: {
        [x: string]: any;
        label: any;
        isActive: any;
        onClick: any;
        icon: any;
        dataTestId: any;
        hide: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function ToolbarMenuSeparator({ hide }: {
        hide: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace TOOLBAR_ICONS {
        export { BoldIcon as bold };
        export { ItalicIcon as italic };
        export { HeadingOneIcon as headingOne };
        export { HeadingTwoIcon as headingTwo };
        export { QuoteIcon as quote };
        export { QuoteOneIcon as quoteOne };
        export { QuoteTwoIcon as quoteTwo };
        export { LinkIcon as link };
        export { ImgRegularIcon as imgRegular };
        export { ImgWideIcon as imgWide };
        export { ImgFullIcon as imgFull };
        export { ImgReplaceIcon as imgReplace };
        export { AddIcon as add };
        export { EditIcon as edit };
        export { SnippetIcon as snippet };
        export { TrashIcon as remove };
    }
}
declare module "nodes/CodeBlockNodeComponent" {
    export function CodeBlockNodeComponent({ nodeKey, captionEditor, captionEditorInitialState, code, language }: {
        nodeKey: any;
        captionEditor: any;
        captionEditorInitialState: any;
        code: any;
        language: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/generateEditorState" {
    export default function generateEditorState({ editor, initialHtml }: {
        editor: any;
        initialHtml: any;
    }): any;
}
declare module "utils/nested-editors" {
    export function setupNestedEditor(node: any, editorProperty: any, { editor, initialEditorState, nodes }?: {
        editor: any;
        initialEditorState?: string;
        nodes?: (typeof import("@lexical/link").LinkNode | typeof import("@tryghost/kg-default-nodes").TKNode)[];
    }): void;
    export function populateNestedEditor(node: any, editorProperty: any, html: any): void;
}
declare module "nodes/CodeBlockNode" {
    export function $createCodeBlockNode(dataset: any): CodeBlockNode;
    export function $isCodeBlockNode(node: any): boolean;
    export const INSERT_CODE_BLOCK_COMMAND: import("lexical").LexicalCommand<any>;
    export class CodeBlockNode extends BaseCodeBlockNode {
        constructor(dataset: {}, key: any);
        __openInEditMode: boolean;
        __captionEditor: any;
        __captionEditorInitialState: any;
        getIcon(): any;
        clearOpenInEditMode(): void;
        getDataset(): any;
        exportJSON(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    import { CodeBlockNode as BaseCodeBlockNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/UrlInput" {
    export function UrlInput({ dataTestId, value, placeholder, handleUrlChange, handleUrlSubmit, hasError, handlePasteAsLink, handleRetry, handleClose, isLoading }: {
        dataTestId: any;
        value: any;
        placeholder: any;
        handleUrlChange: any;
        handleUrlSubmit: any;
        hasError: any;
        handlePasteAsLink: any;
        handleRetry: any;
        handleClose: any;
        isLoading: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/BookmarkCard" {
    export function BookmarkCard({ author, handleClose, handlePasteAsLink, handleRetry, handleUrlChange, handleUrlSubmit, url, urlInputValue, urlPlaceholder, thumbnail, title, description, icon, publisher, captionEditor, captionEditorInitialState, isSelected, isLoading, urlError }: {
        author: any;
        handleClose: any;
        handlePasteAsLink: any;
        handleRetry: any;
        handleUrlChange: any;
        handleUrlSubmit: any;
        url: any;
        urlInputValue: any;
        urlPlaceholder: any;
        thumbnail: any;
        title: any;
        description: any;
        icon: any;
        publisher: any;
        captionEditor: any;
        captionEditorInitialState: any;
        isSelected: any;
        isLoading: any;
        urlError: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace BookmarkCard {
        namespace propTypes {
            let author: PropTypes.Requireable<string>;
            let handleClose: PropTypes.Requireable<(...args: any[]) => any>;
            let handlePasteAsLink: PropTypes.Requireable<(...args: any[]) => any>;
            let handleRetry: PropTypes.Requireable<(...args: any[]) => any>;
            let handleUrlChange: PropTypes.Requireable<(...args: any[]) => any>;
            let handleUrlSubmit: PropTypes.Requireable<(...args: any[]) => any>;
            let url: PropTypes.Requireable<string>;
            let urlInputValue: PropTypes.Requireable<string>;
            let urlPlaceholder: PropTypes.Requireable<string>;
            let thumbnail: PropTypes.Requireable<string>;
            let title: PropTypes.Requireable<string>;
            let description: PropTypes.Requireable<string>;
            let icon: PropTypes.Requireable<string>;
            let publisher: PropTypes.Requireable<string>;
            let captionEditor: PropTypes.Requireable<object>;
            let captionEditorInitialState: PropTypes.Requireable<object>;
            let isSelected: PropTypes.Requireable<boolean>;
            let isLoading: PropTypes.Requireable<boolean>;
            let urlError: PropTypes.Requireable<boolean>;
        }
    }
    export function BookmarkIcon({ src }: {
        src: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace BookmarkIcon {
        export namespace propTypes_1 {
            let src: PropTypes.Requireable<string>;
        }
        export { propTypes_1 as propTypes };
    }
    import PropTypes from "prop-types";
}
declare module "nodes/BookmarkNodeComponent" {
    export function BookmarkNodeComponent({ author, nodeKey, url, icon, title, description, publisher, thumbnail, captionEditor, captionEditorInitialState, createdWithUrl }: {
        author: any;
        nodeKey: any;
        url: any;
        icon: any;
        title: any;
        description: any;
        publisher: any;
        thumbnail: any;
        captionEditor: any;
        captionEditorInitialState: any;
        createdWithUrl: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/BookmarkNode" {
    export function $isBookmarkNode(node: any): boolean;
    export const INSERT_BOOKMARK_COMMAND: import("lexical").LexicalCommand<any>;
    export class BookmarkNode extends BaseBookmarkNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            queryParams: string[];
            priority: number;
            shortcut: string;
        }[];
        constructor(dataset: {}, key: any);
        __captionEditor: any;
        __captionEditorInitialState: any;
        __createdWithUrl: boolean;
        getIcon(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    export function $createBookmarkNode(dataset: any): BookmarkNode;
    import { BookmarkNode as BaseBookmarkNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/cards/EmbedCard" {
    export function EmbedCard({ captionEditor, captionEditorInitialState, html, isSelected, urlInputValue, urlPlaceholder, urlError, isLoading, handleUrlChange, handleUrlSubmit, handleRetry, handlePasteAsLink, handleClose }: {
        captionEditor: any;
        captionEditorInitialState: any;
        html: any;
        isSelected: any;
        urlInputValue: any;
        urlPlaceholder: any;
        urlError: any;
        isLoading: any;
        handleUrlChange: any;
        handleUrlSubmit: any;
        handleRetry: any;
        handlePasteAsLink: any;
        handleClose: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace EmbedCard {
        namespace propTypes {
            let html: PropTypes.Requireable<string>;
            let isSelected: PropTypes.Requireable<boolean>;
            let urlInputValue: PropTypes.Requireable<string>;
            let urlPlaceholder: PropTypes.Requireable<string>;
            let urlError: PropTypes.Requireable<boolean>;
            let isLoading: PropTypes.Requireable<boolean>;
            let handleUrlChange: PropTypes.Requireable<(...args: any[]) => any>;
            let handleUrlSubmit: PropTypes.Requireable<(...args: any[]) => any>;
            let handleRetry: PropTypes.Requireable<(...args: any[]) => any>;
            let handlePasteAsLink: PropTypes.Requireable<(...args: any[]) => any>;
            let handleClose: PropTypes.Requireable<(...args: any[]) => any>;
            let captionEditor: PropTypes.Requireable<object>;
            let captionEditorInitialState: PropTypes.Requireable<object>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/EmbedNodeComponent" {
    export function EmbedNodeComponent({ nodeKey, url, html, createdWithUrl, embedType, metadata, captionEditor, captionEditorInitialState }: {
        nodeKey: any;
        url: any;
        html: any;
        createdWithUrl: any;
        embedType: any;
        metadata: any;
        captionEditor: any;
        captionEditorInitialState: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/EmbedNode" {
    export function $isEmbedNode(node: any): boolean;
    export const INSERT_EMBED_COMMAND: import("lexical").LexicalCommand<any>;
    export class EmbedNode extends BaseEmbedNode {
        static kgMenu: {
            section: string;
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            queryParams: string[];
            priority: number;
            shortcut: string;
        }[];
        constructor(dataset: {}, key: any);
        __captionEditor: any;
        __captionEditorInitialState: any;
        __createdWithUrl: boolean;
        getIcon(): any;
        getDataset(): any;
        exportJSON(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    export function $createEmbedNode(dataset: any): EmbedNode;
    import { EmbedNode as BaseEmbedNode } from "@tryghost/kg-default-nodes";
}
declare module "utils/$insertAndSelectNode" {
    export function $insertAndSelectNode({ selectedNode, newNode }: {
        selectedNode: any;
        newNode: any;
    }): void;
}
declare module "utils/$isAtStartOfDocument" {
    export function $isAtStartOfDocument(selection: any): boolean;
}
declare module "utils/$selectDecoratorNode" {
    export function $selectDecoratorNode(node: any): void;
}
declare module "utils/getTopLevelNativeElement" {
    export function getTopLevelNativeElement(node: any): any;
}
declare module "utils/$isAtTopOfNode" {
    /**
     *
     * @param {Selection} nativeSelection – Window selection (window.getSelection())
     * @param {number} [threshold=10] – Estimated height of one line, in pixels
     * @returns {boolean}
     */
    export function $isAtTopOfNode(nativeSelection: Selection, threshold?: number): boolean;
}
declare module "utils/index" {
    export * from "utils/$isAtStartOfDocument";
    export * from "utils/$selectDecoratorNode";
    export * from "utils/$isAtTopOfNode";
    export * from "utils/getTopLevelNativeElement";
}
declare module "utils/sanitize-html" {
    export function sanitizeHtml(html?: string, options?: {}): any;
}
declare module "plugins/MarkdownPastePlugin" {
    export const PASTE_MARKDOWN_COMMAND: import("lexical").LexicalCommand<any>;
    export const MIME_TEXT_PLAIN: "text/plain";
    export const MIME_TEXT_HTML: "text/html";
    export function MarkdownPastePlugin(): any;
    export default MarkdownPastePlugin;
}
declare module "utils/shouldIgnoreEvent" {
    export function shouldIgnoreEvent(event: any): any;
}
declare module "plugins/KoenigBehaviourPlugin" {
    export default function KoenigBehaviourPlugin({ containerElem, cursorDidExitAtTop, isNested }: {
        containerElem?: Element;
        cursorDidExitAtTop: any;
        isNested: any;
    }): any;
    export const INSERT_CARD_COMMAND: import("lexical").LexicalCommand<any>;
    export const SELECT_CARD_COMMAND: import("lexical").LexicalCommand<any>;
    export const DESELECT_CARD_COMMAND: import("lexical").LexicalCommand<any>;
    export const EDIT_CARD_COMMAND: import("lexical").LexicalCommand<any>;
    export const DELETE_CARD_COMMAND: import("lexical").LexicalCommand<any>;
    export const PASTE_LINK_COMMAND: import("lexical").LexicalCommand<any>;
}
declare module "components/KoenigCardWrapper" {
    export default KoenigCardWrapper;
    function KoenigCardWrapper({ nodeKey, width, wrapperStyle, IndicatorIcon, children }: {
        nodeKey: any;
        width: any;
        wrapperStyle: any;
        IndicatorIcon: any;
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/getEditorCardNodes" {
    export function getEditorCardNodes(editor: any): any[][];
}
declare module "plugins/DragDropPastePlugin" {
    import {ReactNode} from "react";
    export const INSERT_MEDIA_COMMAND: import("lexical").LexicalCommand<any>;
    export default DragDropPastePlugin;
    function DragDropPastePlugin(): ReactNode;
}
declare module "hooks/useCardDragAndDrop" {
    export default function useCardDragAndDrop({ enabled, canDrop, onDrop, onDropEnd, getDraggableInfo, getIndicatorPosition, draggableSelector, droppableSelector }: {
        enabled?: boolean;
        canDrop: any;
        onDrop: any;
        onDropEnd: any;
        getDraggableInfo: any;
        getIndicatorPosition: any;
        draggableSelector: any;
        droppableSelector: any;
    }): {
        setRef: React.Dispatch<any>;
        isDraggedOver: boolean;
    };
    import React from "react";
}
declare module "hooks/useFileDragAndDrop" {
    export default function useFileDragAndDrop({ handleDrop, disabled }: {
        handleDrop: any;
        disabled?: boolean;
    }): {
        setRef: import("react").Dispatch<any>;
        isDraggedOver: boolean;
    };
}
declare module "hooks/usePinturaEditor" {
    export default function usePinturaEditor({ config, disabled }: {
        config: any;
        disabled?: boolean;
    }): {
        isEnabled: boolean;
        openEditor: ({ image, handleSave }: {
            image: any;
            handleSave: any;
        }) => void;
    };
}
declare module "utils/getImageFilenameFromSrc" {
    export function getImageFilenameFromSrc(src: any): string;
}
declare module "hooks/useGalleryReorder" {
    export default function useGalleryReorder({ images, updateImages, isSelected, maxImages, disabled }: {
        images: any;
        updateImages: any;
        isSelected?: boolean;
        maxImages?: number;
        disabled?: boolean;
    }): {
        setContainerRef: React.Dispatch<any>;
        isDraggedOver: boolean;
    };
    import React from "react";
}
declare module "components/ui/IconButton" {
    export function IconButton({ className, onClick, label, dataTestId, Icon }: {
        className: any;
        onClick: any;
        label: any;
        dataTestId: any;
        Icon: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/MediaPlaceholder" {
    export function MediaPlaceholder({ desc, icon, filePicker, size, borderStyle, isDraggedOver, errors, placeholderRef, dataTestId, errorDataTestId, multiple, ...props }: {
        [x: string]: any;
        desc: any;
        icon: any;
        filePicker: any;
        size: any;
        borderStyle: any;
        isDraggedOver: any;
        errors?: any[];
        placeholderRef: any;
        dataTestId?: string;
        errorDataTestId?: string;
        multiple?: boolean;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace MediaPlaceholder {
        namespace propTypes {
            let icon: PropTypes.Requireable<string>;
            let desc: PropTypes.Requireable<string>;
            let size: PropTypes.Requireable<string>;
            let borderStyle: PropTypes.Requireable<string>;
        }
        namespace defaultProps {
            let borderStyle_1: string;
            export { borderStyle_1 as borderStyle };
        }
    }
    export namespace PLACEHOLDER_ICONS {
        export { ImgPlaceholderIcon as image };
        export { GalleryPlaceholderIcon as gallery };
        export { VideoPlaceholderIcon as video };
        export { AudioPlaceholderIcon as audio };
        export { FilePlaceholderIcon as file };
        export { ProductPlaceholderIcon as product };
    }
    export function CardText({ text }: {
        text: any;
    }): import("react/jsx-runtime").JSX.Element;
    import PropTypes from "prop-types";
}
declare module "components/ui/ProgressBar" {
    export function ProgressBar({ style, fullWidth, bgStyle }: {
        style: any;
        fullWidth: any;
        bgStyle: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace ProgressBar {
        namespace propTypes {
            let style: PropTypes.Requireable<object>;
            let fullWidth: PropTypes.Requireable<boolean>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/cards/GalleryCard" {
    export function GalleryCard({ captionEditor, captionEditorInitialState, clearErrorMessage, deleteImage, filesDropper, errorMessage, fileInputRef, imageMimeTypes, images, isSelected, onFileChange, uploader, reorderHandler }: {
        captionEditor: any;
        captionEditorInitialState: any;
        clearErrorMessage: any;
        deleteImage: any;
        filesDropper: any;
        errorMessage: any;
        fileInputRef: any;
        imageMimeTypes?: any[];
        images?: any[];
        isSelected: any;
        onFileChange: any;
        uploader?: {};
        reorderHandler?: {};
    }): import("react/jsx-runtime").JSX.Element;
    export namespace GalleryCard {
        namespace propTypes {
            let isSelected: PropTypes.Requireable<boolean>;
            let onFileChange: PropTypes.Requireable<(...args: any[]) => any>;
            let captionEditor: PropTypes.Requireable<object>;
            let captionEditorInitialState: PropTypes.Requireable<object>;
            let errorMessage: PropTypes.Requireable<string>;
            let clearErrorMessage: PropTypes.Requireable<(...args: any[]) => any>;
            let deleteImage: PropTypes.Requireable<(...args: any[]) => any>;
            let fileInputRef: PropTypes.Requireable<object>;
            let filesDropper: PropTypes.Requireable<object>;
            let imageMimeTypes: PropTypes.Requireable<any[]>;
            let images: PropTypes.Requireable<any[]>;
            let uploader: PropTypes.Requireable<object>;
            let reorderHandler: PropTypes.Requireable<object>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "utils/getImageDimensions" {
    export function getImageDimensions(url: any): Promise<any>;
}
declare module "nodes/GalleryNodeComponent" {
    export function GalleryNodeComponent({ nodeKey, captionEditor, captionEditorInitialState }: {
        nodeKey: any;
        captionEditor: any;
        captionEditorInitialState: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/GalleryNode" {
    export function recalculateImageRows(images: any): void;
    export function $isGalleryNode(node: any): boolean;
    export const INSERT_GALLERY_COMMAND: import("lexical").LexicalCommand<any>;
    export const MAX_IMAGES: 9;
    export const MAX_PER_ROW: 3;
    export const ALLOWED_IMAGE_PROPS: string[];
    export class GalleryNode extends BaseGalleryNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            insertParams: {
                triggerFileDialog: boolean;
            };
            matches: string[];
            priority: number;
            shortcut: string;
        }[];
        constructor(dataset: {}, key: any);
        __captionEditor: any;
        __captionEditorInitialState: any;
        getIcon(): any;
        getDataset(): any;
        exportJSON(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
        setImages(images: any): void;
        images: any;
        addImages(images: any): void;
    }
    export function $createGalleryNode(dataset: any): GalleryNode;
    import { GalleryNode as BaseGalleryNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/ImageUploadForm" {
    export function ImageUploadForm({ onFileChange, fileInputRef, mimeTypes, multiple, disabled }: {
        onFileChange: any;
        fileInputRef: any;
        mimeTypes?: string[];
        multiple?: boolean;
        disabled: any;
    }): import("react/jsx-runtime").JSX.Element;
    export default ImageUploadForm;
}
declare module "utils/openFileSelection" {
    export function openFileSelection({ fileInputRef }: {
        fileInputRef: any;
    }): void;
}
declare module "components/ui/cards/ImageCard" {
    export function ImageCard({ isSelected, src, onFileChange, captionEditor, captionEditorInitialState, altText, setAltText, setFigureRef, fileInputRef, cardWidth, previewSrc, imageUploader, imageCardDragHandler, imageFileDragHandler }: {
        isSelected: any;
        src: any;
        onFileChange: any;
        captionEditor: any;
        captionEditorInitialState: any;
        altText: any;
        setAltText: any;
        setFigureRef: any;
        fileInputRef: any;
        cardWidth: any;
        previewSrc: any;
        imageUploader: any;
        imageCardDragHandler: any;
        imageFileDragHandler: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace ImageCard {
        namespace propTypes {
            let isSelected: PropTypes.Requireable<boolean>;
            let src: PropTypes.Requireable<string>;
            let onFileChange: PropTypes.Requireable<(...args: any[]) => any>;
            let captionEditor: PropTypes.Requireable<object>;
            let captionEditorInitialState: PropTypes.Requireable<object>;
            let altText: PropTypes.Requireable<string>;
            let setAltText: PropTypes.Requireable<(...args: any[]) => any>;
            let setFigureRef: PropTypes.Requireable<(...args: any[]) => any>;
            let fileInputRef: PropTypes.Requireable<object>;
            let cardWidth: PropTypes.Requireable<string>;
            let previewSrc: PropTypes.Requireable<string>;
            let imageUploader: PropTypes.Requireable<object>;
            let imageFileDragHandler: PropTypes.Requireable<object>;
            let imageCardDragHandler: PropTypes.Requireable<object>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/LinkInput" {
    export function LinkInput({ href, update, cancel, arrowStyles }: {
        href: any;
        update: any;
        cancel: any;
        arrowStyles: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace LinkInput {
        namespace propTypes {
            let href: PropTypes.Requireable<string>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "utils/dataSrcToFile" {
    export function dataSrcToFile(src: any, fileName: any): Promise<File>;
}
declare module "utils/imageUploadHandler" {
    export function imageUploadHandler(files: any, nodeKey: any, editor: any, upload: any): Promise<void>;
    export function backgroundImageUploadHandler(files: any, upload: any): Promise<{
        imageSrc: any;
        width: any;
        height: any;
    }>;
}
declare module "utils/isGif" {
    export function isGif(url: any): boolean;
}
declare module "nodes/ImageNodeComponent" {
    export function ImageNodeComponent({ nodeKey, initialFile, src, altText, captionEditor, captionEditorInitialState, triggerFileDialog, previewSrc, href }: {
        nodeKey: any;
        initialFile: any;
        src: any;
        altText: any;
        captionEditor: any;
        captionEditorInitialState: any;
        triggerFileDialog: any;
        previewSrc: any;
        href: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/services/tenor" {
    export function useTenor({ config }: {
        config: any;
    }): {
        updateSearch: import("lodash").DebouncedFunc<(term?: any) => Promise<void>>;
        isLoading: boolean;
        isLazyLoading: boolean;
        error: any;
        loadNextPage: () => Promise<void>;
        columns: any[];
        changeColumnCount: (count: any) => void;
        gifs: any[];
    };
    export namespace ERROR_TYPE {
        let COMMON: string;
        let INVALID_API_KEY: string;
    }
}
declare module "components/ui/file-selectors/Tenor/Error" {
    export function Error({ error }: {
        error: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/file-selectors/Tenor/Gif" {
    export function Gif({ gif, onClick, highlightedGif }: {
        gif: any;
        onClick: any;
        highlightedGif?: {};
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/file-selectors/Tenor/Loader" {
    export function Loader({ isLazyLoading }: {
        isLazyLoading: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/TenorSelector" {
    export default TenorSelector;
    function TenorSelector({ onGifInsert, onClickOutside, updateSearch, columns, isLoading, isLazyLoading, error, changeColumnCount, loadNextPage, gifs }: {
        onGifInsert: any;
        onClickOutside: any;
        updateSearch: any;
        columns: any;
        isLoading: any;
        isLazyLoading: any;
        error: any;
        changeColumnCount: any;
        loadNextPage: any;
        gifs: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/TenorPlugin" {
    export default TenorPlugin;
    function TenorPlugin({ nodeKey }: {
        nodeKey: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/file-selectors/Unsplash/UnsplashButton" {
    export default UnsplashButton;
    function UnsplashButton({ icon, label, ...props }: {
        [x: string]: any;
        icon: any;
        label: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/file-selectors/Unsplash/UnsplashImage" {
    export default UnsplashImage;
    function UnsplashImage({ payload, srcUrl, links, likes, user, alt, urls, height, width, zoomed, insertImage, selectImg }: {
        payload: any;
        srcUrl: any;
        links: any;
        likes: any;
        user: any;
        alt: any;
        urls: any;
        height: any;
        width: any;
        zoomed: any;
        insertImage: any;
        selectImg: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/file-selectors/Unsplash/UnsplashZoomed" {
    export default UnsplashZoomed;
    function UnsplashZoomed({ payload, insertImage, selectImg, zoomed }: {
        payload: any;
        insertImage: any;
        selectImg: any;
        zoomed: any;
    }): import("react/jsx-runtime").JSX.Element;
    namespace UnsplashZoomed {
        namespace propTypes {
            let payload: PropTypes.Requireable<object>;
            let insertImage: PropTypes.Requireable<(...args: any[]) => any>;
            let selectImg: PropTypes.Requireable<(...args: any[]) => any>;
            let zoomed: PropTypes.Requireable<boolean> | PropTypes.Requireable<object>;
            let srcUrl: PropTypes.Requireable<string>;
            let alt: PropTypes.Requireable<string>;
            let links: PropTypes.Requireable<object>;
            let likes: PropTypes.Requireable<number>;
            let user: PropTypes.Requireable<object>;
            let urls: PropTypes.Requireable<object>;
            let height: PropTypes.Requireable<number>;
            let width: PropTypes.Requireable<number>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/file-selectors/Unsplash/UnsplashGallery" {
    export function MasonryColumn(props: any): import("react/jsx-runtime").JSX.Element;
    export function UnsplashGalleryColumns(props: any): any;
    export function GalleryLayout(props: any): import("react/jsx-runtime").JSX.Element;
    export default UnsplashGallery;
    function UnsplashGallery({ zoomed, error, galleryRef, isLoading, dataset, selectImg, insertImage }: {
        zoomed: any;
        error: any;
        galleryRef: any;
        isLoading: any;
        dataset: any;
        selectImg: any;
        insertImage: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/file-selectors/Unsplash/UnsplashSelector" {
    export default UnsplashSelector;
    function UnsplashSelector({ closeModal, handleSearch, children, galleryRef }: {
        closeModal: any;
        handleSearch: any;
        children: any;
        galleryRef: any;
    }): import("react/jsx-runtime").JSX.Element;
    namespace UnsplashSelector {
        namespace propTypes {
            let closeModal: PropTypes.Requireable<(...args: any[]) => any>;
            let handleSearch: PropTypes.Requireable<(...args: any[]) => any>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "utils/masonry" {
    export default MasonryLayout;
    class MasonryLayout {
        constructor(columnCount: any);
        columnCount: any;
        columns: any[][];
        columnHeights: number[];
        reset(): void;
        addColumns(): void;
        addPhotoToColumns(photo: any): void;
        getColumns(): any[][];
        changeColumnCount(newColumnCount: any): void;
    }
}
declare module "utils/services/unsplash" {
    export default UnsplashService;
    class UnsplashService {
        constructor({ API_URL, HEADERS }: {
            API_URL: any;
            HEADERS: any;
        });
        API_URL: any;
        HEADERS: any;
        photos: any[];
        _pagination: any[];
        page: number;
        error: any;
        search_is_running: boolean;
        request_is_running: boolean;
        search_term: string;
        _lastRequestUrl: string;
        isLoading: boolean;
        extractPagination(response: any): any;
        checkStatus(response: any): Promise<any>;
        makeRequest(url: any): Promise<any>;
        loadNew(): Promise<void>;
        addPhotosFromResponse(response: any): Promise<void>;
        addPhoto(photo: any): Promise<void>;
        loadNextPage(): Promise<void>;
        updateSearch(term: any): Promise<void>;
        search(term: any): Promise<void>;
        triggerDownload(photo: any): void;
        getPhotos(): any[];
        clearPhotos(): void;
        getColumns(): any[][];
        reset(): void;
        pagination: any[];
        setSearchTerm(term: any): void;
    }
}
declare module "components/ui/UnsplashModal" {
    export default UnsplashModal;
    function UnsplashModal({ onClose, onImageInsert, unsplashConf }: {
        onClose: any;
        onImageInsert: any;
        unsplashConf: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/UnsplashPlugin" {
    export default UnsplashPlugin;
    function UnsplashPlugin({ nodeKey, isModalOpen }: {
        nodeKey: any;
        isModalOpen?: boolean;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "plugins/KoenigSelectorPlugin" {
    import {ReactNode} from "react";
    export const OPEN_TENOR_SELECTOR_COMMAND: import("lexical").LexicalCommand<any>;
    export const INSERT_FROM_TENOR_COMMAND: import("lexical").LexicalCommand<any>;
    export const OPEN_UNSPLASH_SELECTOR_COMMAND: import("lexical").LexicalCommand<any>;
    export function KoenigSelectorPlugin(): ReactNode;
    export default KoenigSelectorPlugin;
}
declare module "nodes/ImageNode" {
    export function $isImageNode(node: any): boolean;
    export const INSERT_IMAGE_COMMAND: import("lexical").LexicalCommand<any>;
    export class ImageNode extends BaseImageNode {
        static kgMenu: ({
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            insertParams: {
                triggerFileDialog: boolean;
            };
            matches: string[];
            queryParams: string[];
            priority: number;
            shortcut: string;
            section?: undefined;
            isHidden?: undefined;
        } | {
            section: string;
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            insertParams: {
                triggerFileDialog: boolean;
            };
            isHidden: ({ config }: {
                config: any;
            }) => boolean;
            matches: string[];
            queryParams: string[];
            priority: number;
            shortcut: string;
        } | {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            insertParams: {
                triggerFileDialog: boolean;
            };
            matches: string[];
            queryParams: string[];
            isHidden: ({ config }: {
                config: any;
            }) => boolean;
            shortcut: string;
            priority?: undefined;
            section?: undefined;
        })[];
        static uploadType: string;
        constructor(dataset: {}, key: any);
        __triggerFileDialog: boolean;
        __previewSrc: any;
        __captionEditor: any;
        __captionEditorInitialState: any;
        __initialFile: any;
        __selector: any;
        __isImageHidden: any;
        getIcon(): any;
        getDataset(): any;
        set previewSrc(previewSrc: any);
        get previewSrc(): any;
        set triggerFileDialog(shouldTrigger: any);
        createDOM(): HTMLDivElement;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    export function $createImageNode(dataset: any): ImageNode;
    import { ImageNode as BaseImageNode } from "@tryghost/kg-default-nodes";
}
declare module "utils/draggable/draggable-constants" {
    export const CONTAINER_DATA_ATTR: "koenigDndContainer";
    export const CONTAINER_SELECTOR: string;
    export const DRAGGABLE_DATA_ATTR: "koenigDndDraggable";
    export const DRAGGABLE_SELECTOR: string;
    export const DROPPABLE_DATA_ATTR: "koenigDndDroppable";
    export const DROPPABLE_SELECTOR: string;
    export const DRAG_DISABLED_DATA_ATTR: "koenigDndDisabled";
    export const DRAG_DISABLED_SELECTOR: string;
    export const DROP_INDICATOR_ID: "koenig-drag-drop-indicator";
    export const DROP_INDICATOR_ZINDEX: 10000;
    export const GHOST_CONTAINER_ID: "koenig-drag-drop-ghost-container";
    export const GHOST_ZINDEX: number;
}
declare module "utils/draggable/draggable-utils" {
    export function isCardDropAllowed(draggableIndex: any, droppableIndex: any, position?: string): boolean;
    export function getParent(element: any, value: any): any;
    export function getNextSibling(element: any, value: any): any;
    export function getPreviousSibling(element: any, value: any): any;
    export function getParentScrollableElement(element: any): any;
    export function getDocumentScrollingElement(): any;
    export function applyUserSelect(element: any, value: any): void;
}
declare module "utils/draggable/DragDropContainer" {
    export class DragDropContainer {
        constructor(element: any, options: any);
        element: any;
        draggables: any[];
        droppables: any[];
        isDragEnabled: boolean;
        _createGhostElement: any;
        getDraggableInfo(): boolean;
        getIndicatorPosition(): boolean;
        onDragStart(): void;
        onDragEnterContainer(): void;
        onDragEnterDroppable(): void;
        onDragOverDroppable(): void;
        onDragLeaveDroppable(): void;
        onDragLeaveContainer(): void;
        onDragEnd(): void;
        onDrop(): void;
        onDropEnd(): void;
        createGhostElement(draggableInfo: any): any;
        enableDrag(): void;
        disableDrag(): void;
        refresh(): void;
    }
}
declare module "utils/draggable/ScrollHandler" {
    export namespace defaultOptions {
        let speed: number;
        let sensitivity: number;
    }
    export class ScrollHandler {
        options: {
            speed: number;
            sensitivity: number;
        };
        currentMousePosition: {
            clientX: any;
            clientY: any;
        };
        findScrollableElementFrame: number;
        scrollableElement: any;
        scrollAnimationFrame: number;
        _scroll(): void;
        _isSafari: boolean;
        dragStart(draggableInfo: any): void;
        dragMove(draggableInfo: any): void;
        dragStop(): void;
        getScrollableElement(target: any): any;
    }
}
declare module "utils/draggable/DragDropHandler" {
    export class DragDropHandler {
        constructor({ editorContainerElement }: {
            editorContainerElement: any;
        });
        EE: any;
        editorContainerElement: any;
        containers: any;
        draggableInfo: any;
        ghostInfo: any;
        grabbedElement: any;
        scrollHandler: any;
        sourceContainer: any;
        _currentOverContainer: any;
        _currentOverContainerElem: any;
        _currentOverDroppableElem: any;
        _currentOverDroppablePosition: any;
        _dropIndicator: any;
        _elementsWithHoverRemoved: any;
        _eventHandlers: any;
        _ghostContainerElement: any;
        _rafUpdateGhostElementPosition: any;
        _transformedDroppables: any;
        _waitForDragStartPromise: any;
        destroy(): void;
        registerContainer(element: any, options: any): {
            enableDrag: () => void;
            disableDrag: () => void;
            refresh: () => void;
            destroy: () => void;
        };
        cleanup(): void;
        _onMouseDown(event: any): void;
        _onMouseMove(event: any): void;
        _onMouseUp(): void;
        _onKeyDown(event: any): void;
        _waitForDragStart(startEvent: any): Promise<any>;
        _initiateDrag(startEvent: any): void;
        isDragging: boolean;
        _removeHoverClasses(): void;
        _restoreHoverClasses(): void;
        _handleDrag(event: any): void;
        _updateGhostElementPosition(): void;
        _showDropIndicator({ direction, position, beforeElems, afterElems }: {
            direction: any;
            position: any;
            beforeElems: any;
            afterElems: any;
        }): void;
        _dropIndicatorTimeout: NodeJS.Timeout;
        _hideDropIndicator({ clearInsertIndex }?: {
            clearInsertIndex?: boolean;
        }): void;
        transformedDroppables: any[];
        _resetDrag(): void;
        _appendDropIndicator(): void;
        _removeDropIndicator(): void;
        _appendGhostContainerElement(): void;
        _removeGhostContainerElement(): void;
        _addGrabListeners(): void;
        _removeGrabListeners(): void;
        _addMoveListeners(): void;
        _removeMoveListeners(): void;
        _addReleaseListeners(): void;
        _removeReleaseListeners(): void;
        _addKeyDownListeners(): void;
        _removeKeyDownListeners(): void;
        _addEventListener(e: any, method: any, options: any): void;
        _removeEventListener(e: any): void;
    }
}
declare module "plugins/DragDropReorderPlugin" {
    import {ReactNode} from "react";
    export default function DragDropReorderPlugin(): ReactNode;
}
declare module "utils/$getSelectionRangeRect" {
    export function $getSelectionRangeRect({ selection, editor }: {
        selection: any;
        editor: any;
    }): ClientRect;
}
declare module "utils/getScrollParent" {
    export function getScrollParent(node: any): any;
}
declare module "utils/setFloatingElemPosition" {
    export function setFloatingElemPosition(targetRect: any, floatingElem: any, anchorElem: any, options?: {}): void;
}
declare module "components/ui/FloatingToolbar" {
    export default function FloatingToolbar({ anchorElem, children, editor, isVisible, toolbarRef, targetElem, onReposition, shouldReposition, controlOpacity }: {
        anchorElem: any;
        children: any;
        editor: any;
        isVisible: any;
        toolbarRef: any;
        targetElem: any;
        onReposition: any;
        shouldReposition?: boolean;
        controlOpacity: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/getSelectedNode" {
    export function getSelectedNode(selection: any): any;
}
declare module "components/ui/FormatToolbar" {
    export default function FormatToolbar({ editor, isSnippetsEnabled, isLinkSelected, onLinkClick, onSnippetClick, arrowStyles, hiddenFormats }: {
        editor: any;
        isSnippetsEnabled: any;
        isLinkSelected: any;
        onLinkClick: any;
        onSnippetClick: any;
        arrowStyles: any;
        hiddenFormats?: any[];
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/LinkActionToolbar" {
    export function LinkActionToolbar({ href, onClose, ...props }: {
        [x: string]: any;
        href: any;
        onClose: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/FloatingFormatToolbar" {
    export function FloatingFormatToolbar({ editor, anchorElem, href, isSnippetsEnabled, toolbarItemType, setToolbarItemType, selectionRangeRect, hiddenFormats }: {
        editor: any;
        anchorElem: any;
        href: any;
        isSnippetsEnabled: any;
        toolbarItemType: any;
        setToolbarItemType: any;
        selectionRangeRect: any;
        hiddenFormats?: any[];
    }): import("react/jsx-runtime").JSX.Element;
    export namespace toolbarItemTypes {
        let snippet: string;
        let link: string;
        let text: string;
    }
}
declare module "components/ui/LinkToolbar" {
    export function LinkToolbar({ href, onEdit, onRemove }: {
        href: any;
        onEdit: any;
        onRemove: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/FloatingLinkToolbar" {
    export function FloatingLinkToolbar({ anchorElem, onEditLink, disabled }: {
        anchorElem: any;
        onEditLink: any;
        disabled: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "plugins/FloatingToolbarPlugin" {
    export default function FloatingToolbarPlugin({ anchorElem, isSnippetsEnabled, hiddenFormats }: {
        anchorElem?: HTMLElement;
        isSnippetsEnabled: any;
        hiddenFormats?: any[];
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/KoenigErrorBoundary" {
    export default function KoenigErrorBoundary({ children }: {
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/HorizontalRuleCard" {
    export function HorizontalRuleCard(): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/HorizontalRuleNode" {
    export function $createHorizontalRuleNode(): HorizontalRuleNode;
    export function $isHorizontalRuleNode(node: any): boolean;
    export const INSERT_HORIZONTAL_RULE_COMMAND: import("lexical").LexicalCommand<any>;
    export class HorizontalRuleNode extends BaseHorizontalRuleNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            shortcut: string;
        };
        getIcon(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    import { HorizontalRuleNode as BaseHorizontalRuleNode } from "@tryghost/kg-default-nodes";
}
declare module "plugins/MarkdownShortcutPlugin" {
    export default function MarkdownShortcutPlugin({ transformers }?: {
        transformers?: (Readonly<{
            format: readonly import("lexical").TextFormatType[];
            tag: string;
            intraword?: boolean;
            type: "text-format";
        }> | {
            format: string[];
            tag: string;
            type: string;
        } | Readonly<{
            dependencies: import("lexical").Klass<import("lexical").LexicalNode>[];
            export: (node: import("lexical").LexicalNode, exportChildren: (node: import("lexical").ElementNode) => string, exportFormat: (node: import("lexical").TextNode, textContent: string) => string) => string;
            importRegExp: RegExp;
            regExp: RegExp;
            replace: (node: import("lexical").TextNode, match: RegExpMatchArray) => void;
            trigger: string;
            type: "text-match";
        }> | {
            dependencies: (typeof HorizontalRuleNode)[];
            export: (node: any) => string;
            regExp: RegExp;
            replace: (parentNode: any, _1: any, _2: any, isImport: any) => void;
            type: string;
        } | {
            dependencies: (typeof CodeBlockNode)[];
            export: (node: any) => string;
            regExp: RegExp;
            replace: (textNode: any, match: any, text: any) => void;
            type: string;
        } | {
            dependencies: (typeof ImageNode)[];
            export: (node: any) => string;
            regExp: RegExp;
            replace: (parentNode: any, match: any, text: any) => void;
            type: string;
        } | import("@lexical/markdown").ElementTransformer)[];
    }): null;
    export namespace HR {
        export let dependencies: (typeof HorizontalRuleNode)[];
        export function _export(node: any): string;
        export { _export as export };
        export let regExp: RegExp;
        export function replace(parentNode: any, _1: any, _2: any, isImport: any): void;
        export let type: string;
    }
    export namespace CODE_BLOCK {
        let dependencies_1: (typeof CodeBlockNode)[];
        export { dependencies_1 as dependencies };
        export function _export_1(node: any): string;
        export { _export_1 as export };
        let regExp_1: RegExp;
        export { regExp_1 as regExp };
        export function replace_1(textNode: any, match: any, text: any): void;
        export { replace_1 as replace };
        let type_1: string;
        export { type_1 as type };
    }
    export namespace IMAGE {
        let dependencies_2: (typeof ImageNode)[];
        export { dependencies_2 as dependencies };
        export function _export_2(node: any): string;
        export { _export_2 as export };
        let regExp_2: RegExp;
        export { regExp_2 as regExp };
        export function replace_2(parentNode: any, match: any, text: any): void;
        export { replace_2 as replace };
        let type_2: string;
        export { type_2 as type };
    }
    export namespace SUBSCRIPT {
        export let format: string[];
        export let tag: string;
        let type_3: string;
        export { type_3 as type };
    }
    export namespace SUPERSCRIPT {
        let format_1: string[];
        export { format_1 as format };
        let tag_1: string;
        export { tag_1 as tag };
        let type_4: string;
        export { type_4 as type };
    }
    export const ELEMENT_TRANSFORMERS: ({
        dependencies: (typeof HorizontalRuleNode)[];
        export: (node: any) => string;
        regExp: RegExp;
        replace: (parentNode: any, _1: any, _2: any, isImport: any) => void;
        type: string;
    } | {
        dependencies: (typeof CodeBlockNode)[];
        export: (node: any) => string;
        regExp: RegExp;
        replace: (textNode: any, match: any, text: any) => void;
        type: string;
    } | {
        dependencies: (typeof ImageNode)[];
        export: (node: any) => string;
        regExp: RegExp;
        replace: (parentNode: any, match: any, text: any) => void;
        type: string;
    } | import("@lexical/markdown").ElementTransformer)[];
    export const CUSTOM_TEXT_FORMAT_TRANSFORMERS: {
        format: string[];
        tag: string;
        type: string;
    }[];
    export const DEFAULT_TRANSFORMERS: (Readonly<{
        format: readonly import("lexical").TextFormatType[];
        tag: string;
        intraword?: boolean;
        type: "text-format";
    }> | {
        format: string[];
        tag: string;
        type: string;
    } | Readonly<{
        dependencies: import("lexical").Klass<import("lexical").LexicalNode>[];
        export: (node: import("lexical").LexicalNode, exportChildren: (node: import("lexical").ElementNode) => string, exportFormat: (node: import("lexical").TextNode, textContent: string) => string) => string;
        importRegExp: RegExp;
        regExp: RegExp;
        replace: (node: import("lexical").TextNode, match: RegExpMatchArray) => void;
        trigger: string;
        type: "text-match";
    }> | {
        dependencies: (typeof HorizontalRuleNode)[];
        export: (node: any) => string;
        regExp: RegExp;
        replace: (parentNode: any, _1: any, _2: any, isImport: any) => void;
        type: string;
    } | {
        dependencies: (typeof CodeBlockNode)[];
        export: (node: any) => string;
        regExp: RegExp;
        replace: (textNode: any, match: any, text: any) => void;
        type: string;
    } | {
        dependencies: (typeof ImageNode)[];
        export: (node: any) => string;
        regExp: RegExp;
        replace: (parentNode: any, match: any, text: any) => void;
        type: string;
    } | import("@lexical/markdown").ElementTransformer)[];
    export const MINIMAL_TRANSFORMERS: (Readonly<{
        format: readonly import("lexical").TextFormatType[];
        tag: string;
        intraword?: boolean;
        type: "text-format";
    }> | {
        format: string[];
        tag: string;
        type: string;
    } | Readonly<{
        dependencies: import("lexical").Klass<import("lexical").LexicalNode>[];
        export: (node: import("lexical").LexicalNode, exportChildren: (node: import("lexical").ElementNode) => string, exportFormat: (node: import("lexical").TextNode, textContent: string) => string) => string;
        importRegExp: RegExp;
        regExp: RegExp;
        replace: (node: import("lexical").TextNode, match: RegExpMatchArray) => void;
        trigger: string;
        type: "text-match";
    }>)[];
    export const BASIC_TRANSFORMERS: (Readonly<{
        format: readonly import("lexical").TextFormatType[];
        tag: string;
        intraword?: boolean;
        type: "text-format";
    }> | {
        format: string[];
        tag: string;
        type: string;
    } | Readonly<{
        dependencies: import("lexical").Klass<import("lexical").LexicalNode>[];
        export: (node: import("lexical").LexicalNode, exportChildren: (node: import("lexical").ElementNode) => string, exportFormat: (node: import("lexical").TextNode, textContent: string) => string) => string;
        importRegExp: RegExp;
        regExp: RegExp;
        replace: (node: import("lexical").TextNode, match: RegExpMatchArray) => void;
        trigger: string;
        type: "text-match";
    }> | import("@lexical/markdown").ElementTransformer)[];
    import { HorizontalRuleNode } from "nodes/HorizontalRuleNode";
    import { CodeBlockNode } from "nodes/CodeBlockNode";
    import { ImageNode } from "nodes/ImageNode";
}
declare module "hooks/useKoenigTextEntity" {
    export function useKoenigTextEntity(getMatch: any, targetNode: any, createNode: any, nodeType?: typeof TextNode): void;
    import { TextNode } from "lexical";
}
declare module "context/TKContext" {
    export function TKContext({ children }: {
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function useTKContext(): {};
}
declare module "plugins/TKPlugin" {
    export default function TKPlugin(): import("react").ReactPortal;
}
declare module "components/ui/EditorPlaceholder" {
    export function EditorPlaceholder({ className, text }: {
        className: any;
        text: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "plugins/ExternalControlPlugin" {
    import {ReactNode} from "react";
    import {LexicalEditor} from "lexical";

    export type ExternalApi = {
        editorInstance: LexicalEditor,
        serialize: () => string,
        editorIsEmpty: () => boolean,
        focusEditor: (options: {position: string}) => void,
        blurEditor: () => void,
        insertParagraphAtTop: (options?: {focus: boolean}) => void,
        insertParagraphAtBottom: (options?: {focus: boolean}) => void,
        insertFiles: (files: File[]) => void,
        lastNodeIsDecorator: () => boolean
    }

    export function ExternalControlPlugin({ registerAPI }: {
        registerAPI: (api: ExternalApi) => void
    }): ReactNode;
    export default ExternalControlPlugin;
}
declare module "plugins/KoenigBlurPlugin" {
    import {ReactNode} from "react";

    export function KoenigBlurPlugin({ onBlur }: {
        onBlur: any;
    }): ReactNode;
}
declare module "plugins/KoenigFocusPlugin" {
    import {ReactNode} from "react";

    export function KoenigFocusPlugin({ onFocus }: {
        onFocus: any;
    }): ReactNode;
}
declare module "context/SharedHistoryContext" {
    export function SharedHistoryContext({ children }: {
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function useSharedHistoryContext(): {};
}
declare module "context/SharedOnChangeContext" {
    export function SharedOnChangeContext({ onChange, children }: {
        onChange: any;
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function useSharedOnChangeContext(): {};
}
declare module "components/KoenigComposableEditor" {
    export default KoenigComposableEditor;
    function KoenigComposableEditor({ onChange, onBlur, onFocus, markdownTransformers, registerAPI, cursorDidExitAtTop, children, placeholder, singleParagraph, placeholderText, placeholderClassName, className, readOnly, isDragEnabled, inheritStyles, isSnippetsEnabled, hiddenFormats, dataTestId }: {
        onChange: any;
        onBlur: any;
        onFocus: any;
        markdownTransformers: any;
        registerAPI: any;
        cursorDidExitAtTop: any;
        children: any;
        placeholder: any;
        singleParagraph: any;
        placeholderText: any;
        placeholderClassName?: string;
        className?: string;
        readOnly?: boolean;
        isDragEnabled?: boolean;
        inheritStyles?: boolean;
        isSnippetsEnabled?: boolean;
        hiddenFormats?: any[];
        dataTestId: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/AudioUploadForm" {
    export function AudioUploadForm({ onFileChange, fileInputRef, mimeTypes }: {
        onFileChange: any;
        fileInputRef: any;
        mimeTypes?: string[];
    }): import("react/jsx-runtime").JSX.Element;
    export default AudioUploadForm;
}
declare module "components/ui/MediaPlayer" {
    export function MediaPlayer({ type, duration, theme, ...args }: {
        [x: string]: any;
        type: any;
        duration: any;
        theme: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace MediaPlayer {
        namespace propTypes {
            let theme: PropTypes.Requireable<string>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/ReadOnlyOverlay" {
    export function ReadOnlyOverlay(): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/AudioCard" {
    export function AudioCard({ src, thumbnailSrc, title, isEditing, updateTitle, duration, audioUploader, audioMimeTypes, thumbnailUploader, thumbnailMimeTypes, audioFileInputRef, thumbnailFileInputRef, onAudioFileChange, onThumbnailFileChange, audioDragHandler, removeThumbnail, thumbnailDragHandler }: {
        src: any;
        thumbnailSrc: any;
        title: any;
        isEditing: any;
        updateTitle: any;
        duration: any;
        audioUploader: any;
        audioMimeTypes: any;
        thumbnailUploader: any;
        thumbnailMimeTypes: any;
        audioFileInputRef: any;
        thumbnailFileInputRef: any;
        onAudioFileChange: any;
        onThumbnailFileChange: any;
        audioDragHandler: any;
        removeThumbnail: any;
        thumbnailDragHandler: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace AudioCard {
        namespace propTypes {
            let src: PropTypes.Requireable<string>;
            let title: PropTypes.Requireable<string>;
            let isEditing: PropTypes.Requireable<boolean>;
            let updateTitle: PropTypes.Requireable<(...args: any[]) => any>;
            let duration: PropTypes.Requireable<number>;
            let thumbnailSrc: PropTypes.Requireable<string>;
            let audioUploader: PropTypes.Requireable<object>;
            let audioMimeTypes: PropTypes.Requireable<any[]>;
            let thumbnailUploader: PropTypes.Requireable<object>;
            let thumbnailMimeTypes: PropTypes.Requireable<any[]>;
            let audioFileInputRef: PropTypes.Requireable<object>;
            let thumbnailFileInputRef: PropTypes.Requireable<object>;
            let onAudioFileChange: PropTypes.Requireable<(...args: any[]) => any>;
            let onThumbnailFileChange: PropTypes.Requireable<(...args: any[]) => any>;
            let audioDragHandler: PropTypes.Requireable<object>;
            let removeThumbnail: PropTypes.Requireable<(...args: any[]) => any>;
            let thumbnailDragHandler: PropTypes.Requireable<object>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "utils/prettifyFileName" {
    export default function prettifyFileName(filename: any): string;
}
declare module "utils/getAudioMetadata" {
    export function getAudioMetadata(url: any): Promise<any>;
}
declare module "utils/audioUploadHandler" {
    export function audioUploadHandler(files: any, nodeKey: any, editor: any, upload: any): Promise<void>;
}
declare module "utils/thumbnailUploadHandler" {
    export function thumbnailUploadHandler(files: any, nodeKey: any, editor: any, upload: any): Promise<void>;
}
declare module "nodes/AudioNodeComponent" {
    export function AudioNodeComponent({ duration, initialFile, nodeKey, src, thumbnailSrc, title, triggerFileDialog }: {
        duration: any;
        initialFile: any;
        nodeKey: any;
        src: any;
        thumbnailSrc: any;
        title: any;
        triggerFileDialog: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/AudioNode" {
    export function $isAudioNode(node: any): boolean;
    export const INSERT_AUDIO_COMMAND: import("lexical").LexicalCommand<any>;
    export class AudioNode extends BaseAudioNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            insertParams: {
                triggerFileDialog: boolean;
            };
            matches: string[];
            priority: number;
            shortcut: string;
        }[];
        static uploadType: string;
        constructor(dataset: {}, key: any);
        __triggerFileDialog: boolean;
        __initialFile: any;
        getIcon(): any;
        set triggerFileDialog(shouldTrigger: any);
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    export function $createAudioNode(dataset: any): AudioNode;
    import { AudioNode as BaseAudioNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/Button" {
    export function Button({ color, dataTestId, href, size, width, rounded, value, placeholder, type, disabled, target, ...other }: {
        [x: string]: any;
        color: any;
        dataTestId: any;
        href: any;
        size: any;
        width: any;
        rounded: any;
        value: any;
        placeholder: any;
        type?: string;
        disabled?: boolean;
        target: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace Button {
        namespace propTypes {
            let color: PropTypes.Requireable<string>;
            let size: PropTypes.Requireable<string>;
            let width: PropTypes.Requireable<string>;
            let rounded: PropTypes.Requireable<boolean>;
            let value: PropTypes.Requireable<string>;
            let placeholder: PropTypes.Requireable<string>;
            let href: PropTypes.Requireable<string>;
            let target: PropTypes.Requireable<string>;
            let disabled: PropTypes.Requireable<boolean>;
        }
        namespace defaultProps {
            let color_1: string;
            export { color_1 as color };
            let size_1: string;
            export { size_1 as size };
            let width_1: string;
            export { width_1 as width };
            let rounded_1: boolean;
            export { rounded_1 as rounded };
            let value_1: string;
            export { value_1 as value };
            let placeholder_1: string;
            export { placeholder_1 as placeholder };
            let disabled_1: boolean;
            export { disabled_1 as disabled };
        }
    }
    import PropTypes from "prop-types";
}
declare module "hooks/useMovable" {
    /**
     * useMovable
     * @param {Object} options
     * @param {Function} options.adjustOnResize - function called when panel size was changed
     * @returns {Object} ref - a ref that should be attached to the element that should be movable
     *
     * @description
     * useMovable is a hook that allows an element to be moved around the screen by dragging it.
     *
     * @example
     * const {ref} = useMovable();
     */
    export default function useMovable({ adjustOnResize, adjustOnDrag }?: {
        adjustOnResize: Function;
    }): any;
}
declare module "hooks/useSettingsPanelReposition" {
    export default function useSettingsPanelReposition({ positionToRef }: {
        positionToRef: any;
    }, cardWidth: any): {
        ref: any;
    };
}
declare module "hooks/usePreviousFocus" {
    export function usePreviousFocus(onClick: any, name: any): {
        handleMousedown: () => void;
        handleClick: (e: any) => void;
    };
}
declare module "components/ui/ButtonGroup" {
    export function ButtonGroup({ buttons, selectedName, onClick }: {
        buttons?: any[];
        selectedName: any;
        onClick: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace ButtonGroup {
        namespace propTypes {
            let selectedName: PropTypes.Requireable<string>;
        }
    }
    export function IconButton({ dataTestId, onClick, label, name, selectedName, Icon }: {
        dataTestId: any;
        onClick: any;
        label: any;
        name: any;
        selectedName: any;
        Icon: any;
    }): import("react/jsx-runtime").JSX.Element;
    import PropTypes from "prop-types";
}
declare module "components/ui/Input" {
    export function Input({ dataTestId, value, placeholder, onChange, onFocus, onBlur }: {
        dataTestId: any;
        value: any;
        placeholder: any;
        onChange: any;
        onFocus: any;
        onBlur: any;
    }): import("react/jsx-runtime").JSX.Element;
    export const INPUT_CLASSES: "rounded border border-grey-300 py-2 px-3 font-sans text-sm font-normal text-grey-900 focus:border-green focus:shadow-insetgreen focus-visible:outline-none dark:border-grey-900 dark:bg-grey-900 dark:text-white dark:placeholder:text-grey-700 dark:selection:bg-grey-800";
}
declare module "utils/getAccentColor" {
    export function getAccentColor(): string;
}
declare module "components/ui/ColorPicker" {
    export function ColorPicker({ value, eyedropper, hasTransparentOption, onChange }: {
        value: any;
        eyedropper: any;
        hasTransparentOption: any;
        onChange: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function ColorIndicator({ value, swatches, onSwatchChange, onTogglePicker, isExpanded }: {
        value: any;
        swatches: any;
        onSwatchChange: any;
        onTogglePicker: any;
        isExpanded: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/ColorOptionButtons" {
    export function ColorOptionButtons({ buttons, selectedName, onClick }: {
        buttons?: any[];
        selectedName: any;
        onClick: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function ColorButton({ onClick, label, name, color, selectedName }: {
        onClick: any;
        label: any;
        name: any;
        color: any;
        selectedName: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/DropdownContainer" {
    /**
     * Note: when using the DropdownContainer, make sure the input and the dropdown both are in a relative container with a defined z-index (or new stacking context)
     * Make sure the input has a background color, to avoid the shadow of the dropdown showing through
     *
     * Displays the dropdown above or below the parent element, depending on the space available in the viewport.
     * The parent should be positioned relative.
     */
    export function DropdownContainer({ children }: {
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/KeyboardSelection" {
    /**
     * Renders a list of options, which are selectable by using the up and down arrow keys.
     * You pass in the template for each option via the getItem function, which is called for each option and also passes in whether the item is selected or not.
     *
     * @param {object} options
     * @param {T[]} [options.items]
     * @param {(T, selected) => import('react').ReactElement} [options.getItem]
     */
    export function KeyboardSelection({ items, getItem, onSelect, defaultSelected }: {
        items?: T[];
        getItem?: (T: any, selected: any) => import('react').ReactElement;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/Dropdown" {
    export function Dropdown({ value, menu, onChange, dataTestId }: {
        value: any;
        menu: any;
        onChange: any;
        dataTestId: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/InputList" {
    /**
     * Little warning here: this has an onChange handler that doesn't have an event as parameter, but just the value.
     *
     * @param {object} options
     * @param {{value: string, label: string}[]} [options.listOptions]
     * @param {string} [options.list]
     * @returns
     */
    export function InputList({ dataTestId, listOptions, value, placeholder, onChange }: {
        listOptions?: {
            value: string;
            label: string;
        }[];
        list?: string;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/MediaUploader" {
    export function MediaUploader({ className, imgClassName, src, alt, desc, icon, size, borderStyle, backgroundSize, mimeTypes, onFileChange, dragHandler, isEditing, isLoading, isPinturaEnabled, openImageEditor, progress, errors, onRemoveMedia, additionalActions, setFileInputRef }: {
        className: any;
        imgClassName: any;
        src: any;
        alt: any;
        desc: any;
        icon: any;
        size: any;
        borderStyle?: string;
        backgroundSize?: string;
        mimeTypes: any;
        onFileChange: any;
        dragHandler: any;
        isEditing?: boolean;
        isLoading: any;
        isPinturaEnabled: any;
        openImageEditor: any;
        progress: any;
        errors: any;
        onRemoveMedia: any;
        additionalActions: any;
        setFileInputRef: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace MediaUploader {
        namespace propTypes {
            let className: PropTypes.Requireable<string>;
            let src: PropTypes.Requireable<string>;
            let alt: PropTypes.Requireable<string>;
            let desc: PropTypes.Requireable<string>;
            let icon: PropTypes.Requireable<string>;
            let size: PropTypes.Requireable<string>;
            let borderStyle: PropTypes.Requireable<string>;
            let mimeTypes: PropTypes.Requireable<string[]>;
            let onFileChange: PropTypes.Requireable<(...args: any[]) => any>;
            let dragHandler: PropTypes.Requireable<PropTypes.InferProps<{
                isDraggedOver: PropTypes.Requireable<boolean>;
                setRef: PropTypes.Requireable<(...args: any[]) => any>;
            }>>;
            let isLoading: PropTypes.Requireable<boolean>;
            let progress: PropTypes.Requireable<number>;
            let errors: PropTypes.Requireable<PropTypes.InferProps<{
                message: PropTypes.Requireable<string>;
            }>[]>;
            let onRemoveMedia: PropTypes.Requireable<(...args: any[]) => any>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/MultiSelectDropdown" {
    export function MultiSelectDropdown({ placeholder, items, availableItems, onChange, dataTestId, allowAdd }: {
        placeholder?: string;
        items?: any[];
        availableItems?: any[];
        onChange: any;
        dataTestId: any;
        allowAdd?: boolean;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/Slider" {
    export function Slider({ dataTestId, max, min, value, onChange }: {
        dataTestId: any;
        max: any;
        min: any;
        value: any;
        onChange: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace Slider {
        namespace propTypes {
            let max: PropTypes.Requireable<number>;
            let min: PropTypes.Requireable<number>;
            let value: PropTypes.Requireable<number>;
            let onChange: PropTypes.Requireable<(...args: any[]) => any>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/Toggle" {
    export function Toggle({ isChecked, onChange, dataTestId }: {
        isChecked: any;
        onChange: any;
        dataTestId: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace Toggle {
        namespace propTypes {
            let isChecked: PropTypes.Requireable<boolean>;
            let onChange: PropTypes.Requireable<(...args: any[]) => any>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/SettingsPanel" {
    export function SettingsPanel({ children, darkMode, cardWidth }: {
        children: any;
        darkMode: any;
        cardWidth: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function ToggleSetting({ label, description, isChecked, onChange, dataTestId }: {
        label: any;
        description: any;
        isChecked: any;
        onChange: any;
        dataTestId: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function SliderSetting({ label, onChange, max, min, value, defaultValue, description, dataTestId }: {
        label: any;
        onChange: any;
        max: any;
        min: any;
        value: any;
        defaultValue: any;
        description: any;
        dataTestId: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function InputSetting({ label, hideLabel, description, onChange, value, placeholder, dataTestId, onBlur }: {
        label: any;
        hideLabel: any;
        description: any;
        onChange: any;
        value: any;
        placeholder: any;
        dataTestId: any;
        onBlur: any;
    }): import("react/jsx-runtime").JSX.Element;
    /**
     * Enter a link with autocompletion
     */
    export function InputUrlSetting({ dataTestId, label, value, onChange }: {
        dataTestId: any;
        label: any;
        value: any;
        onChange: any;
    }): import("react/jsx-runtime").JSX.Element;
    /**
     * A text input with autocomplete suggestions.
     * @param {object} options
     * @param {(value: string) => void} options.onChange Does not pass an event, only the value
     * @param {{value: string, label: string}[]} options.listOptions
     * @returns
     */
    export function InputListSetting({ dataTestId, description, label, listOptions, onChange, placeholder, value }: {
        onChange: (value: string) => void;
        listOptions: {
            value: string;
            label: string;
        }[];
    }): import("react/jsx-runtime").JSX.Element;
    export function DropdownSetting({ label, description, value, menu, onChange, dataTestId }: {
        label: any;
        description: any;
        value: any;
        menu: any;
        onChange: any;
        dataTestId: any;
    }): import("react/jsx-runtime").JSX.Element;
    /**
     *
     * @param {object} options
     * @param {T[]} options.items The curretly selected items
     * @param {T[]} options.availableItems The items available for selection
     * @param {boolean} options.allowAdd Whether to allow adding new items
     * @returns
     */
    export function MultiSelectDropdownSetting({ label, description, placeholder, items, availableItems, onChange, dataTestId, allowAdd }: {
        items: T[];
        availableItems: T[];
        allowAdd: boolean;
    }): import("react/jsx-runtime").JSX.Element;
    export function ButtonGroupSetting({ label, onClick, selectedName, buttons }: {
        label: any;
        onClick: any;
        selectedName: any;
        buttons: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function ColorOptionSetting({ label, onClick, selectedName, buttons, layout, dataTestId }: {
        label: any;
        onClick: any;
        selectedName: any;
        buttons: any;
        layout: any;
        dataTestId: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function ColorPickerSetting({ label, isExpanded, onSwatchChange, onPickerChange, onTogglePicker, value, swatches, eyedropper, hasTransparentOption, dataTestId }: {
        label: any;
        isExpanded: any;
        onSwatchChange: any;
        onPickerChange: any;
        onTogglePicker: any;
        value: any;
        swatches: any;
        eyedropper: any;
        hasTransparentOption: any;
        dataTestId: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function MediaUploadSetting({ className, label, hideLabel, onFileChange, isDraggedOver, placeholderRef, src, alt, isLoading, errors, progress, onRemoveMedia, icon, desc, size, borderStyle, mimeTypes, isPinturaEnabled, openImageEditor, setFileInputRef }: {
        className: any;
        label: any;
        hideLabel: any;
        onFileChange: any;
        isDraggedOver: any;
        placeholderRef: any;
        src: any;
        alt: any;
        isLoading: any;
        errors?: any[];
        progress: any;
        onRemoveMedia: any;
        icon: any;
        desc?: string;
        size: any;
        borderStyle: any;
        mimeTypes: any;
        isPinturaEnabled: any;
        openImageEditor: any;
        setFileInputRef: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function SettingsDivider(): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/ButtonCard" {
    export function ButtonCard({ alignment, buttonText, buttonPlaceholder, buttonUrl, handleAlignmentChange, handleButtonTextChange, handleButtonUrlChange, isEditing }: {
        alignment: any;
        buttonText: any;
        buttonPlaceholder: any;
        buttonUrl: any;
        handleAlignmentChange: any;
        handleButtonTextChange: any;
        handleButtonUrlChange: any;
        isEditing: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace ButtonCard {
        namespace propTypes {
            let alignment: PropTypes.Requireable<string>;
            let buttonText: PropTypes.Requireable<string>;
            let buttonPlaceholder: PropTypes.Requireable<string>;
            let buttonUrl: PropTypes.Requireable<string>;
            let handleAlignmentChange: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonTextChange: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonUrlChange: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonUrlFocus: PropTypes.Requireable<(...args: any[]) => any>;
            let handleOptionClick: PropTypes.Requireable<(...args: any[]) => any>;
            let isEditing: PropTypes.Requireable<boolean>;
            let suggestedUrls: PropTypes.Requireable<any[]>;
            let suggestedUrlVisibility: PropTypes.Requireable<boolean>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/ButtonNodeComponent" {
    export function ButtonNodeComponent({ alignment, buttonText, buttonUrl, nodeKey }: {
        alignment: any;
        buttonText: any;
        buttonUrl: any;
        nodeKey: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/ButtonNode" {
    export function $createButtonNode(dataset: any): ButtonNode;
    export function $isButtonNode(node: any): boolean;
    export const INSERT_BUTTON_COMMAND: import("lexical").LexicalCommand<any>;
    export class ButtonNode extends BaseButtonNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            shortcut: string;
        };
        static getType(): string;
        getIcon(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    import { ButtonNode as BaseButtonNode } from "@tryghost/kg-default-nodes";
}
declare module "nodes/MinimalNodes" {
    export default MINIMAL_NODES;
    const MINIMAL_NODES: (typeof LinkNode | typeof TKNode)[];
    import { LinkNode } from "@lexical/link";
    import { TKNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/EmojiPicker" {
    export default function EmojiPicker({ setInstanceRef, ...props }: {
        [x: string]: any;
        setInstanceRef: any;
    }): React.DetailedReactHTMLElement<React.HTMLAttributes<any>, any>;
    import React from "react";
}
declare module "components/ui/EmojiPickerPortal" {
    export default EmojiPickerPortal;
    function EmojiPickerPortal({ onEmojiClick, positionRef, data, ...props }: {
        [x: string]: any;
        onEmojiClick: any;
        positionRef: any;
        data?: typeof defaultData;
    }): import("react/jsx-runtime").JSX.Element;
    namespace EmojiPickerPortal {
        namespace propTypes {
            let onEmojiClick: PropTypes.Validator<(...args: any[]) => any>;
            let positionRef: PropTypes.Requireable<object>;
            let data: PropTypes.Requireable<any[]>;
            let autoFocus: PropTypes.Requireable<boolean>;
            let dynamicWidth: PropTypes.Requireable<boolean>;
            let emojiButtonColors: PropTypes.Requireable<string[]>;
            let emojiButtonRadius: PropTypes.Requireable<string>;
            let emojiButtonSize: PropTypes.Requireable<number>;
            let emojiSize: PropTypes.Requireable<number>;
            let emojiVersion: PropTypes.Requireable<number>;
            let exceptEmojis: PropTypes.Requireable<string[]>;
            let icons: PropTypes.Requireable<string>;
            let locale: PropTypes.Requireable<string>;
            let maxFrequentRows: PropTypes.Requireable<number>;
            let navPosition: PropTypes.Requireable<string>;
            let noCountryFlags: PropTypes.Requireable<boolean>;
            let noResultsEmoji: PropTypes.Requireable<string>;
            let perLine: PropTypes.Requireable<number>;
            let previewEmoji: PropTypes.Requireable<string>;
            let previewPosition: PropTypes.Requireable<string>;
            let searchPosition: PropTypes.Requireable<string>;
            let set: PropTypes.Requireable<string>;
            let setInstanceRef: PropTypes.Requireable<(...args: any[]) => any>;
            let skin: PropTypes.Requireable<number>;
            let skinTonePosition: PropTypes.Requireable<string>;
            let theme: PropTypes.Requireable<string>;
        }
        namespace defaultProps {
            let autoFocus_1: boolean;
            export { autoFocus_1 as autoFocus };
            let dynamicWidth_1: boolean;
            export { dynamicWidth_1 as dynamicWidth };
            let emojiButtonRadius_1: string;
            export { emojiButtonRadius_1 as emojiButtonRadius };
            let emojiButtonSize_1: number;
            export { emojiButtonSize_1 as emojiButtonSize };
            let emojiSize_1: number;
            export { emojiSize_1 as emojiSize };
            let icons_1: string;
            export { icons_1 as icons };
            let locale_1: string;
            export { locale_1 as locale };
            let maxFrequentRows_1: number;
            export { maxFrequentRows_1 as maxFrequentRows };
            let navPosition_1: string;
            export { navPosition_1 as navPosition };
            let noCountryFlags_1: boolean;
            export { noCountryFlags_1 as noCountryFlags };
            let noResultsEmoji_1: string;
            export { noResultsEmoji_1 as noResultsEmoji };
            let perLine_1: number;
            export { perLine_1 as perLine };
            let previewEmoji_1: any;
            export { previewEmoji_1 as previewEmoji };
            let previewPosition_1: string;
            export { previewPosition_1 as previewPosition };
            let searchPosition_1: string;
            export { searchPosition_1 as searchPosition };
            let set_1: string;
            export { set_1 as set };
            let skin_1: number;
            export { skin_1 as skin };
            let skinTonePosition_1: string;
            export { skinTonePosition_1 as skinTonePosition };
            let theme_1: string;
            export { theme_1 as theme };
        }
    }
    import defaultData from "@emoji-mart/data";
    import PropTypes from "prop-types";
}
declare module "plugins/KoenigNestedEditorPlugin" {
    import {ReactNode} from "react";
    export default KoenigNestedEditorPlugin;
    function KoenigNestedEditorPlugin({ autoFocus, focusNext, hasSettingsPanel, defaultKoenigEnterBehaviour }: {
        autoFocus: any;
        focusNext: any;
        hasSettingsPanel: any;
        defaultKoenigEnterBehaviour?: boolean;
    }): ReactNode;
}
declare module "components/KoenigNestedEditor" {
    export default KoenigNestedEditor;
    function KoenigNestedEditor({ initialEditor, initialEditorState, nodes, placeholderText, textClassName, placeholderClassName, autoFocus, focusNext, singleParagraph, hasSettingsPanel, defaultKoenigEnterBehaviour, hiddenFormats, dataTestId, children }: {
        initialEditor: any;
        initialEditorState: any;
        nodes?: string;
        placeholderText?: string;
        textClassName?: string;
        placeholderClassName?: string;
        autoFocus?: boolean;
        focusNext?: any;
        singleParagraph?: boolean;
        hasSettingsPanel?: boolean;
        defaultKoenigEnterBehaviour?: boolean;
        hiddenFormats?: any[];
        dataTestId: any;
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/CalloutCard" {
    export function CalloutCard({ color, isEditing, setShowEmojiPicker, toggleEmoji, hasEmoji, handleColorChange, changeEmoji, calloutEmoji, textEditor, textEditorInitialState, nodeKey, toggleEmojiPicker, showEmojiPicker }: {
        color: any;
        isEditing: any;
        setShowEmojiPicker: any;
        toggleEmoji: any;
        hasEmoji: any;
        handleColorChange: any;
        changeEmoji: any;
        calloutEmoji: any;
        textEditor: any;
        textEditorInitialState: any;
        nodeKey: any;
        toggleEmojiPicker: any;
        showEmojiPicker: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace CalloutCard {
        namespace propTypes {
            let color: PropTypes.Requireable<string>;
            let text: PropTypes.Requireable<string>;
            let hasEmoji: PropTypes.Requireable<boolean>;
            let placeholder: PropTypes.Requireable<string>;
            let isEditing: PropTypes.Requireable<boolean>;
            let updateText: PropTypes.Requireable<(...args: any[]) => any>;
            let calloutEmoji: PropTypes.Requireable<string>;
            let setShowEmojiPicker: PropTypes.Requireable<(...args: any[]) => any>;
            let toggleEmoji: PropTypes.Requireable<(...args: any[]) => any>;
            let handleColorChange: PropTypes.Requireable<(...args: any[]) => any>;
            let changeEmoji: PropTypes.Requireable<(...args: any[]) => any>;
            let textEditor: PropTypes.Requireable<object>;
            let textEditorInitialState: PropTypes.Requireable<object>;
            let nodeKey: PropTypes.Requireable<string>;
            let toggleEmojiPicker: PropTypes.Requireable<(...args: any[]) => any>;
            let showEmojiPicker: PropTypes.Requireable<boolean>;
        }
        namespace defaultProps {
            let color_1: string;
            export { color_1 as color };
            let calloutEmoji_1: string;
            export { calloutEmoji_1 as calloutEmoji };
            let hasEmoji_1: boolean;
            export { hasEmoji_1 as hasEmoji };
        }
    }
    export namespace CALLOUT_COLORS {
        let grey: string;
        let white: string;
        let blue: string;
        let green: string;
        let yellow: string;
        let red: string;
        let pink: string;
        let purple: string;
        let accent: string;
    }
    export namespace CALLOUT_TEXT_COLORS {
        export { TEXT_BLACK as grey };
        export { TEXT_BLACK as white };
        export { TEXT_BLACK as blue };
        export { TEXT_BLACK as green };
        export { TEXT_BLACK as yellow };
        export { TEXT_BLACK as red };
        export { TEXT_BLACK as pink };
        export { TEXT_BLACK as purple };
        let accent_1: string;
        export { accent_1 as accent };
    }
    export const calloutColorPicker: {
        label: string;
        name: string;
        color: string;
    }[];
    import PropTypes from "prop-types";
    const TEXT_BLACK: "text-black dark:text-grey-300 caret-black dark:caret-grey-300";
    export {};
}
declare module "nodes/CalloutNodeComponent" {
    export function CalloutNodeComponent({ nodeKey, textEditor, textEditorInitialState, backgroundColor, calloutEmoji }: {
        nodeKey: any;
        textEditor: any;
        textEditorInitialState: any;
        backgroundColor: any;
        calloutEmoji: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/CalloutNode" {
    export function $isCalloutNode(node: any): boolean;
    export const INSERT_CALLOUT_COMMAND: import("lexical").LexicalCommand<any>;
    export class CalloutNode extends BaseCalloutNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            shortcut: string;
        }[];
        constructor(dataset: {}, key: any);
        __calloutTextEditor: any;
        __calloutTextEditorInitialState: any;
        getIcon(): any;
        exportJSON(): any;
        getDataset(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    export function $createCalloutNode(dataset: any): CalloutNode;
    import { CalloutNode as BaseCalloutNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/cards/CollectionCard" {
    export function CollectionPost({ post, layout, columns, isPlaceholder, options, isLoading }: {
        post: any;
        layout: any;
        columns: any;
        isPlaceholder: any;
        options: any;
        isLoading: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace CollectionPost {
        namespace propTypes {
            let post: PropTypes.Requireable<object>;
            let layout: PropTypes.Requireable<string>;
            let options: PropTypes.Requireable<object>;
            let columns: PropTypes.Requireable<number>;
            let isPlaceholder: PropTypes.Requireable<boolean>;
            let isLoading: PropTypes.Requireable<boolean>;
        }
    }
    export function Collection({ posts, postCount, layout, columns, isLoading }: {
        posts: any;
        postCount: any;
        layout: any;
        columns: any;
        isLoading: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace Collection {
        export namespace propTypes_1 {
            export let posts: PropTypes.Requireable<any[]>;
            let layout_1: PropTypes.Requireable<string>;
            export { layout_1 as layout };
            export let postCount: PropTypes.Requireable<number>;
            let columns_1: PropTypes.Requireable<number>;
            export { columns_1 as columns };
            let isLoading_1: PropTypes.Requireable<boolean>;
            export { isLoading_1 as isLoading };
        }
        export { propTypes_1 as propTypes };
    }
    export function CollectionCard({ collection, collections, columns, layout, postCount, posts, handleCollectionChange, handleColumnChange, handleLayoutChange, handlePostCountChange, isEditing, isLoading, headerEditor, headerEditorInitialState }: {
        collection: any;
        collections: any;
        columns: any;
        layout: any;
        postCount: any;
        posts: any;
        handleCollectionChange: any;
        handleColumnChange: any;
        handleLayoutChange: any;
        handlePostCountChange: any;
        isEditing: any;
        isLoading: any;
        headerEditor: any;
        headerEditorInitialState: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace CollectionCard {
        export namespace propTypes_2 {
            export let collection: PropTypes.Requireable<string>;
            export let collections: PropTypes.Requireable<any[]>;
            let columns_2: PropTypes.Requireable<number>;
            export { columns_2 as columns };
            let layout_2: PropTypes.Requireable<string>;
            export { layout_2 as layout };
            let postCount_1: PropTypes.Requireable<number>;
            export { postCount_1 as postCount };
            let posts_1: PropTypes.Requireable<any[]>;
            export { posts_1 as posts };
            export let handleCollectionChange: PropTypes.Requireable<(...args: any[]) => any>;
            export let handleColumnChange: PropTypes.Requireable<(...args: any[]) => any>;
            export let handleLayoutChange: PropTypes.Requireable<(...args: any[]) => any>;
            export let handlePostCountChange: PropTypes.Requireable<(...args: any[]) => any>;
            export let handleRowChange: PropTypes.Requireable<(...args: any[]) => any>;
            export let isEditing: PropTypes.Requireable<boolean>;
            let isLoading_2: PropTypes.Requireable<boolean>;
            export { isLoading_2 as isLoading };
            export let headerEditor: PropTypes.Requireable<object>;
            export let headerEditorInitialState: PropTypes.Requireable<object>;
        }
        export { propTypes_2 as propTypes };
    }
    import PropTypes from "prop-types";
}
declare module "nodes/CollectionNodeComponent" {
    export function CollectionNodeComponent({ collection, columns, layout, nodeKey, postCount, headerEditor, headerEditorInitialState }: {
        collection: any;
        columns: any;
        layout: any;
        nodeKey: any;
        postCount: any;
        headerEditor: any;
        headerEditorInitialState: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/CollectionNode" {
    export function $isCollectionNode(node: any): boolean;
    export const INSERT_COLLECTION_COMMAND: import("lexical").LexicalCommand<any>;
    export class CollectionNode extends BaseCollectionNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            postType: string;
            isHidden: ({ config }: {
                config: any;
            }) => boolean;
            shortcut: string;
            insertParams: () => {
                header: string;
            };
        }[];
        constructor(dataset: {}, key: any);
        __headerEditor: any;
        __headerEditorInitialState: any;
        exportJSON(): any;
        getIcon(): any;
        getDataset(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    export function $createCollectionNode(dataset: any): CollectionNode;
    import { CollectionNode as BaseCollectionNode } from "@tryghost/kg-default-nodes";
}
declare module "plugins/ReplacementStringsPlugin" {
    import {ReactNode} from "react";
    export default function ReplacementStringsPlugin(): ReactNode;
}
declare module "components/ui/cards/EmailCtaCard" {
    export function EmailCtaCard({ alignment, buttonText, buttonUrl, handleSegmentChange, htmlEditor, htmlEditorInitialState, isEditing, segment, showDividers, showButton, toggleDividers, updateAlignment, updateShowButton, updateButtonText, updateButtonUrl }: {
        alignment: any;
        buttonText: any;
        buttonUrl: any;
        handleSegmentChange: any;
        htmlEditor: any;
        htmlEditorInitialState: any;
        isEditing: any;
        segment: any;
        showDividers: any;
        showButton: any;
        toggleDividers: any;
        updateAlignment: any;
        updateShowButton: any;
        updateButtonText: any;
        updateButtonUrl: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace EmailCtaCard {
        namespace propTypes {
            let alignment: PropTypes.Requireable<string>;
            let buttonText: PropTypes.Requireable<string>;
            let buttonUrl: PropTypes.Requireable<string>;
            let isEditing: PropTypes.Requireable<boolean>;
            let segment: PropTypes.Requireable<string>;
            let showButton: PropTypes.Requireable<boolean>;
            let showDividers: PropTypes.Requireable<boolean>;
            let updateAlignment: PropTypes.Requireable<(...args: any[]) => any>;
            let updateButtonText: PropTypes.Requireable<(...args: any[]) => any>;
            let updateButtonUrl: PropTypes.Requireable<(...args: any[]) => any>;
            let updateShowButton: PropTypes.Requireable<(...args: any[]) => any>;
            let toggleDividers: PropTypes.Requireable<(...args: any[]) => any>;
            let suggestedUrls: PropTypes.Requireable<any[]>;
            let handleSegmentChange: PropTypes.Requireable<(...args: any[]) => any>;
            let htmlEditor: PropTypes.Requireable<object>;
            let htmlEditorInitialState: PropTypes.Requireable<object>;
        }
        namespace defaultProps {
            let alignment_1: string;
            export { alignment_1 as alignment };
            let buttonText_1: string;
            export { buttonText_1 as buttonText };
            let buttonUrl_1: string;
            export { buttonUrl_1 as buttonUrl };
            let isEditing_1: boolean;
            export { isEditing_1 as isEditing };
            let segment_1: string;
            export { segment_1 as segment };
            let showButton_1: boolean;
            export { showButton_1 as showButton };
            let showDividers_1: boolean;
            export { showDividers_1 as showDividers };
            let suggestedUrls_1: any[];
            export { suggestedUrls_1 as suggestedUrls };
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/EmailCtaNodeComponent" {
    export function EmailCtaNodeComponent({ nodeKey, alignment, htmlEditor, htmlEditorInitialState, segment, showDividers, showButton, buttonText, buttonUrl }: {
        nodeKey: any;
        alignment: any;
        htmlEditor: any;
        htmlEditorInitialState: any;
        segment: any;
        showDividers: any;
        showButton: any;
        buttonText: any;
        buttonUrl: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/EmailCtaNode" {
    export function $createEmailCtaNode(): EmailCtaNode;
    export function $isEmailCtaNode(node: any): boolean;
    export const INSERT_EMAIL_CTA_COMMAND: import("lexical").LexicalCommand<any>;
    export class EmailCtaNode extends BaseEmailCtaNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            postType: string;
            shortcut: string;
        };
        constructor(dataset: {}, key: any);
        __htmlEditor: any;
        __htmlEditorInitialState: any;
        getIcon(): any;
        getDataset(): any;
        exportJSON(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
        isEmpty(): boolean;
    }
    import { EmailCtaNode as BaseEmailCtaNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/cards/EmailCard" {
    export function EmailCard({ htmlEditor, htmlEditorInitialState, isEditing }: {
        htmlEditor: any;
        htmlEditorInitialState: any;
        isEditing: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace EmailCard {
        namespace propTypes {
            let htmlEditor: PropTypes.Requireable<object>;
            let isEditing: PropTypes.Requireable<boolean>;
            let htmlEditorInitialState: PropTypes.Requireable<object>;
        }
        namespace defaultProps {
            let isEditing_1: boolean;
            export { isEditing_1 as isEditing };
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/EmailNodeComponent" {
    export function EmailNodeComponent({ nodeKey, htmlEditor, htmlEditorInitialState }: {
        nodeKey: any;
        htmlEditor: any;
        htmlEditorInitialState: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/EmailNode" {
    export function $isEmailNode(node: any): boolean;
    export const INSERT_EMAIL_COMMAND: import("lexical").LexicalCommand<any>;
    export class EmailNode extends BaseEmailNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            postType: string;
            shortcut: string;
        }[];
        constructor(dataset: {}, key: any);
        __htmlEditor: any;
        __htmlEditorInitialState: any;
        getIcon(): any;
        getDataset(): any;
        exportJSON(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
        isEmpty(): any;
    }
    export function $createEmailNode(dataset: any): EmailNode;
    import { EmailNode as BaseEmailNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/FileUploadForm" {
    export function FileUploadForm({ onFileChange, fileInputRef }: {
        onFileChange: any;
        fileInputRef: any;
    }): import("react/jsx-runtime").JSX.Element;
    export default FileUploadForm;
}
declare module "components/ui/cards/FileCard" {
    export function FileCard({ isPopulated, fileTitle, fileTitlePlaceholder, fileDesc, fileDescPlaceholder, fileName, fileSize, fileDragHandler, isEditing, fileInputRef, onFileChange, handleFileTitle, handleFileDesc, fileUploader, ...args }: {
        [x: string]: any;
        isPopulated: any;
        fileTitle: any;
        fileTitlePlaceholder: any;
        fileDesc: any;
        fileDescPlaceholder: any;
        fileName: any;
        fileSize: any;
        fileDragHandler: any;
        isEditing: any;
        fileInputRef: any;
        onFileChange: any;
        handleFileTitle: any;
        handleFileDesc: any;
        fileUploader: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace FileCard {
        namespace propTypes {
            let isPopulated: PropTypes.Requireable<boolean>;
            let fileTitle: PropTypes.Requireable<string>;
            let fileTitlePlaceholder: PropTypes.Requireable<string>;
            let fileDesc: PropTypes.Requireable<string>;
            let fileDescPlaceholder: PropTypes.Requireable<string>;
            let fileName: PropTypes.Requireable<string>;
            let fileSize: PropTypes.Requireable<string>;
            let fileDragHandler: PropTypes.Requireable<object>;
            let isEditing: PropTypes.Requireable<boolean>;
            let fileInputRef: PropTypes.Requireable<object>;
            let onFileChange: PropTypes.Requireable<(...args: any[]) => any>;
            let handleFileTitle: PropTypes.Requireable<(...args: any[]) => any>;
            let handleFileDesc: PropTypes.Requireable<(...args: any[]) => any>;
            let fileUploader: PropTypes.Requireable<object>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "utils/fileUploadHandler" {
    export function stripFileExtension(fileName: any): any;
    export function fileUploadHandler(files: any, nodeKey: any, editor: any, upload: any): Promise<void>;
}
declare module "nodes/FileNodeComponent" {
    export default FileNodeComponent;
    function FileNodeComponent({ fileDesc, fileDescPlaceholder, fileName, fileSize, fileTitle, fileTitlePlaceholder, fileSrc, nodeKey, triggerFileDialog, initialFile }: {
        fileDesc: any;
        fileDescPlaceholder: any;
        fileName: any;
        fileSize: any;
        fileTitle: any;
        fileTitlePlaceholder: any;
        fileSrc: any;
        nodeKey: any;
        triggerFileDialog: any;
        initialFile: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/FileNode" {
    export function $isFileNode(node: any): boolean;
    export const INSERT_FILE_COMMAND: import("lexical").LexicalCommand<any>;
    export class FileNode extends BaseFileNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            insertParams: {
                triggerFileDialog: boolean;
            };
            matches: string[];
            priority: number;
            shortcut: string;
        }[];
        static uploadType: string;
        constructor(dataset: {}, key: any);
        __triggerFileDialog: boolean;
        __initialFile: any;
        getIcon(): any;
        set triggerFileDialog(shouldTrigger: any);
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    export function $createFileNode(dataset: any): FileNode;
    import { FileNode as BaseFileNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/cards/HeaderCard/v2/HeaderCard" {
    export function HeaderCard({ alignment, buttonEnabled, buttonText, buttonUrl, showBackgroundImage, backgroundImageSrc, backgroundSize, backgroundColor, buttonColor, buttonTextColor, textColor, isEditing, fileUploader, handleAlignment, handleButtonText, handleButtonEnabled, handleShowBackgroundImage, handleHideBackgroundImage, handleClearBackgroundImage, handleBackgroundColor, handleButtonColor, handleLayout, handleTextColor, isPinturaEnabled, layout, onFileChange, openImageEditor, imageDragHandler, headerTextEditor, headerTextEditorInitialState, subheaderTextEditor, subheaderTextEditorInitialState, isSwapped, handleSwapLayout, handleBackgroundSize, handleButtonTextBlur, handleButtonUrlBlur, handleButtonUrl, setFileInputRef }: {
        alignment: any;
        buttonEnabled: any;
        buttonText: any;
        buttonUrl: any;
        showBackgroundImage: any;
        backgroundImageSrc: any;
        backgroundSize: any;
        backgroundColor: any;
        buttonColor: any;
        buttonTextColor: any;
        textColor: any;
        isEditing: any;
        fileUploader: any;
        handleAlignment: any;
        handleButtonText: any;
        handleButtonEnabled: any;
        handleShowBackgroundImage: any;
        handleHideBackgroundImage: any;
        handleClearBackgroundImage: any;
        handleBackgroundColor: any;
        handleButtonColor: any;
        handleLayout: any;
        handleTextColor: any;
        isPinturaEnabled: any;
        layout: any;
        onFileChange: any;
        openImageEditor: any;
        imageDragHandler: any;
        headerTextEditor: any;
        headerTextEditorInitialState: any;
        subheaderTextEditor: any;
        subheaderTextEditorInitialState: any;
        isSwapped: any;
        handleSwapLayout: any;
        handleBackgroundSize: any;
        handleButtonTextBlur: any;
        handleButtonUrlBlur: any;
        handleButtonUrl: any;
        setFileInputRef: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace HeaderCard {
        namespace propTypes {
            let alignment: PropTypes.Requireable<string>;
            let buttonColor: PropTypes.Requireable<string>;
            let buttonText: PropTypes.Requireable<string>;
            let buttonTextColor: PropTypes.Requireable<string>;
            let buttonEnabled: PropTypes.Requireable<boolean>;
            let buttonPlaceholder: PropTypes.Requireable<string>;
            let backgroundImageSrc: PropTypes.Requireable<string>;
            let backgroundSize: PropTypes.Requireable<string>;
            let backgroundColor: PropTypes.Requireable<string>;
            let textColor: PropTypes.Requireable<string>;
            let showBackgroundImage: PropTypes.Requireable<boolean>;
            let isEditing: PropTypes.Requireable<boolean>;
            let isPinturaEnabled: PropTypes.Requireable<boolean>;
            let fileUploader: PropTypes.Requireable<object>;
            let fileInputRef: PropTypes.Requireable<object>;
            let handleLayout: PropTypes.Requireable<(...args: any[]) => any>;
            let handleAlignment: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonText: PropTypes.Requireable<(...args: any[]) => any>;
            let handleClearBackgroundImage: PropTypes.Requireable<(...args: any[]) => any>;
            let handleBackgroundColor: PropTypes.Requireable<(...args: any[]) => any>;
            let handleShowBackgroundImage: PropTypes.Requireable<(...args: any[]) => any>;
            let handleHideBackgroundImage: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonColor: PropTypes.Requireable<(...args: any[]) => any>;
            let handleTextColor: PropTypes.Requireable<(...args: any[]) => any>;
            let layout: PropTypes.Requireable<string>;
            let openFilePicker: PropTypes.Requireable<(...args: any[]) => any>;
            let onFileChange: PropTypes.Requireable<(...args: any[]) => any>;
            let openImageEditor: PropTypes.Requireable<(...args: any[]) => any>;
            let imageDragHandler: PropTypes.Requireable<object>;
            let headerTextEditor: PropTypes.Requireable<object>;
            let headerTextEditorInitialState: PropTypes.Requireable<object>;
            let subheaderTextEditor: PropTypes.Requireable<object>;
            let subheaderTextEditorInitialState: PropTypes.Requireable<object>;
            let isSwapped: PropTypes.Requireable<boolean>;
            let handleSwapLayout: PropTypes.Requireable<(...args: any[]) => any>;
            let handleBackgroundSize: PropTypes.Requireable<(...args: any[]) => any>;
            let setFileInputRef: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonTextBlur: PropTypes.Requireable<(...args: any[]) => any>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/header/v2/HeaderNodeComponent" {
    export default HeaderNodeComponent;
    function HeaderNodeComponent({ alignment, backgroundColor, backgroundImageSrc, backgroundImageWidth, backgroundImageHeight, backgroundSize, buttonColor, buttonText, buttonTextColor, buttonUrl, buttonEnabled, nodeKey, header, headerTextEditor, headerTextEditorInitialState, layout, subheader, subheaderTextEditor, subheaderTextEditorInitialState, textColor, isSwapped, accentColor }: {
        alignment: any;
        backgroundColor: any;
        backgroundImageSrc: any;
        backgroundImageWidth: any;
        backgroundImageHeight: any;
        backgroundSize: any;
        buttonColor: any;
        buttonText: any;
        buttonTextColor: any;
        buttonUrl: any;
        buttonEnabled: any;
        nodeKey: any;
        header: any;
        headerTextEditor: any;
        headerTextEditorInitialState: any;
        layout: any;
        subheader: any;
        subheaderTextEditor: any;
        subheaderTextEditorInitialState: any;
        textColor: any;
        isSwapped: any;
        accentColor: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/BackgroundImagePicker" {
    export function BackgroundImagePicker({ onFileChange, backgroundImageSrc, type, handleClearBackgroundImage, fileInputRef, openFilePicker, isUploading, progress }: {
        onFileChange: any;
        backgroundImageSrc: any;
        type: any;
        handleClearBackgroundImage: any;
        fileInputRef: any;
        openFilePicker: any;
        isUploading: any;
        progress: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace BackgroundImagePicker {
        namespace propTypes {
            let backgroundImageSrc: PropTypes.Requireable<string>;
            let fileInputRef: PropTypes.Requireable<object>;
            let handleClearBackgroundImage: PropTypes.Requireable<(...args: any[]) => any>;
            let isUploading: PropTypes.Requireable<boolean>;
            let openFilePicker: PropTypes.Requireable<(...args: any[]) => any>;
            let progress: PropTypes.Requireable<number>;
            let onFileChange: PropTypes.Requireable<(...args: any[]) => any>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/cards/HeaderCard/v1/HeaderCard" {
    export function HeaderCard({ isEditing, size, subheader, button, buttonText, buttonUrl, handleColorSelector, handleSizeSelector, handleButtonText, handleButtonUrl, backgroundImageSrc, onFileChange, handleClearBackgroundImage, fileInputRef, openFilePicker, type, header, headerTextEditor, subheaderTextEditor, fileUploader, headerTextEditorInitialState, subheaderTextEditorInitialState, handleButtonToggle }: {
        isEditing: any;
        size: any;
        subheader: any;
        button: any;
        buttonText: any;
        buttonUrl: any;
        handleColorSelector: any;
        handleSizeSelector: any;
        handleButtonText: any;
        handleButtonUrl: any;
        backgroundImageSrc: any;
        onFileChange: any;
        handleClearBackgroundImage: any;
        fileInputRef: any;
        openFilePicker: any;
        type: any;
        header: any;
        headerTextEditor: any;
        subheaderTextEditor: any;
        fileUploader: any;
        headerTextEditorInitialState: any;
        subheaderTextEditorInitialState: any;
        handleButtonToggle: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace HeaderCard {
        namespace propTypes {
            let size: PropTypes.Requireable<string>;
            let type: PropTypes.Requireable<string>;
            let heading: PropTypes.Requireable<string>;
            let subheader: PropTypes.Requireable<string>;
            let button: PropTypes.Requireable<boolean>;
            let buttonText: PropTypes.Requireable<string>;
            let buttonUrl: PropTypes.Requireable<string>;
            let backgroundImageSrc: PropTypes.Requireable<string>;
            let isEditing: PropTypes.Requireable<boolean>;
            let isUploading: PropTypes.Requireable<boolean>;
            let progress: PropTypes.Requireable<number>;
            let fileUploader: PropTypes.Requireable<object>;
            let header: PropTypes.Requireable<string>;
            let fileInputRef: PropTypes.Requireable<object>;
            let handleSizeSelector: PropTypes.Requireable<(...args: any[]) => any>;
            let handleColorSelector: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonToggle: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonText: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonUrl: PropTypes.Requireable<(...args: any[]) => any>;
            let handleClearBackgroundImage: PropTypes.Requireable<(...args: any[]) => any>;
            let openFilePicker: PropTypes.Requireable<(...args: any[]) => any>;
            let onFileChange: PropTypes.Requireable<(...args: any[]) => any>;
            let headerTextEditor: PropTypes.Requireable<object>;
            let headerTextEditorInitialState: PropTypes.Requireable<object>;
            let subheaderTextEditor: PropTypes.Requireable<object>;
            let subheaderTextEditorInitialState: PropTypes.Requireable<object>;
        }
    }
    export namespace HEADER_COLORS {
        let dark: string;
        let light: string;
        let accent: string;
        let image: string;
    }
    export namespace HEADER_TEXT_COLORS {
        let dark_1: string;
        export { dark_1 as dark };
        let light_1: string;
        export { light_1 as light };
        let accent_1: string;
        export { accent_1 as accent };
        let image_1: string;
        export { image_1 as image };
    }
    import PropTypes from "prop-types";
}
declare module "nodes/header/v1/HeaderNodeComponent" {
    export default HeaderNodeComponent;
    function HeaderNodeComponent({ nodeKey, backgroundImageSrc, button, subheaderTextEditorInitialState, buttonText, buttonUrl, type, headerTextEditorInitialState, header, subheader, headerTextEditor, subheaderTextEditor, size }: {
        nodeKey: any;
        backgroundImageSrc: any;
        button: any;
        subheaderTextEditorInitialState: any;
        buttonText: any;
        buttonUrl: any;
        type: any;
        headerTextEditorInitialState: any;
        header: any;
        subheader: any;
        headerTextEditor: any;
        subheaderTextEditor: any;
        size: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/HeaderNode" {
    export function $isHeaderNode(node: any): boolean;
    export const INSERT_HEADER_COMMAND: import("lexical").LexicalCommand<any>;
    export class HeaderNode extends BaseHeaderNode {
        static kgMenu: ({
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            insertParams: () => {
                version: number;
            };
            isHidden: ({ config }: {
                config: any;
            }) => any;
            shortcut: string;
        } | {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            insertParams: () => {
                version: number;
            };
            shortcut: string;
            isHidden?: undefined;
        })[];
        constructor(dataset: {}, key: any);
        __headerTextEditor: any;
        __subheaderTextEditor: any;
        __headerTextEditorInitialState: any;
        __subheaderTextEditorInitialState: any;
        getIcon(): any;
        exportJSON(): any;
        getDataset(): any;
        getCardWidth(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
        isEmpty(): boolean;
    }
    export function $createHeaderNode(dataset: any): HeaderNode;
    import { HeaderNode as BaseHeaderNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/cards/HtmlCard/HtmlEditor" {
    export default function HtmlEditor({ darkMode, html, updateHtml }: {
        darkMode: any;
        html: any;
        updateHtml: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/HtmlCard" {
    export function HtmlCard({ html, updateHtml, isEditing, darkMode }: {
        html: any;
        updateHtml: any;
        isEditing: any;
        darkMode: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace HtmlCard {
        namespace propTypes {
            let html: PropTypes.Requireable<string>;
            let updateHtml: PropTypes.Requireable<(...args: any[]) => any>;
            let isEditing: PropTypes.Requireable<boolean>;
            let darkMode: PropTypes.Requireable<boolean>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/HtmlNodeComponent" {
    export function HtmlNodeComponent({ nodeKey, html }: {
        nodeKey: any;
        html: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/HtmlNode" {
    export function $createHtmlNode(dataset: any): HtmlNode;
    export function $isHtmlNode(node: any): boolean;
    export const INSERT_HTML_COMMAND: import("lexical").LexicalCommand<any>;
    export class HtmlNode extends BaseHtmlNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            shortcut: string;
        };
        getIcon(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    import { HtmlNode as BaseHtmlNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/Modal" {
    export function Modal({ isOpen, onClose, children }: {
        isOpen: any;
        onClose: any;
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace Modal {
        namespace propTypes {
            let isOpen: PropTypes.Requireable<boolean>;
            let onClose: PropTypes.Requireable<(...args: any[]) => any>;
            let children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "components/ui/cards/MarkdownCard/MarkdownHelpDialog" {
    export function Td({ value }: {
        value: any;
    }): import("react/jsx-runtime").JSX.Element;
    export default function MarkdownHelpDialog(props: any): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/MarkdownCard/MarkdownImageUploader" {
    export default function MarkdownImageUploader({ onChange, inputRef, progress, loading, filesNumber, errors }: {
        onChange: any;
        inputRef: any;
        progress: any;
        loading: any;
        filesNumber: any;
        errors?: any[];
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "utils/ctrlOrCmd" {
    const _default: "Cmd" | "Ctrl";
    export default _default;
}
declare module "components/ui/cards/MarkdownCard/useMarkdownImageUploader" {
    export default function useMarkdownImageUploader(editor: any, imageUploader: any): {
        openImageUploadDialog: () => void;
        uploadImages: (event: any) => Promise<void>;
        insertUnsplashImage: ({ src, alt, caption }: {
            src: any;
            alt: any;
            caption: any;
        }) => void;
        imageInputRef: import("react").MutableRefObject<any>;
        progress: any;
        errors: any;
        isLoading: any;
        filesNumber: any;
    };
}
declare module "components/ui/cards/MarkdownCard/MarkdownEditor" {
    export default function MarkdownEditor({ markdown, updateMarkdown, imageUploader, unsplashConf, autofocus, placeholder }: {
        markdown: any;
        updateMarkdown: any;
        imageUploader: any;
        unsplashConf: any;
        autofocus?: boolean;
        placeholder?: string;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/MarkdownCard" {
    export function MarkdownCard({ markdown, updateMarkdown, isEditing, imageUploader, unsplashConf }: {
        markdown?: string;
        updateMarkdown: any;
        isEditing: any;
        imageUploader: any;
        unsplashConf: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace MarkdownCard {
        namespace propTypes {
            let markdown: PropTypes.Requireable<string>;
            let updateMarkdown: PropTypes.Requireable<(...args: any[]) => any>;
            let isEditing: PropTypes.Requireable<boolean>;
            let imageUploader: PropTypes.Requireable<(...args: any[]) => any>;
            let unsplashConf: PropTypes.Requireable<object>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/MarkdownNodeComponent" {
    export function MarkdownNodeComponent({ nodeKey, markdown }: {
        nodeKey: any;
        markdown: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/MarkdownNode" {
    export function $createMarkdownNode(dataset: any): MarkdownNode;
    export function $isMarkdownNode(node: any): boolean;
    export const INSERT_MARKDOWN_COMMAND: import("lexical").LexicalCommand<any>;
    export class MarkdownNode extends BaseMarkdownNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            shortcut: string;
        };
        getIcon(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    import { MarkdownNode as BaseMarkdownNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/cards/PaywallCard" {
    export function PaywallCard(): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/PaywallNode" {
    export function $createPaywallNode(): PaywallNode;
    export function $isPaywallNode(node: any): boolean;
    export const INSERT_PAYWALL_COMMAND: import("lexical").LexicalCommand<any>;
    export class PaywallNode extends BasePaywallNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            shortcut: string;
        };
        getIcon(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    import { PaywallNode as BasePaywallNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/cards/ProductCard/ProductCardImage" {
    export function ProductCardImage({ imgSrc, imgUploader, imgDragHandler, onImgChange, imgMimeTypes, onRemoveImage, isPinturaEnabled, openImageEditor, isEditing }: {
        imgSrc: any;
        imgUploader?: {};
        imgDragHandler?: {};
        onImgChange: any;
        imgMimeTypes: any;
        onRemoveImage: any;
        isPinturaEnabled: any;
        openImageEditor: any;
        isEditing: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/ProductCard/RatingButton" {
    export function RatingButton({ rating, onRatingChange }: {
        rating: any;
        onRatingChange: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/ProductCard" {
    export function ProductCard({ isEditing, imgSrc, isButtonEnabled, buttonText, buttonUrl, rating, isRatingEnabled, onButtonToggle, onButtonTextChange, onButtonUrlChange, onRatingToggle, imgDragHandler, onImgChange, imgMimeTypes, imgUploader, isPinturaEnabled, openImageEditor, onRemoveImage, titleEditor, titleEditorInitialState, descriptionEditor, descriptionEditorInitialState, onRatingChange }: {
        isEditing: any;
        imgSrc: any;
        isButtonEnabled: any;
        buttonText: any;
        buttonUrl: any;
        rating: any;
        isRatingEnabled: any;
        onButtonToggle: any;
        onButtonTextChange: any;
        onButtonUrlChange: any;
        onRatingToggle: any;
        imgDragHandler: any;
        onImgChange: any;
        imgMimeTypes: any;
        imgUploader: any;
        isPinturaEnabled: any;
        openImageEditor: any;
        onRemoveImage: any;
        titleEditor: any;
        titleEditorInitialState: any;
        descriptionEditor: any;
        descriptionEditorInitialState: any;
        onRatingChange: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace ProductCard {
        namespace propTypes {
            let isEditing: PropTypes.Requireable<boolean>;
            let imgSrc: PropTypes.Requireable<string>;
            let isButtonEnabled: PropTypes.Requireable<boolean>;
            let buttonText: PropTypes.Requireable<string>;
            let buttonUrl: PropTypes.Requireable<string>;
            let isRatingEnabled: PropTypes.Requireable<boolean>;
            let rating: PropTypes.Requireable<number>;
            let onButtonToggle: PropTypes.Requireable<(...args: any[]) => any>;
            let onButtonTextChange: PropTypes.Requireable<(...args: any[]) => any>;
            let onButtonUrlChange: PropTypes.Requireable<(...args: any[]) => any>;
            let onRatingToggle: PropTypes.Requireable<(...args: any[]) => any>;
            let onImgChange: PropTypes.Requireable<(...args: any[]) => any>;
            let onRemoveImage: PropTypes.Requireable<(...args: any[]) => any>;
            let imgDragHandler: PropTypes.Requireable<object>;
            let imgUploader: PropTypes.Requireable<object>;
            let imgMimeTypes: PropTypes.Requireable<any[]>;
            let isPinturaEnabled: PropTypes.Requireable<boolean>;
            let openImageEditor: PropTypes.Requireable<(...args: any[]) => any>;
            let title: PropTypes.Requireable<string>;
            let description: PropTypes.Requireable<string>;
            let titleEditor: PropTypes.Requireable<object>;
            let titleEditorInitialState: PropTypes.Requireable<object>;
            let descriptionEditor: PropTypes.Requireable<object>;
            let descriptionEditorInitialState: PropTypes.Requireable<object>;
            let onRatingChange: PropTypes.Requireable<(...args: any[]) => any>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/ProductNodeComponent" {
    export function ProductNodeComponent({ nodeKey, buttonText, buttonUrl, imgHeight, imgSrc, imgWidth, isButtonEnabled, isRatingEnabled, starRating, title, titleEditor, titleEditorInitialState, descriptionEditor, descriptionEditorInitialState, description }: {
        nodeKey: any;
        buttonText: any;
        buttonUrl: any;
        imgHeight: any;
        imgSrc: any;
        imgWidth: any;
        isButtonEnabled: any;
        isRatingEnabled: any;
        starRating: any;
        title: any;
        titleEditor: any;
        titleEditorInitialState: any;
        descriptionEditor: any;
        descriptionEditorInitialState: any;
        description: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/ProductNode" {
    export function $isProductNode(node: any): boolean;
    export const INSERT_PRODUCT_COMMAND: import("lexical").LexicalCommand<any>;
    export class ProductNode extends BaseProductNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            shortcut: string;
        }[];
        constructor(dataset: {}, key: any);
        __productTitleEditor: any;
        __productTitleEditorInitialState: any;
        __productDescriptionEditor: any;
        __productDescriptionEditorInitialState: any;
        getIcon(): any;
        getDataset(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    export function $createProductNode(dataset: any): ProductNode;
    import { ProductNode as BaseProductNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/SubscribeForm" {
    export function SubscribeForm({ dataTestId, placeholder, value, buttonSize, buttonText, buttonStyle, onChange, onFocus, onBlur, disabled }: {
        dataTestId: any;
        placeholder: any;
        value: any;
        buttonSize: any;
        buttonText: any;
        buttonStyle: any;
        onChange: any;
        onFocus: any;
        onBlur: any;
        disabled: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/cards/SignupCard" {
    export function SignupCard({ alignment, buttonText, showBackgroundImage, backgroundImageSrc, backgroundSize, backgroundColor, buttonColor, buttonTextColor, textColor, isEditing, fileUploader, handleAlignment, handleButtonText, handleShowBackgroundImage, handleHideBackgroundImage, handleClearBackgroundImage, handleBackgroundColor, handleButtonColor, handleLayout, handleTextColor, isPinturaEnabled, labels, layout, availableLabels, handleLabels, onFileChange, openImageEditor, imageDragHandler, headerTextEditor, headerTextEditorInitialState, subheaderTextEditor, subheaderTextEditorInitialState, disclaimerTextEditor, disclaimerTextEditorInitialState, isSwapped, handleSwapLayout, handleBackgroundSize, handleButtonTextBlur, setFileInputRef }: {
        alignment: any;
        buttonText: any;
        showBackgroundImage: any;
        backgroundImageSrc: any;
        backgroundSize: any;
        backgroundColor: any;
        buttonColor: any;
        buttonTextColor: any;
        textColor: any;
        isEditing: any;
        fileUploader: any;
        handleAlignment: any;
        handleButtonText: any;
        handleShowBackgroundImage: any;
        handleHideBackgroundImage: any;
        handleClearBackgroundImage: any;
        handleBackgroundColor: any;
        handleButtonColor: any;
        handleLayout: any;
        handleTextColor: any;
        isPinturaEnabled: any;
        labels: any;
        layout: any;
        availableLabels: any;
        handleLabels: any;
        onFileChange: any;
        openImageEditor: any;
        imageDragHandler: any;
        headerTextEditor: any;
        headerTextEditorInitialState: any;
        subheaderTextEditor: any;
        subheaderTextEditorInitialState: any;
        disclaimerTextEditor: any;
        disclaimerTextEditorInitialState: any;
        isSwapped: any;
        handleSwapLayout: any;
        handleBackgroundSize: any;
        handleButtonTextBlur: any;
        setFileInputRef: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace SignupCard {
        namespace propTypes {
            let alignment: PropTypes.Requireable<string>;
            let buttonColor: PropTypes.Requireable<string>;
            let buttonText: PropTypes.Requireable<string>;
            let buttonTextColor: PropTypes.Requireable<string>;
            let buttonPlaceholder: PropTypes.Requireable<string>;
            let backgroundImageSrc: PropTypes.Requireable<string>;
            let backgroundSize: PropTypes.Requireable<string>;
            let backgroundColor: PropTypes.Requireable<string>;
            let textColor: PropTypes.Requireable<string>;
            let showBackgroundImage: PropTypes.Requireable<boolean>;
            let isEditing: PropTypes.Requireable<boolean>;
            let isPinturaEnabled: PropTypes.Requireable<boolean>;
            let fileUploader: PropTypes.Requireable<object>;
            let fileInputRef: PropTypes.Requireable<object>;
            let handleLayout: PropTypes.Requireable<(...args: any[]) => any>;
            let handleAlignment: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonText: PropTypes.Requireable<(...args: any[]) => any>;
            let handleClearBackgroundImage: PropTypes.Requireable<(...args: any[]) => any>;
            let handleBackgroundColor: PropTypes.Requireable<(...args: any[]) => any>;
            let handleShowBackgroundImage: PropTypes.Requireable<(...args: any[]) => any>;
            let handleHideBackgroundImage: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonColor: PropTypes.Requireable<(...args: any[]) => any>;
            let handleLabels: PropTypes.Requireable<(...args: any[]) => any>;
            let handleTextColor: PropTypes.Requireable<(...args: any[]) => any>;
            let labels: PropTypes.Requireable<string[]>;
            let layout: PropTypes.Requireable<string>;
            let availableLabels: PropTypes.Requireable<string[]>;
            let openFilePicker: PropTypes.Requireable<(...args: any[]) => any>;
            let onFileChange: PropTypes.Requireable<(...args: any[]) => any>;
            let openImageEditor: PropTypes.Requireable<(...args: any[]) => any>;
            let imageDragHandler: PropTypes.Requireable<object>;
            let headerTextEditor: PropTypes.Requireable<object>;
            let headerTextEditorInitialState: PropTypes.Requireable<object>;
            let subheaderTextEditor: PropTypes.Requireable<object>;
            let subheaderTextEditorInitialState: PropTypes.Requireable<object>;
            let disclaimerTextEditor: PropTypes.Requireable<object>;
            let disclaimerTextEditorInitialState: PropTypes.Requireable<object>;
            let isSwapped: PropTypes.Requireable<boolean>;
            let handleSwapLayout: PropTypes.Requireable<(...args: any[]) => any>;
            let handleBackgroundSize: PropTypes.Requireable<(...args: any[]) => any>;
            let setFileInputRef: PropTypes.Requireable<(...args: any[]) => any>;
            let handleButtonTextBlur: PropTypes.Requireable<(...args: any[]) => any>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/SignupNodeComponent" {
    export default SignupNodeComponent;
    function SignupNodeComponent({ alignment, backgroundColor, backgroundImageSrc, backgroundSize, buttonColor, buttonText, buttonTextColor, nodeKey, disclaimer, disclaimerTextEditor, disclaimerTextEditorInitialState, header, headerTextEditor, headerTextEditorInitialState, labels, layout, subheader, subheaderTextEditor, subheaderTextEditorInitialState, textColor, isSwapped }: {
        alignment: any;
        backgroundColor: any;
        backgroundImageSrc: any;
        backgroundSize: any;
        buttonColor: any;
        buttonText: any;
        buttonTextColor: any;
        nodeKey: any;
        disclaimer: any;
        disclaimerTextEditor: any;
        disclaimerTextEditorInitialState: any;
        header: any;
        headerTextEditor: any;
        headerTextEditorInitialState: any;
        labels: any;
        layout: any;
        subheader: any;
        subheaderTextEditor: any;
        subheaderTextEditorInitialState: any;
        textColor: any;
        isSwapped: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/SignupNode" {
    export function $isSignupNode(node: any): boolean;
    export const INSERT_SIGNUP_COMMAND: any;
    export class SignupNode extends BaseSignupNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: any;
            matches: string[];
            isHidden: ({ config }: {
                config: any;
            }) => boolean;
            insertParams: ({ config }: {
                config: any;
            }) => {
                header: string;
                subheader: any;
                disclaimer: string;
            };
            shortcut: string;
        };
        constructor(dataset: {}, key: any);
        __disclaimerTextEditor: any;
        __disclaimerTextEditorInitialState: any;
        __headerTextEditor: any;
        __headerTextEditorInitialState: any;
        __subheaderTextEditor: any;
        __subheaderTextEditorInitialState: any;
        getIcon(): any;
        exportJSON(): any;
        createDOM(): HTMLDivElement;
        getDataset(): any;
        getCardWidth(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
        isEmpty(): any;
    }
    export function $createSignupNode(dataset: any): SignupNode;
    import { SignupNode as BaseSignupNode } from "@tryghost/kg-default-nodes";
}
declare module "components/ui/cards/ToggleCard" {
    export function ToggleCard({ contentEditor, contentEditorInitialState, contentPlaceholder, headingEditor, headingEditorInitialState, headingPlaceholder, isEditing }: {
        contentEditor: any;
        contentEditorInitialState: any;
        contentPlaceholder: any;
        headingEditor: any;
        headingEditorInitialState: any;
        headingPlaceholder: any;
        isEditing: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace ToggleCard {
        namespace propTypes {
            let contentEditor: PropTypes.Requireable<object>;
            let contentPlaceholder: PropTypes.Requireable<string>;
            let headingEditor: PropTypes.Requireable<object>;
            let headingPlaceholder: PropTypes.Requireable<string>;
            let isEditing: PropTypes.Requireable<boolean>;
            let contentEditorInitialState: PropTypes.Requireable<object>;
            let headingEditorInitialState: PropTypes.Requireable<object>;
        }
        namespace defaultProps {
            let contentPlaceholder_1: string;
            export { contentPlaceholder_1 as contentPlaceholder };
            let headingPlaceholder_1: string;
            export { headingPlaceholder_1 as headingPlaceholder };
            let isEditing_1: boolean;
            export { isEditing_1 as isEditing };
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/ToggleNodeComponent" {
    export function ToggleNodeComponent({ nodeKey, headingEditor, headingEditorInitialState, contentEditor, contentEditorInitialState }: {
        nodeKey: any;
        headingEditor: any;
        headingEditorInitialState: any;
        contentEditor: any;
        contentEditorInitialState: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/ToggleNode" {
    export function $isToggleNode(node: any): boolean;
    export const INSERT_TOGGLE_COMMAND: import("lexical").LexicalCommand<any>;
    export class ToggleNode extends BaseToggleNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            matches: string[];
            priority: number;
            shortcut: string;
        }[];
        constructor(dataset: {}, key: any);
        __headingEditor: any;
        __headingEditorInitialState: any;
        __contentEditor: any;
        __contentEditorInitialState: any;
        getIcon(): any;
        getDataset(): any;
        exportJSON(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
        isEmpty(): any;
    }
    export function $createToggleNode(dataset: any): ToggleNode;
    import { ToggleNode as BaseToggleNode } from "@tryghost/kg-default-nodes";
}
declare module "utils/extractVideoMetadata" {
    export default function extractVideoMetadata(file: any): Promise<any>;
}
declare module "components/ui/cards/VideoCard" {
    export function VideoCard({ captionEditor, captionEditorInitialState, isSelected, isEditing, ...props }: {
        [x: string]: any;
        captionEditor: any;
        captionEditorInitialState: any;
        isSelected: any;
        isEditing: any;
    }): import("react/jsx-runtime").JSX.Element;
    export namespace VideoCard {
        namespace propTypes {
            let captionEditor: PropTypes.Requireable<object>;
            let captionEditorInitialState: PropTypes.Requireable<object>;
            let isSelected: PropTypes.Requireable<boolean>;
            let isEditing: PropTypes.Requireable<boolean>;
        }
    }
    import PropTypes from "prop-types";
}
declare module "nodes/VideoNodeComponent" {
    export function VideoNodeComponent({ nodeKey, thumbnail, customThumbnail, captionEditor, captionEditorInitialState, totalDuration, cardWidth, triggerFileDialog, isLoopChecked, initialFile }: {
        nodeKey: any;
        thumbnail: any;
        customThumbnail: any;
        captionEditor: any;
        captionEditorInitialState: any;
        totalDuration: any;
        cardWidth: any;
        triggerFileDialog: any;
        isLoopChecked: any;
        initialFile: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "nodes/VideoNode" {
    export function $isVideoNode(node: any): boolean;
    export const INSERT_VIDEO_COMMAND: import("lexical").LexicalCommand<any>;
    export class VideoNode extends BaseVideoNode {
        static kgMenu: {
            label: string;
            desc: string;
            Icon: any;
            insertCommand: import("lexical").LexicalCommand<any>;
            insertParams: {
                triggerFileDialog: boolean;
            };
            matches: string[];
            priority: number;
            shortcut: string;
        }[];
        static uploadType: string;
        constructor(dataset: {}, key: any);
        __triggerFileDialog: boolean;
        __initialFile: any;
        __captionEditor: any;
        __captionEditorInitialState: any;
        getIcon(): any;
        set triggerFileDialog(shouldTrigger: any);
        getDataset(): any;
        decorate(): import("react/jsx-runtime").JSX.Element;
    }
    export function $createVideoNode(dataset: any): VideoNode;
    import { VideoNode as BaseVideoNode } from "@tryghost/kg-default-nodes";
}
declare module "nodes/DefaultNodes" {
    export default DEFAULT_NODES;
    const DEFAULT_NODES: (typeof AsideNode | typeof LinkNode | typeof TKNode | typeof CodeBlockNode | typeof BookmarkNode | typeof EmbedNode | typeof GalleryNode | typeof ImageNode | typeof HeadingNode | typeof QuoteNode | typeof ListNode | typeof HorizontalRuleNode | typeof ExtendedTextNode | typeof AudioNode | typeof ButtonNode | typeof ListItemNode | typeof CalloutNode | typeof CollectionNode | typeof EmailCtaNode | typeof EmailNode | typeof HeaderNode | typeof MarkdownNode | typeof PaywallNode | typeof ProductNode | typeof SignupNode | typeof ToggleNode | typeof VideoNode | typeof extendedTextNodeReplacement | typeof ExtendedHeadingNode | typeof extendedHeadingNodeReplacement | typeof ExtendedQuoteNode | typeof extendedQuoteNodeReplacement)[];
    import { AsideNode } from "nodes/AsideNode";
    import { LinkNode } from "@lexical/link";
    import { TKNode } from "@tryghost/kg-default-nodes";
    import { CodeBlockNode } from "nodes/CodeBlockNode";
    import { BookmarkNode } from "nodes/BookmarkNode";
    import { EmbedNode } from "nodes/EmbedNode";
    import { GalleryNode } from "nodes/GalleryNode";
    import { ImageNode } from "nodes/ImageNode";
    import { HeadingNode } from "@lexical/rich-text";
    import { QuoteNode } from "@lexical/rich-text";
    import { ListNode } from "@lexical/list";
    import { HorizontalRuleNode } from "nodes/HorizontalRuleNode";
    import { ExtendedTextNode } from "@tryghost/kg-default-nodes";
    import { AudioNode } from "nodes/AudioNode";
    import { ButtonNode } from "nodes/ButtonNode";
    import { ListItemNode } from "@lexical/list";
    import { CalloutNode } from "nodes/CalloutNode";
    import { CollectionNode } from "nodes/CollectionNode";
    import { EmailCtaNode } from "nodes/EmailCtaNode";
    import { EmailNode } from "nodes/EmailNode";
    import { HeaderNode } from "nodes/HeaderNode";
    import { MarkdownNode } from "nodes/MarkdownNode";
    import { PaywallNode } from "nodes/PaywallNode";
    import { ProductNode } from "nodes/ProductNode";
    import { SignupNode } from "nodes/SignupNode";
    import { ToggleNode } from "nodes/ToggleNode";
    import { VideoNode } from "nodes/VideoNode";
    import { extendedTextNodeReplacement } from "@tryghost/kg-default-nodes";
    import { ExtendedHeadingNode } from "@tryghost/kg-default-nodes";
    import { extendedHeadingNodeReplacement } from "@tryghost/kg-default-nodes";
    import { ExtendedQuoteNode } from "@tryghost/kg-default-nodes";
    import { extendedQuoteNodeReplacement } from "@tryghost/kg-default-nodes";
}
declare module "themes/default" {
    export default defaultTheme;
    namespace defaultTheme {
        export let paragraph: any;
        export namespace heading {
            let h1: any;
            let h2: any;
            let h3: any;
            let h4: any;
            let h5: any;
            let h6: any;
        }
        export let quote: any;
        export let aside: any;
        export namespace list {
            export namespace nested {
                let listitem: string;
            }
            export let ol: any;
            export let ul: any;
            let listitem_1: any;
            export { listitem_1 as listitem };
        }
        export let link: any;
        export namespace text {
            let bold: any;
            let italic: string;
            let overflowed: any;
            let hashtag: any;
            let underline: string;
            let strikethrough: string;
            let underlinestrikethrough: any;
            let code: any;
        }
        let code_1: any;
        export { code_1 as code };
        export let tkHighlighted: string;
    }
}
import type providers from '../src/utils/multiplayer/providers'
declare module "components/KoenigComposer" {
    export default KoenigComposer;
    function KoenigComposer({ initialEditorState, nodes, onError, fileUploader, cardConfig, darkMode, enableMultiplayer, isTKEnabled, multiplayerEndpoint, multiplayerDebug, multiplayerDocId, multiplayerUsername, multiplayerProvider, children }: {
        initialEditorState: any;
        nodes?: (typeof import("nodes/AsideNode").AsideNode | typeof import("@lexical/link").LinkNode | typeof import("@tryghost/kg-default-nodes").TKNode | typeof import("nodes/CodeBlockNode").CodeBlockNode | typeof import("nodes/BookmarkNode").BookmarkNode | typeof import("nodes/EmbedNode").EmbedNode | typeof import("nodes/GalleryNode").GalleryNode | typeof import("nodes/ImageNode").ImageNode | typeof import("@lexical/rich-text").HeadingNode | typeof import("@lexical/rich-text").QuoteNode | typeof import("@lexical/list").ListNode | typeof import("nodes/HorizontalRuleNode").HorizontalRuleNode | typeof import("@tryghost/kg-default-nodes").ExtendedTextNode | typeof import("nodes/AudioNode").AudioNode | typeof import("nodes/ButtonNode").ButtonNode | typeof import("@lexical/list").ListItemNode | typeof import("nodes/CalloutNode").CalloutNode | typeof import("nodes/CollectionNode").CollectionNode | typeof import("nodes/EmailCtaNode").EmailCtaNode | typeof import("nodes/EmailNode").EmailNode | typeof import("nodes/HeaderNode").HeaderNode | typeof import("nodes/MarkdownNode").MarkdownNode | typeof import("nodes/PaywallNode").PaywallNode | typeof import("nodes/ProductNode").ProductNode | typeof import("nodes/SignupNode").SignupNode | typeof import("nodes/ToggleNode").ToggleNode | typeof import("nodes/VideoNode").VideoNode | typeof import("@tryghost/kg-default-nodes").extendedTextNodeReplacement | typeof import("@tryghost/kg-default-nodes").ExtendedHeadingNode | typeof import("@tryghost/kg-default-nodes").extendedHeadingNodeReplacement | typeof import("@tryghost/kg-default-nodes").ExtendedQuoteNode | typeof import("@tryghost/kg-default-nodes").extendedQuoteNodeReplacement)[];
        onError?: typeof defaultOnError;
        fileUploader?: {};
        cardConfig?: {};
        darkMode?: boolean;
        enableMultiplayer?: boolean;
        isTKEnabled: any;
        multiplayerEndpoint: any;
        multiplayerDebug?: boolean;
        multiplayerDocId: any;
        multiplayerUsername: any;
        multiplayerProvider: 'y-websocket' | 'y-socket.io'
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
    function defaultOnError(error: any): void;
}
declare module "plugins/CollectionPlugin" {
    export function CollectionPlugin(): any;
    export default CollectionPlugin;
}
declare module "plugins/EmEnDashPlugin" {
    export function EmEnDashPlugin(): any;
    export default EmEnDashPlugin;
}
declare module "plugins/HorizontalRulePlugin" {
    export function HorizontalRulePlugin(): any;
    export default HorizontalRulePlugin;
}
declare module "plugins/HtmlPlugin" {
    export function HtmlPlugin(): any;
    export default HtmlPlugin;
}
declare module "plugins/ImagePlugin" {
    export function ImagePlugin(): any;
    export default ImagePlugin;
}
declare module "plugins/MarkdownPlugin" {
    export function MarkdownPlugin(): any;
    export default MarkdownPlugin;
}
declare module "plugins/AudioPlugin" {
    export function AudioPlugin(): any;
    export default AudioPlugin;
}
declare module "plugins/BookmarkPlugin" {
    export function BookmarkPlugin(): any;
    export default BookmarkPlugin;
}
declare module "plugins/ButtonPlugin" {
    export function ButtonPlugin(): any;
    export default ButtonPlugin;
}
declare module "plugins/CalloutPlugin" {
    export function CalloutPlugin(): any;
    export default CalloutPlugin;
}
declare module "components/ui/CardMenu" {
    export function CardMenuSection({ label, children, ...props }: {
        [x: string]: any;
        label: any;
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function CardMenuItem({ label, shortcut, desc, isSelected, scrollToItem, onClick, Icon, ...props }: {
        [x: string]: any;
        label: any;
        shortcut: any;
        desc: any;
        isSelected: any;
        scrollToItem: any;
        onClick: any;
        Icon: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function CardSnippetItem({ label, isSelected, scrollToItem, Icon, onRemove, closeMenu, ...props }: {
        [x: string]: any;
        label: any;
        isSelected: any;
        scrollToItem: any;
        Icon: any;
        onRemove: any;
        closeMenu: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function CardMenu({ menu, insert, selectedItemIndex, scrollToSelectedItem, closeMenu }: {
        menu?: Map<any, any>;
        insert?: () => void;
        selectedItemIndex: any;
        scrollToSelectedItem: any;
        closeMenu: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/PlusMenu" {
    export function PlusButton({ onClick }: {
        onClick: any;
    }): import("react/jsx-runtime").JSX.Element;
    export function PlusMenu({ children }: {
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "plugins/KoenigSnippetPlugin" {
    export const INSERT_SNIPPET_COMMAND: import("lexical").LexicalCommand<any>;
    export function KoenigSnippetPlugin(): any;
    export default KoenigSnippetPlugin;
}
declare module "utils/buildCardMenu" {
    export function buildCardMenu(nodes: any, { query, config }?: {
        query: any;
        config: any;
    }): {
        menu: Map<any, any>;
        maxItemIndex: number;
    };
}
declare module "plugins/PlusCardMenuPlugin" {
    export default function PlusCardMenuPlugin(): import("react/jsx-runtime").JSX.Element;
}
declare module "components/ui/SlashMenu" {
    export function SlashMenu({ children }: {
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "plugins/SlashCardMenuPlugin" {
    export default function SlashCardMenuPlugin(): import("react/jsx-runtime").JSX.Element;
}
declare module "plugins/CardMenuPlugin" {
    export function CardMenuPlugin(): import("react/jsx-runtime").JSX.Element;
    export default CardMenuPlugin;
}
declare module "plugins/EmailCtaPlugin" {
    export function EmailCtaPlugin(): any;
    export default EmailCtaPlugin;
}
declare module "plugins/EmailPlugin" {
    export function EmailPlugin(): any;
    export default EmailPlugin;
}
declare module "plugins/EmbedPlugin" {
    export function EmbedPlugin(): any;
    export default EmbedPlugin;
}
declare module "plugins/FilePlugin" {
    export function FilePlugin(): any;
    export default FilePlugin;
}
declare module "plugins/GalleryPlugin" {
    export function GalleryPlugin(): any;
    export default GalleryPlugin;
}
declare module "plugins/HeaderPlugin" {
    export function HeaderPlugin(): any;
    export default HeaderPlugin;
}
declare module "plugins/PaywallPlugin" {
    export function PaywallPlugin(): any;
    export default PaywallPlugin;
}
declare module "plugins/ProductPlugin" {
    export function ProductPlugin(): any;
    export default ProductPlugin;
}
declare module "plugins/SignupPlugin" {
    export function SignupPlugin(): any;
    export default SignupPlugin;
}
declare module "plugins/TogglePlugin" {
    export function TogglePlugin(): any;
    export default TogglePlugin;
}
declare module "plugins/VideoPlugin" {
    export function VideoPlugin(): any;
    export default VideoPlugin;
}
declare module "plugins/AllDefaultPlugins" {
    export function AllDefaultPlugins(): import("react/jsx-runtime").JSX.Element;
    export default AllDefaultPlugins;
}
declare module "components/KoenigEditor" {
    export default KoenigEditor;
    function KoenigEditor({ onChange, children, ...props }: {
        [x: string]: any;
        onChange: any;
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "plugins/WordCountPlugin" {
    import {ReactNode} from "react";

    export function WordCountPlugin({ onChange, language }?: {
        onChange: any;
        language?: string;
    }): ReactNode;
    export default WordCountPlugin;
}
declare module "components/KoenigNestedComposer" {
    export default KoenigNestedComposer;
    function KoenigNestedComposer({ initialEditor, initialEditorState, initialNodes, initialTheme, skipCollabChecks, children }?: {
        initialEditor: any;
        initialEditorState: any;
        initialNodes: any;
        initialTheme: any;
        skipCollabChecks: any;
        children: any;
    }): import("react/jsx-runtime").JSX.Element;
}
declare module "plugins/HtmlOutputPlugin" {
    export function HtmlOutputPlugin({ html, setHtml }: {
        html?: string;
        setHtml: any;
    }): import("react/jsx-runtime").JSX.Element;
    export default HtmlOutputPlugin;
}
declare module "plugins/RestrictContentPlugin" {
    export function RestrictContentPlugin({ paragraphs, allowBr }: {
        paragraphs: any;
        allowBr: any;
    }): any;
    export default RestrictContentPlugin;
}
declare module "plugins/TKCountPlugin" {
    import {ReactNode} from "react";
    export default function TKCountPlugin({ onChange }: {
        onChange: any;
    }): ReactNode;
}
declare module "nodes/BasicNodes" {
    export default BASIC_NODES;
    const BASIC_NODES: (typeof LinkNode | typeof TKNode | typeof ListNode | typeof ListItemNode)[];
    import { LinkNode } from "@lexical/link";
    import { TKNode } from "@tryghost/kg-default-nodes";
    import { ListNode } from "@lexical/list";
    import { ListItemNode } from "@lexical/list";
}
declare module "@tryghost/koenig-lexical" {
    export * from "utils";
    export const version: any;
    import DesignSandbox from "components/DesignSandbox";
    import KoenigComposableEditor from "components/KoenigComposableEditor";
    import KoenigComposer from "components/KoenigComposer";
    import KoenigEditor from "components/KoenigEditor";
    import KoenigNestedComposer from "components/KoenigNestedComposer";
    import KoenigCardWrapper from "components/KoenigCardWrapper";
    import AudioPlugin from "plugins/AudioPlugin";
    import CalloutPlugin from "plugins/CalloutPlugin";
    import CardMenuPlugin from "plugins/CardMenuPlugin";
    import CollectionPlugin from "plugins/CollectionPlugin";
    import DragDropPastePlugin from "plugins/DragDropPastePlugin";
    import DragDropReorderPlugin from "plugins/DragDropReorderPlugin";
    import EmojiPickerPlugin from "plugins/EmojiPickerPlugin";
    import ExternalControlPlugin, {ExternalApi} from "plugins/ExternalControlPlugin";
    import FilePlugin from "plugins/FilePlugin";
    import FloatingToolbarPlugin from "plugins/FloatingToolbarPlugin";
    import GalleryPlugin from "plugins/GalleryPlugin";
    import HeaderPlugin from "plugins/HeaderPlugin";
    import HorizontalRulePlugin from "plugins/HorizontalRulePlugin";
    import HtmlOutputPlugin from "plugins/HtmlOutputPlugin";
    import ImagePlugin from "plugins/ImagePlugin";
    import KoenigBehaviourPlugin from "plugins/KoenigBehaviourPlugin";
    import MarkdownPlugin from "plugins/MarkdownPlugin";
    import MarkdownShortcutPlugin from "plugins/MarkdownShortcutPlugin";
    import PlusCardMenuPlugin from "plugins/PlusCardMenuPlugin";
    import RestrictContentPlugin from "plugins/RestrictContentPlugin";
    import SignupPlugin from "plugins/SignupPlugin";
    import SlashCardMenuPlugin from "plugins/SlashCardMenuPlugin";
    import TKCountPlugin from "plugins/TKCountPlugin";
    import TogglePlugin from "plugins/TogglePlugin";
    import VideoPlugin from "plugins/VideoPlugin";
    import WordCountPlugin from "plugins/WordCountPlugin";
    import AllDefaultPlugins from "plugins/AllDefaultPlugins";
    import DEFAULT_NODES from "nodes/DefaultNodes";
    import BASIC_NODES from "nodes/BasicNodes";
    import MINIMAL_NODES from "nodes/MinimalNodes";
    import { ELEMENT_TRANSFORMERS } from "plugins/MarkdownShortcutPlugin";
    import { HR as HR_TRANSFORMER } from "plugins/MarkdownShortcutPlugin";
    import { CODE_BLOCK as CODE_BLOCK_TRANSFORMER } from "plugins/MarkdownShortcutPlugin";
    import { DEFAULT_TRANSFORMERS } from "plugins/MarkdownShortcutPlugin";
    import { BASIC_TRANSFORMERS } from "plugins/MarkdownShortcutPlugin";
    import { MINIMAL_TRANSFORMERS } from "plugins/MarkdownShortcutPlugin";
    import * as lexical from "lexical";
    import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
    import { TreeView } from "@lexical/react/LexicalTreeView";
    import { LexicalComposerContext } from "@lexical/react/LexicalComposerContext";
    import { createLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
    import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
    export { DesignSandbox, KoenigComposableEditor, KoenigComposer, KoenigEditor, KoenigNestedComposer, KoenigCardWrapper, AudioPlugin, CalloutPlugin, CardMenuPlugin, CollectionPlugin, DragDropPastePlugin, DragDropReorderPlugin, EmojiPickerPlugin, ExternalControlPlugin, ExternalApi, FilePlugin, FloatingToolbarPlugin, GalleryPlugin, HeaderPlugin, HorizontalRulePlugin, HtmlOutputPlugin, ImagePlugin, KoenigBehaviourPlugin, MarkdownPlugin, MarkdownShortcutPlugin, PlusCardMenuPlugin, RestrictContentPlugin, SignupPlugin, SlashCardMenuPlugin, TKCountPlugin, TogglePlugin, VideoPlugin, WordCountPlugin, AllDefaultPlugins, DEFAULT_NODES, BASIC_NODES, MINIMAL_NODES, ELEMENT_TRANSFORMERS, HR_TRANSFORMER, CODE_BLOCK_TRANSFORMER, DEFAULT_TRANSFORMERS, BASIC_TRANSFORMERS, MINIMAL_TRANSFORMERS, lexical, OnChangePlugin, TreeView, LexicalComposerContext, createLexicalComposerContext, useLexicalComposerContext };
}
