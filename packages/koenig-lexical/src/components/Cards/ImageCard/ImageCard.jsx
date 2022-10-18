import React from 'react';
// import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
// import CardContext from '../../../context/CardContext';
import MediaCard from './MediaCard';
import {CardCaptionEditor} from '../../ui/CardCaptionEditor';

function ImageCard({
    payload,
    editor,
    nodeKey,
    isSelected,
    onUploadChange,
    updateCaption,
    updateAltText
}) {
    return (
        <div>
            <MediaCard
                payload={payload}
                editor={editor}
                nodeKey={nodeKey}
                onUploadChange={onUploadChange}
            />
            <CardCaptionEditor
                altText={payload.__altText || ''}
                updateAltText={updateAltText}
                altTextPlaceholder="Type alt text for image (optional)"
                caption={payload.__caption || ''}
                updateCaption={updateCaption}
                captionPlaceholder="Type caption for image (optional)"
                isSelected={isSelected}
            />
        </div>
    );
}

export default ImageCard;
