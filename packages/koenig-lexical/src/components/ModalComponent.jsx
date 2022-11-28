// Portal container that can be used to render floating elements, outside of the editor
import {createPortal} from 'react-dom';
import {UnsplashSelector} from '../components/ui/file-selectors/UnsplashSelector';

const ModalComponent = ({service, container, handleModalClose, insertImageToNode}) => {
    const portalContainer = container || document.querySelector('.koenig-lexical');

    if (!portalContainer) {
        return null;
    }

    const ModalService = () => {
        if (service === 'unsplash') {
            return <UnsplashSelector toggle={handleModalClose} insertImage={insertImageToNode} />;
        }
    };
    return createPortal(<ModalService/>, portalContainer);
};

export default ModalComponent;
