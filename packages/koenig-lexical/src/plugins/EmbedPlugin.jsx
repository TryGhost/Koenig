import React from 'react';
import {
    COMMAND_PRIORITY_HIGH,
    $createNodeSelection,
    $setSelection
} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import KoenigComposerContext from '../context/KoenigComposerContext';
import {ImageNode} from '../nodes/ImageNode';
import {imageUploadHandler} from '../utils/imageUploadHandler';
// import {UnsplashSelector} from '../components/ui/file-selectors/UnsplashSelector';
import ModalComponent from '../components/ModalComponent';
import {INSERT_UNSPLASH_EMBED_COMMAND} from '../nodes/EmbedNode';
import {getImageDimensions} from '../utils/getImageDimensions';

export const EmbedPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const {imageUploader} = React.useContext(KoenigComposerContext);
    const [selectedEmbedService, setSelectedEmbedService] = React.useState(null);
    const [embedType, setEmbedType] = React.useState(null);
    const [createdNode, setcreatedNode] = React.useState(null);

    const handleImageUpload = React.useCallback(async (files, imageNodeKey) => {
        if (files?.length > 0) {
            return await imageUploadHandler(files, imageNodeKey, editor, imageUploader);
        }
    }, [imageUploader, editor]);

    const handleModalClose = (args) => {
        setSelectedEmbedService(null);
        // remove the image node from the editor
        if (createdNode) {
            editor.update(() => {
                createdNode.remove();
            });
        }
        setEmbedType(null);
    };

    const insertImageToNode = async (image) => {
        const {height, width} = await getImageDimensions(image.src);
        if (image.src) {
            editor.update(() => {
                const node = createdNode;
                node.setSrc(image.src);
                node.setImgHeight(height);
                node.setImgWidth(width);
                const nodeSelection = $createNodeSelection();
                nodeSelection.add(node.getKey());
                $setSelection(nodeSelection);
            //
            });
            setSelectedEmbedService(null);
            setEmbedType(null);
        }
    };

    React.useEffect(() => {
        if (!editor.hasNodes([ImageNode])){
            console.error('ImagePlugin: ImageNode not registered'); // eslint-disable-line no-console
            return;
        }
        return mergeRegister(
            editor.registerCommand(
                INSERT_UNSPLASH_EMBED_COMMAND,
                async (dataset) => {
                    const node = dataset;
                    setcreatedNode(node);
                    setSelectedEmbedService('unsplash');
                    setEmbedType('modal');
                    return true;
                },
                COMMAND_PRIORITY_HIGH
            )
        );
    }, [editor, imageUploader, handleImageUpload]);

    if (embedType === 'modal' && selectedEmbedService) {
        return (
            <ModalComponent 
                service={selectedEmbedService} 
                insertImageToNode={insertImageToNode} 
                handleModalClose={handleModalClose}
            />
        );
    }

    return null;
};

export default EmbedPlugin;
