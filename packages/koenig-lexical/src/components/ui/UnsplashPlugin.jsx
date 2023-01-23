import React from 'react';
import {$getNodeByKey, $createNodeSelection, $setSelection} from 'lexical';
import UnsplashModal from './UnsplashModal.jsx';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import KoenigComposerContext from '../../context/KoenigComposerContext.jsx';

const UnsplashPlugin = ({nodeKey, handleModalClose}) => {
    const {unsplashConf} = React.useContext(KoenigComposerContext);
    const [editor] = useLexicalComposerContext();

    const onClose = () => {
        // remove the image node from the editor
        if (nodeKey) {
            editor.update(() => {
                const node = $getNodeByKey(nodeKey);
                node.remove();
            });
        }
        handleModalClose(false);
    };

    const insertImageToNode = async (image) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setSrc(image.src);
            node.setImgHeight(image.height);
            node.setImgWidth(image.width);
            node.setCaption(image.caption);
            node.setAltText(image.alt);
            const nodeSelection = $createNodeSelection();
            nodeSelection.add(node.getKey());
            $setSelection(nodeSelection);
        });
        handleModalClose(false);
    };

    return (
        <UnsplashModal
            onClose={onClose}
            onImageInsert={insertImageToNode}
            unsplashConf={unsplashConf}
        />
    );
};

export default UnsplashPlugin;
