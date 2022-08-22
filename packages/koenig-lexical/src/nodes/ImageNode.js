import React from 'react';
import {DecoratorNode} from 'lexical';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {editorConfig} from '../App';

const ImageComponent = ({JsonContent}) => {
    return (
        <React.Fragment>
            <img src="https://images.unsplash.com/photo-1538485399081-7191377e8241?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1274&q=80" alt=""/>
            <figcaption>
                <LexicalComposer initialConfig={editorConfig(JsonContent || {})}>
                    <RichTextPlugin
                        placeholder="Caption comes here"
                        contentEditable={<ContentEditable/>} />
                    
                </LexicalComposer>
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

    constructor(key) {
        super(key);
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
        const node = $createImageNode();
        return node;
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            type: 'image'
        };
    }
    decorate() {
        return <ImageComponent key={this.__key}/>;
    }
}

export const $createImageNode = (key) => {
    const node = new ImageNode(key);
    return node;
};

export function $isImageNode(node) {
    return node instanceof ImageNode;
}

export default ImageNode;
