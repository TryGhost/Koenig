// Portal container that can be used to render floating elements, outside of the editor
import {createPortal} from 'react-dom';
import {UnsplashSelector} from '../components/ui/file-selectors/UnsplashSelector';

const ModalComponent = ({container, handleModalClose, insertImageToNode}) => {
    const portalContainer = container || document.querySelector('.koenig-lexical');

    if (!portalContainer) {
        return null;
    }

    return createPortal(<UnsplashSelector toggle={handleModalClose} insertImage={insertImageToNode} />, portalContainer);
};

export default ModalComponent;
