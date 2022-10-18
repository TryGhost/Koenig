import React, {useRef} from 'react';
import {ReactComponent as ImgPlaceholderIcon} from '../../../assets/icons/kg-img-placeholder.svg';
import {MediaPlaceholder} from '../../ui/MediaPlaceholder';

function MediaCard({payload, onUploadChange}) {
    const uploadRef = useRef(null);
    const openUpload = () => {
        uploadRef.current.click();
    };

    if (payload?.__src) {
        return (
            <figure className="kg-card kg-image-card">
                <img src={payload?.__src} alt={payload?.__altText} />
            </figure>
        );
    } else {
        return (
            <>
                <MediaPlaceholder
                    onClick={openUpload}
                    desc="Click to select an image"
                    Icon={ImgPlaceholderIcon}
                />
                <form onChange={onUploadChange}>
                    <input
                        name="image-input"
                        type='file'
                        accept='image/*'
                        ref={uploadRef}
                        hidden={true}
                    />
                </form>
            </>
        );
    }
}

export default MediaCard;
