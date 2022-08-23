import React from 'react';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {LexicalNestedComposer} from '@lexical/react/LexicalNestedComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {DecoratorNode, createEditor} from 'lexical';

const ImageComponent = ({_key, caption, src}) => {
    return (
        <figure key={_key}>
            <img src={src} alt=""/>
            <figcaption>
                <LexicalNestedComposer initialEditor={caption}>
                    <RichTextPlugin
                        placeholder="Caption comes here"
                        contentEditable={<ContentEditable/>} />
                </LexicalNestedComposer>
            </figcaption>
        </figure>
    );
};

export class ImageNode extends DecoratorNode {
    static getType() {
        return 'image';
    }
    static clone(node) {
        return new ImageNode(node.key);
    }

    constructor(dataset) {
        super(dataset?.key);
        this.__caption = dataset?.caption || createEditor();
        this.key = dataset?.key || Math.random();
        this.__alt = dataset?.alt || '';
        this.__src = dataset?.src || 'https://images.unsplash.com/photo-1538485399081-7191377e8241?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1274&q=80';
    }

    createDOM() {
        const element = document.createElement('div');
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
        return <ImageComponent src={this.__src} _key={this.__key} caption={this.__caption}/>;
    }
}

export const $createImageNode = (dataset) => {
    const node = new ImageNode(dataset);
    return node;
};

export function $isImageNode(node) {
    return node instanceof ImageNode;
}

export default ImageNode;
