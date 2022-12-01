// Portal container that can be used to render floating elements, outside of the editor
import React from 'react';
import {createPortal} from 'react-dom';
import {$getNodeByKey, $createNodeSelection, $setSelection} from 'lexical';
import {UnsplashSelector} from './file-selectors/UnsplashSelector';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import KoenigComposerContext from '../../context/KoenigComposerContext';
import UnsplashService from '../../utils/services/unsplash';
import MasonryLayout from '../../utils/masonry';

const UnsplashModal = ({service, container, nodeKey, handleModalClose}) => {
    const [editor] = useLexicalComposerContext();
    const {unsplashConf} = React.useContext(KoenigComposerContext);

    const API_URL = 'https://api.unsplash.com';

    const unsplashApi = new UnsplashService(
        API_URL,
        unsplashConf
    );

    const masonry = new MasonryLayout(3);

    const portalContainer = container || document.querySelector('.koenig-lexical');

    const closeModalHandler = () => {
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
        if (image.src) {
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
            // should send api request to tell unsplash we used the image
        }
    };

    if (!portalContainer) {
        return null;
    }

    const ModalService = () => {
        if (service === 'unsplash') {
            return <UnsplashSelector Masonry={masonry} UnsplashLib={unsplashApi} closeModal={closeModalHandler} insertImage={insertImageToNode} />;
        }
    };
    return createPortal(<ModalService/>, portalContainer);
};

export default UnsplashModal;
