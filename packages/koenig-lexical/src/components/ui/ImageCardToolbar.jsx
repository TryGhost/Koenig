import React from 'react';
import {ToolbarMenu, ToolbarMenuItem} from './ToolbarMenu';
import ImageUploadForm from './ImageUploadForm';
import {createPortal} from 'react-dom';
import CardContext from '../../context/CardContext';

function ImageCardToolbar({isSelected, fileInputRef, onFileChange, filePicker, figureRef, src}) {
    const {setSelected} = React.useContext(CardContext);
    const element = document.querySelector('#koenig') || document.body;
    const toolbarRef = React.useRef(null);
    const [showToolbar, setShowToolbar] = React.useState(false);
    const [rect, setRect] = React.useState({
        top: 0,
        left: 0,
        right: 0
    });
    
    const handleClickOnToolbar = React.useCallback((e) => {
        e.stopPropagation();
        if (isSelected) {
            setShowToolbar(true);
            return;
        }
        if ((toolbarRef.current && toolbarRef.current.contains(e.target) && !isSelected)) {
            setSelected(true);
            setShowToolbar(true);
            return;
        } else {
            setShowToolbar(false);
        }
    }, [toolbarRef, setSelected, isSelected]);

    React.useEffect(() => {
        document.addEventListener('click', handleClickOnToolbar);
        return () => {
            document.removeEventListener('click', handleClickOnToolbar);
        };
    }, [handleClickOnToolbar]);
    
    React.useEffect(() => {
        if (figureRef && isSelected) {
            setShowToolbar(true);
            const figureRect = figureRef.current.getBoundingClientRect();
            const top = figureRect.top - element.getBoundingClientRect().top;
            setRect({
                top: top,
                left: figureRect.left,
                right: figureRect.right
            }
            );
        }
    }, [isSelected, figureRef, element]);
    
    const toolbarPosition = {
        position: 'absolute',
        left: (rect?.right - rect?.left) / 2,
        transform: 'translate(-50%, 0)',
        top: rect?.top - 44,
        zIndex: 1000,
        opacity: showToolbar ? 1 : 0 || isSelected ? 1 : 0
    };

    if (src) {
        return createPortal(
            <div ref={toolbarRef} data-kg-card-toolbar="image" style={toolbarPosition}>
                <ImageUploadForm 
                    onFileChange={onFileChange}
                    fileInputRef={fileInputRef} />
                <ToolbarMenu>
                    <ToolbarMenuItem label="Regular" icon="imageRegular" isActive={true} />
                    <ToolbarMenuItem label="Wide" icon="imageWide" isActive={false} />
                    <ToolbarMenuItem label="Full" icon="imageRegular" isActive={false} />
                    <ToolbarMenuItem label="Replace" icon="imageReplace" isActive={false} onClick={filePicker} />
                </ToolbarMenu>
            </div>, element
        );
    }
}

export default ImageCardToolbar;
