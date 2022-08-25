import React from 'react';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {LexicalNestedComposer} from '@lexical/react/LexicalNestedComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {DecoratorNode, createEditor, $getNodeByKey} from 'lexical';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const ImageTextEditor = ({editAlt, nodeKey, payload}) => {
    const [editor] = useLexicalComposerContext();
    const [alt, setAltText] = React.useState(payload.__altText || '');

    const onChange = (event) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setAlt(event.target.value);
            setAltText(event.target.value);
        });
    };

    if (!editAlt && payload.__caption) {
        return (
            <LexicalNestedComposer initialEditor={payload.__caption}>
                <PlainTextPlugin
                    placeholder={<div className="pointer-events-none absolute left-0 -mt-8 min-w-full cursor-text">Type caption for image (optional)</div>}
                    contentEditable={<div><ContentEditable/></div>} />
                <HistoryPlugin />
            </LexicalNestedComposer>
        );
    }

    return (
        <input
            className="w-100 text-center font-sans text-sm"
            type="text"
            value={alt}
            onChange={onChange}
        />
    );
};

const ImageComponent = ({nodeKey}) => {
    const [editAlt, setEditAlt] = React.useState(false);
    const [editor] = useLexicalComposerContext();
    const [payload, setPayload] = React.useState({});

    React.useEffect(() => {
        const editorState = editor.getEditorState();
        editorState.read(() => {
            const node = $getNodeByKey(nodeKey);
            setPayload(node.getPayload());
        });
    }, [editor, nodeKey]);
    return (
        <KoenigCardWrapper>
            <figure key={nodeKey}>
                <img src={payload.__src} alt={payload.__altText}/>
                <figcaption className="w-100 relative text-center font-sans text-sm">
                    <ImageTextEditor nodeKey={nodeKey} editAlt={editAlt} payload={payload}/>
                </figcaption>
                <button onClick={() => setEditAlt(!editAlt)} className={` absolute bottom-0 right-0 m-3 cursor-pointer rounded border px-1 text-sm font-normal leading-6 ${editAlt ? 'border-green bg-green text-white' : 'border-grey text-grey'} `}>Alt</button>        
            </figure>
        </KoenigCardWrapper>
    );
};

function convertImageElement(domNode) {
    if (domNode instanceof HTMLImageElement) {
        const {altText, src} = domNode;
        const node = $createImageNode({altText, src});
        return {node};
    }
    return null;
}

export class ImageNode extends DecoratorNode {
    __caption;
    __altText;
    __src;

    static getType() {
        return 'image';
    }
    static clone(node) {
        return new ImageNode(
            node.__src,
            node.__caption,
            node.__altText,
            node.__key,
        );
    }

    static importJSON(serializedNode) {
        const {caption, altText, src} = serializedNode;
        const node = $createImageNode({
            altText,
            caption,
            src
        });
        const nestedEditor = node.__caption;
        const editorState = nestedEditor.parseEditorState(caption.editorState);
        if (!editorState.isEmpty()) {
            nestedEditor.setEditorState(editorState);
        }
        return node;
    }

    exportDOM(){
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__altText);
        return {element};
    }

    static importDom() {
        return {
            img: (node = Node) => ({
                conversion: convertImageElement,
                priority: 1
            })
        };
    }

    constructor(src, caption, altText, key) {
        super(key);
        this.__caption = caption || createEditor();
        this.__altText = altText || '';
        this.__src = src || '';
    }

    exportJSON() {
        const dataset = {
            altText: this.getAlt(),
            caption: this.__caption.toJSON(),
            src: this.getSrc(),
            key: this.getKey(),
            type: 'image'
        };
        return dataset;
    }

    setAlt(alt) {
        const self = this.getWritable();
        self.__altText = alt;
    }

    getAlt() {
        const self = this.getLatest();
        return self.__altText;
    }

    getSrc() {
        return this.__src;
    }

    getPayload() {
        return this.getLatest();
    }

    createDOM() {
        const element = document.createElement('div');
        return element;
    }
    updateDOM() {
        return false;
    }

    decorate() {
        return <ImageComponent 
            nodeKey={this.getKey()}
        />;
    }
}

export const $createImageNode = ({src, caption, altText}) => {
    const node = new ImageNode(src, caption, altText);
    return node;
};

export function $isImageNode(node) {
    return node instanceof ImageNode;
}

export default ImageNode;
