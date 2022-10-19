import React from 'react';
import {ToolbarMenu, ToolbarMenuItem} from './ToolbarMenu';

function ImageCardToolbar({isSelected}) {
    const toolbarPosition = {
        position: 'absolute',
        left: '50%',
        top: 0 - 50,
        transform: 'translate(-50%, 0)',
        zIndex: 1000
    };

    return (
        <span data-kg-image-toolbar style={toolbarPosition}>
            <ToolbarMenu>
                <ToolbarMenuItem label="Regular" icon="imageRegular" isActive={true} />
            </ToolbarMenu>
        </span>
    );
}

export default ImageCardToolbar;
