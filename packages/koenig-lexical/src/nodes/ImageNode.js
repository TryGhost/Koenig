import React from 'react';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {LexicalNestedComposer} from '@lexical/react/LexicalNestedComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
// import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {DecoratorNode, createEditor} from 'lexical';

const ImageComponent = ({_key, caption}) => {
    return (
        <React.Fragment key={_key}>
            <img src="https://images.unsplash.com/photo-1538485399081-7191377e8241?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1274&q=80" alt=""/>
            <figcaption>
                <LexicalNestedComposer initialEditor={caption}>
                    <RichTextPlugin
                        placeholder="Caption comes here"
                        contentEditable={<ContentEditable/>} />
                </LexicalNestedComposer>
            </figcaption>
        </React.Fragment>
    );
};

export class ImageNode extends DecoratorNode {
    static getType() {
        return 'image';
    }
    static clone(node) {
        return new ImageNode(node.__key);
    }

    constructor(key, caption) {
        super(key);
        this.__caption = caption || createEditor();
        this.key = key;
    }

    createDOM() {
        const element = document.createElement('figure');
        return element;
    }
    updateDOM() {
        return false;
    }

    static importJSON(serializedNode) {
        const {caption} = serializedNode;
        const node = $createImageNode();
        const nestedEditor = node.__caption;
        const editorState = nestedEditor.parseEditorState(caption.editorState);
        if (!editorState.isEmpty()) {
            nestedEditor.setEditorState(editorState);
        }
        return node;
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            type: 'image'
        };
    }
    decorate() {
        return <ImageComponent _key={this.__key} caption={this.__caption}/>;
    }
}

export const $createImageNode = (key, caption) => {
    const node = new ImageNode(key, caption);
    return node;
};

export function $isImageNode(node) {
    return node instanceof ImageNode;
}

export default ImageNode;
