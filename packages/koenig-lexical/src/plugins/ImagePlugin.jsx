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

export const ImagePlugin = () => {
    const [editor] = useLexicalComposerContext();
    const {imageUploader} = React.useContext(KoenigComposerContext);

    const handleImageUpload = React.useCallback(async (files, imageNodeKey) => {
        if (files?.length > 0) {
            return await imageUploadHandler(files, imageNodeKey, editor, imageUploader);
        }
    }, [imageUploader, editor]);

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
                        //todo should this be a seperate command?
                        if (!dataset.src && dataset.length > 0) {
                            dataset.forEach((file) => {
                                const imageNode = $createImageNode(file);
                                handleImageUpload([file], imageNode.getKey());
                                // insert a paragraph if this will be the last card and
                                // we're not already on a blank paragraph so we always
                                // have a trailing paragraph in the doc
                                const selectedNode = selection.focus.getNode();
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
                            });
                        }
                        if ((!dataset.src && dataset.triggerFileDialog) || dataset.src) {
                            const imageNode = $createImageNode(dataset);
                            const selectedNode = selection.focus.getNode();
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
                        }
                    }

                    return true;
                },
                COMMAND_PRIORITY_HIGH
            )
            // todo: create another command to handle more of the upload logic to allow us to be able to keep the image uploader more "dry / generic" as it needs to handle multiple states of the upload,
            // eg: the progress bar, error states, temp image, etc
        );
    }, [editor, imageUploader, handleImageUpload]);

    return null;
};

export default ImagePlugin;
