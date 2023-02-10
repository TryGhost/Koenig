import React from 'react';
import {
    $getSelection,
    COMMAND_PRIORITY_HIGH,
    $isRangeSelection,
    $createNodeSelection,
    $setSelection,
    $isParagraphNode
} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import KoenigComposerContext from '../context/KoenigComposerContext';
import {$createImageNode, ImageNode, INSERT_IMAGE_COMMAND} from '../nodes/ImageNode';
import {imageUploadHandler} from '../utils/imageUploadHandler';
import UnsplashPlugin from '../components/ui/UnsplashPlugin';

export const ImagePlugin = () => {
    const [editor] = useLexicalComposerContext();
    const {fileUploader} = React.useContext(KoenigComposerContext);
    const [selector, setSelector] = React.useState(null);
    const [selectedKey, setSelectedKey] = React.useState(null);
    const [showModal, setShowModal] = React.useState(false);

    const handleImageUpload = React.useCallback(async (files, imageNodeKey) => {
        if (files?.length > 0) {
            return await imageUploadHandler(files, imageNodeKey, editor, fileUploader);
        }
    }, [fileUploader, editor]);

    const setNodeSelection = ({selection, selectedNode, imageNode}) => {
        // insert a paragraph if this will be the last card and
        // we're not already on a blank paragraph so we always
        // have a trailing paragraph in the doc
        const selectedIsBlankParagraph = $isParagraphNode(selectedNode) && selectedNode.getTextContent() === '';
        const nextNode = selectedNode.getTopLevelElementOrThrow().getNextSibling();
        if (!selectedIsBlankParagraph && !nextNode) {
            selection.insertParagraph();
        }
        selection.focus
            .getNode()
            .getTopLevelElementOrThrow()
            .insertBefore(imageNode);
        const nodeSelection = $createNodeSelection();
        nodeSelection.add(imageNode.getKey());
        $setSelection(nodeSelection);
    };

    React.useEffect(() => {
        if (!editor.hasNodes([ImageNode])){
            console.error('ImagePlugin: ImageNode not registered'); // eslint-disable-line no-console
            return;
        }
        return mergeRegister(
            editor.registerCommand(
                INSERT_IMAGE_COMMAND,
                async (dataset) => {
                    const selection = $getSelection();

                    if (!$isRangeSelection(selection)) {
                        return false;
                    }

                    const focusNode = selection.focus.getNode();

                    if (focusNode !== null) {
                        // if src isn't provided, we're uploading a file either from copy/paste or drag+drop
                        if (!dataset.src && dataset.length > 0) {
                            dataset.forEach((file) => {
                                const imageNode = $createImageNode(file);
                                handleImageUpload([file], imageNode.getKey());
                                const selectedNode = selection.focus.getNode();
                                setNodeSelection({selection, selectedNode, imageNode});
                            });
                        }

                        if ((!dataset.src && dataset.triggerFileDialog) || dataset.src || dataset.triggerFileSelector) {
                            const imageNode = $createImageNode(dataset);
                            const selectedNode = selection.focus.getNode();
                            // fires the unsplash selector
                            if (dataset?.triggerFileSelector === 'unsplash') {
                                setSelectedKey(imageNode.getKey());
                                setShowModal(true);
                                setSelector('unsplash');
                            }
                            setNodeSelection({selection, selectedNode, imageNode});
                        }
                    }

                    return true;
                },
                COMMAND_PRIORITY_HIGH
            )
        );
    }, [editor, fileUploader, handleImageUpload]);

    if (showModal && selector) {
        return (<UnsplashPlugin
            nodeKey={selectedKey}
            handleModalClose={setShowModal}
        />);
    }

    return null;
};

export default ImagePlugin;
