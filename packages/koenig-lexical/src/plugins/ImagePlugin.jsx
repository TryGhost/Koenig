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
import {UnsplashSelector} from '../components/ui/file-selectors/UnsplashSelector';
import ModalContainer from '../components/ModalContainer';

export const ImagePlugin = () => {
    const [editor] = useLexicalComposerContext();
    const {imageUploader} = React.useContext(KoenigComposerContext);
    const [showUnsplash, setShowUnsplash] = React.useState(false);
    const [imgNode, setImgNode] = React.useState(null);

    const handleImageUpload = React.useCallback(async (files, imageNodeKey) => {
        if (files?.length > 0) {
            return await imageUploadHandler(files, imageNodeKey, editor, imageUploader);
        }
    }, [imageUploader, editor]);

    const handleModalClose = () => {
        setShowUnsplash(false);
        // remove the image node from the editor
        if (imgNode) {
            editor.update(() => {
                imgNode.remove();
            });
        }
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
                        const imageNode = $createImageNode(dataset);
                        if (dataset.imageType === 'unsplash') {
                            setShowUnsplash(true);
                            setImgNode(imageNode);
                        }

                        if (!dataset.src) {
                            const imageNodeKey = imageNode.getKey();
                            handleImageUpload(dataset, imageNodeKey);
                        }
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

                        // move the focus away from the paragraph to the inserted
                        // decorator node
                        const nodeSelection = $createNodeSelection();
                        nodeSelection.add(imageNode.getKey());
                        $setSelection(nodeSelection);

                        // TODO: trigger file selector?
                    }

                    return true;
                },
                COMMAND_PRIORITY_HIGH
            )
            // editor.registerCommand(
            //     UPLOAD_IMAGE_COMMAND,
            //     async (files) => {
            //         // const dataset = await imageUploader.imageUploader(files);
            //         editor.dispatchCommand(INSERT_IMAGE_COMMAND, dataset);
            //     },
            //     COMMAND_PRIORITY_HIGH
            // ),
            // todo: create another command to handle more of the upload logic to allow us to be able to keep the image uploader more "dry / generic" as it needs to handle multiple states of the upload,
            // eg: the progress bar, error states, temp image, etc
        );
    }, [editor, imageUploader, handleImageUpload]);

    if (showUnsplash) {
        return (
            <ModalContainer
                component={<UnsplashSelector toggle={handleModalClose} />} 
            />
        );
    }

    return null;
};

export default ImagePlugin;
