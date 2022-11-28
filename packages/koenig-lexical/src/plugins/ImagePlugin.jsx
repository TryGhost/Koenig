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
import ModalComponent from '../components/ModalComponent';

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

    const handleModalClose = (args) => {
        setShowUnsplash(false);
        // remove the image node from the editor
        if (imgNode && args?.removeImage === true) { // probably not needed if insertNode removes modal
            editor.update(() => {
                imgNode.remove();
            });
        }
    };

    const insertImageToNode = (image) => {
        if (image.src) {
            editor.update(() => {
                const node = imgNode;
                node.setSrc(image.src);
            //
            });
            setShowUnsplash(false);
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
        );
    }, [editor, imageUploader, handleImageUpload]);

    if (showUnsplash) {
        return (
            <ModalComponent
                component={<UnsplashSelector toggle={handleModalClose} insertImage={insertImageToNode} />} 
            />
        );
    }

    return null;
};

export default ImagePlugin;
