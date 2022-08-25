import React from 'react';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {LexicalNestedComposer} from '@lexical/react/LexicalNestedComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {DecoratorNode, createEditor, $getNodeByKey} from 'lexical';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const ImageTextEditor = ({editAlt, nodeKey, payload}) => {
    // console.log(payload);
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
        editor.update(() => {
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

export class ImageNode extends DecoratorNode {
    static getType() {
        return 'image';
    }
    static clone(node) {
        return new ImageNode(
            node.__src,
            node.__caption,
            node.__altText
        );
    }

    constructor(dataset, key) {
        super(key);
        this.__caption = dataset?.caption || createEditor();
        this.__altText = dataset?.alt || '';
        this.__src = dataset?.src;
    }

    setAlt(alt) {
        const self = this.getWritable();
        self.__altText = alt;
    }

    getAlt() {
        const self = this.getLatest();
        return self.__altText;
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

    static importJSON(serializedNode) {
        const {caption} = serializedNode;
        const node = $createImageNode(serializedNode);
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
        return <ImageComponent 
            nodeKey={this.__key}
        />;
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
