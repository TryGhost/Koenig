import KoenigComposerContext from '../context/KoenigComposerContext';
import React from 'react';
import {$getRoot, $getSelection, COMMAND_PRIORITY_HIGH, COMMAND_PRIORITY_LOW, DROP_COMMAND} from 'lexical';
import {$insertDataTransferForRichText} from '@lexical/clipboard';
import {DRAG_DROP_PASTE} from '@lexical/rich-text';
import {createCommand} from 'lexical';
import {getEditorCardNodes} from '../utils/getEditorCardNodes';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export const INSERT_MEDIA_COMMAND = createCommand();

function isMimeType(file, acceptableMimeTypes) {
    const mimeType = file.type;
    let key = Object.keys(acceptableMimeTypes).find(k => acceptableMimeTypes[k].includes(mimeType));
    return key;
}

function mediaFileReader(files, acceptableMimeTypes) {
    const filesIterator = files[Symbol.iterator]();
    return new Promise((resolve, reject) => {
        const processed = [];
        const handleNextFile = () => {
            const {done, value: file} = filesIterator.next();
            if (done) {
                return resolve({processed});
            }
            const fileReader = new FileReader();
            fileReader.addEventListener('error', reject);
            fileReader.addEventListener('load', () => {
                const result = fileReader.result;
                const nodeType = isMimeType(file, acceptableMimeTypes);
                if (typeof result === 'string') {
                    processed.push({type: nodeType, file: file});
                }
                handleNextFile();
            });
            const nodeType = isMimeType(file, acceptableMimeTypes);
            if (nodeType) {
                fileReader.readAsDataURL(file);
            } else {
                console.error('unsupported file type'); // eslint-disable-line no-console
                handleNextFile();
            }
        };
        handleNextFile();
    });
}

async function getListOfAcceptableMimeTypes(editor, uploadFileTypes) {
    const nodes = getEditorCardNodes(editor);
    let acceptableMimeTypes = {};
    for (const [nodeType, node] of nodes) {
        if (nodeType && node.uploadType) {
            acceptableMimeTypes[nodeType] = uploadFileTypes[node.uploadType].mimeTypes;
        }
    }
    return {
        acceptableMimeTypes
    };
}

function DragDropPastePlugin() {
    const [editor] = useLexicalComposerContext();
    const {fileUploader} = React.useContext(KoenigComposerContext);

    const handleFileUpload = React.useCallback(async (files) => {
        if (!fileUploader) {
            return;
        }

        const {acceptableMimeTypes} = await getListOfAcceptableMimeTypes(editor, fileUploader.fileTypes);
        const {processed} = await mediaFileReader(files, acceptableMimeTypes);
        processed.forEach((item) => {
            editor.dispatchCommand(INSERT_MEDIA_COMMAND, item);
        });
    }, [editor, fileUploader]);

    // override the default Lexical drop handler because we always want to insert
    // where the selection was left rather than where the drop happened (matches mobiledoc editor)
    React.useEffect(() => {
        return editor.registerCommand(
            DROP_COMMAND,
            (event) => {
                const files = Array.from(event.dataTransfer.files);

                if (files.length > 0) {
                    event.preventDefault();
                    event.stopPropagation();
                    editor.dispatchCommand(DRAG_DROP_PASTE, files);
                    return true;
                }

                return false;
            },
            COMMAND_PRIORITY_HIGH
        );
    }, [editor]);

    // prevent drag over moving the cursor - our drops use the original selection
    // rather than the drop location
    React.useEffect(() => {
        const rootElement = editor.getRootElement();
        const handleDragOver = (event) => {
            if (!event.dataTransfer || event.target.closest('[data-kg-card]')) {
                return;
            }

            event.stopPropagation();
            event.preventDefault();
        };

        const handleDragLeave = (event) => {
            event.preventDefault();
        };

        const handleDrop = (event) => {
            // handle image drop from a browser window
            const html = event.dataTransfer.getData('text/html');
            if (html) {
                event.preventDefault();

                editor.update(() => {
                    editor.focus();
                    let selection = $getSelection();
                    if (!selection) {
                        $getRoot().selectEnd();
                        selection = $getSelection();
                    }
                    $insertDataTransferForRichText(event.dataTransfer, selection, editor);
                });
            }
        };

        rootElement.addEventListener('dragover', handleDragOver);
        rootElement.addEventListener('dragleave', handleDragLeave);
        rootElement.addEventListener('drop', handleDrop);

        return () => {
            rootElement.removeEventListener('dragover', handleDragOver);
            rootElement.removeEventListener('dragleave', handleDragLeave);
            rootElement.removeEventListener('drop', handleDrop);
        };
    }, [editor]);

    React.useEffect(() => {
        return editor.registerCommand(
            DRAG_DROP_PASTE,
            async (files) => {
                try {
                    editor.focus();
                    return await handleFileUpload(files);
                } catch (error) {
                    console.error(error); // eslint-disable-line no-console
                }
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, handleFileUpload]);

    return null;
}

export default DragDropPastePlugin;
