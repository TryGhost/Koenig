import React from 'react';
import {DRAG_DROP_PASTE} from '@lexical/rich-text';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
// import {isMimeType, mediaFileReader} from '@lexical/utils'; // not yet available in stable version of lexical
import {COMMAND_PRIORITY_LOW} from 'lexical';
import {getEditorCardNodes} from '../utils/getEditorCardNodes';
import {UPLOAD_IMAGE_COMMAND} from '../nodes/ImageNode';

// TODO - replace the next 2 isMimeType and mediaFileReader with  @lexical/utils library when released in next `not nightly` version of Lexical - currently not available in latest published Lexical version.
// NB added minor adjustment to mediaFileReader to adapt to existing uploaders, 
// both on Ghost and Demo - we should adapt those functions to meet Lexicals output which is an array like [{file: fileData, result: base64 String}] )
// source https://github.com/facebook/lexical/blob/main/packages/lexical-utils/src/index.ts

function isMimeType(file, acceptableMimeTypes) {
    for (const acceptableType of acceptableMimeTypes) {
        if (file.type.startsWith(acceptableType)) {
            return true;
        }
    }
    return false;
}
  
function mediaFileReader(files, acceptableMimeTypes) {
    const filesIterator = files[Symbol.iterator]();
    return new Promise((resolve, reject) => {
        const processed = [];
        const handleNextFile = () => {
            const {done, value: file} = filesIterator.next();
            if (done) {
                return resolve(processed);
            }
            const fileReader = new FileReader();
            fileReader.addEventListener('error', reject);
            fileReader.addEventListener('load', () => {
                const result = fileReader.result;
                if (typeof result === 'string') {
                    processed.push(file);
                }
                handleNextFile();
            });
            if (isMimeType(file, acceptableMimeTypes)) {
                fileReader.readAsDataURL(file);
            } else {
                console.error('unsupported file type'); // eslint-disable-line no-console
                handleNextFile();
            }
        };
        handleNextFile();
    });
}

async function getListofAcceptableMimeTypes(editor) {
    const nodes = getEditorCardNodes(editor);

    const acceptableMimeTypes = [];
    let nodeType;
    nodes.map((node) => {
        nodeType = node[0];
        const extensionTypes = node[1]?.extensionTypes || null;
        if (!extensionTypes && extensionTypes === null) {
            return null;
        }
        return extensionTypes.map((extensionType) => {
            const mimeType = `${nodeType}/${extensionType}`;
            return acceptableMimeTypes.push(mimeType);
        });
    });
    return {
        acceptableMimeTypes,
        nodeType
    };
}

function DragDropPastePlugin() {
    const [editor] = useLexicalComposerContext();

    const handleDrag = React.useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = React.useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            editor.dispatchCommand(DRAG_DROP_PASTE, e.dataTransfer.files);
        }
    }, [editor]);

    React.useEffect(() => {
        // TODO: consuming app should be able to configure the element where they want to listen to the drag and drop events
        const dropTarget = document.querySelector('.gh-koenig-editor') || document;
        dropTarget.addEventListener('dragover', handleDrag);
        dropTarget.addEventListener('drop', handleDrop);

        return () => {
            dropTarget.removeEventListener('dragover', handleDrag);
            dropTarget.removeEventListener('drop', handleDrop);
        };
    }, [handleDrag, handleDrop]);

    React.useEffect(() => {
        return editor.registerCommand(
            DRAG_DROP_PASTE,
            async (files) => {
                const {acceptableMimeTypes, nodeType} = await getListofAcceptableMimeTypes(editor);
                const res = await mediaFileReader(files, acceptableMimeTypes);
                if (res && nodeType) {
                    if (nodeType === 'image') {
                        editor.dispatchCommand(UPLOAD_IMAGE_COMMAND, res);
                    }
                }
            },
            COMMAND_PRIORITY_LOW 
        );
    }, [editor]);
    return null;
}

export default DragDropPastePlugin;
