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
import {INSERT_UNSPLASH_EMBED_COMMAND} from '../nodes/EmbedNode';
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
                        const imageNode = $createImageNode(dataset);

                        if (!dataset.src) {
                            const imageNodeKey = imageNode.getKey();
                            handleImageUpload(dataset, imageNodeKey);
                        }

                        if (dataset?.service) {
                            if (dataset.service === 'unsplash') {
                                editor.dispatchCommand(INSERT_UNSPLASH_EMBED_COMMAND, imageNode);
                            }
                            // TODO: add more services?
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

    return null;
};

export default ImagePlugin;
