import React, {useEffect} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {createCommand} from 'lexical';

export const INSERT_IMAGE_CMD = createCommand();

// for drag and drop events

const ImagePlugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes('ImageNode')) {
            console.error('Image node not loaded'); // eslint-disable-line no-console
        }
        return mergeRegister(
            editor.registerCommand(INSERT_IMAGE_CMD, (payload) => {
                editor.update(() => {
                    const root = editor.getRoot();
                    const paragraphNode = editor.createNode('ParagraphNode');
                    const imageNode = editor.createNode('ImageNode');
                    paragraphNode.append(imageNode);
                    root.append(paragraphNode);
                }).then(() => {
                    editor.focus();
                }).catch((error) => {
                    console.error(error); // eslint-disable-line no-console
                }).finally(() => {
                    editor.dispatchCommand(INSERT_IMAGE_CMD, payload);
                });
            }));
    }, [editor]);    

    return (<></>);
};

export default ImagePlugin;
