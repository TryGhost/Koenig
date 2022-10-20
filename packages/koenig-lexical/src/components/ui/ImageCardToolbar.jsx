import React from 'react';
import {ToolbarMenu, ToolbarMenuItem} from './ToolbarMenu';
import {ImageUploadForm} from './cards/ImageCard';

function ImageCardToolbar({isSelected, fileInputRef, onFileChange, filePicker}) {
    const toolbarPosition = {
        position: 'absolute',
        left: '50%',
        top: -44,
        transform: 'translate(-50%, 0)',
        zIndex: 1000,
        opacity: isSelected ? 1 : 0
    };

    return (
        <span data-kg-image-toolbar style={toolbarPosition} className="not-kg-prose">
            <ImageUploadForm onFileChange={onFileChange} fileInputRef={fileInputRef} />
            <ToolbarMenu>
                <ToolbarMenuItem label="Regular" icon="imageRegular" isActive={true} />
                <ToolbarMenuItem label="Replace" icon="imageReplace" isActive={false} onClick={filePicker} />
            </ToolbarMenu>
        </span>
    );
}

export default ImageCardToolbar;
