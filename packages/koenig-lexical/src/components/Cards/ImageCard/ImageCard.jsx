import React from 'react';
// import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
// import CardContext from '../../../context/CardContext';
import MediaCard from './MediaCard';
import CaptionEditor from './CaptionEditor';

function ImageCard({
    payload,
    editor,
    nodeKey,
    isSelected,
    onUploadChange,
    updateCaption,
    updateAltText,
    toggleAltText,
    handleCapInput
}) {
    const [altText, setAltText] = React.useState(false);

    const placeHolderText = (toggle) => {
        if (toggle) {
            return 'Type alt text for image (optional)';
        } else {
            return 'Type caption for image (optional)';
        }
    };

    return (
        <div>
            <MediaCard 
                payload={payload} 
                editor={editor} 
                nodeKey={nodeKey}
                onUploadChange={onUploadChange}
            />
            <div className="w-full p-2">
                <CaptionEditor
                    handleCapInput={handleCapInput}
                    toggleAltText={toggleAltText || {altText, setAltText}}
                    payload={payload}
                    updateAltText={updateAltText}
                    updateCaption={updateCaption}
                    selected={isSelected} 
                    nodeKey={nodeKey} 
                    placeholder={placeHolderText(toggleAltText?.altText || altText)}
                />
            </div>
        </div>
    );
}

export default ImageCard;
