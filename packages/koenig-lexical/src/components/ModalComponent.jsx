// Portal container that can be used to render floating elements, outside of the editor
import {createPortal} from 'react-dom';

const ModalComponent = ({component, container}) => {
    const portalContainer = container || document.querySelector('.koenig-lexical');

    if (!portalContainer) {
        return null;
    }

    return createPortal(component, portalContainer);
};

export default ModalComponent;
