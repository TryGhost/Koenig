import DeleteIcon from '../../assets/icons/kg-trash.svg?react';
import ImageUploadForm from './ImageUploadForm';
import PropTypes from 'prop-types';
import WandIcon from '../../assets/icons/kg-wand.svg?react';
import clsx from 'clsx';
import {IconButton} from './IconButton';
import {MediaPlaceholder} from './MediaPlaceholder';
import {ProgressBar} from './ProgressBar';
import {openFileSelection} from '../../utils/openFileSelection';
import {useRef} from 'react';

export function MediaUploader({
    className,
    imgClassName,
    src,
    alt,
    desc,
    icon,
    size,
    type,
    borderStyle = 'squared',
    backgroundSize = 'cover',
    mimeTypes,
    onFileChange,
    dragHandler,
    isEditing = true,
    isLoading,
    isPinturaEnabled,
    openImageEditor,
    progress,
    errors,
    onRemoveMedia = () => {},
    additionalActions,
    setFileInputRef
}) {
    const fileInputRef = useRef(null);

    const onFileInputRef = (element) => {
        fileInputRef.current = element;
        setFileInputRef?.(element);
    };

    const progressStyle = {
        width: `${progress?.toFixed(0)}%`
    };

    const onRemove = (e) => {
        e.stopPropagation(); // prevents card from losing selected state
        onRemoveMedia();
    };

    const isEmpty = !isLoading && !src;

    if (isEmpty) {
        return (
            <div className={className}>
                <MediaPlaceholder
                    borderStyle={borderStyle}
                    dataTestId="media-upload-placeholder"
                    desc={isEditing ? desc : ''}
                    errorDataTestId="media-upload-errors"
                    errors={errors}
                    filePicker={() => openFileSelection({fileInputRef})}
                    icon={icon}
                    isDraggedOver={dragHandler?.isDraggedOver}
                    placeholderRef={dragHandler?.setRef}
                    size={size}
                    type={type}
                />
                <ImageUploadForm
                    fileInputRef={onFileInputRef}
                    filePicker={() => openFileSelection({fileInputRef})}
                    mimeTypes={mimeTypes}
                    onFileChange={onFileChange}
                />
            </div>
        );
    }

    return (
        <div className={clsx(
            'group/image relative flex items-center justify-center', 
            isLoading ? 'min-w-[6.8rem]' : 'min-w-[5.2rem]',
            borderStyle === 'rounded' && 'rounded', 
            className
        )} data-testid="media-upload-filled">
            {src && (
                <>
                    <img alt={alt} className={clsx('mx-auto h-full w-auto min-w-[5.2rem]', borderStyle === 'rounded' && 'rounded-lg', backgroundSize === 'cover' ? 'object-cover' : 'object-contain', imgClassName)} src={src} />
                    <div className={clsx('absolute inset-0 bg-gradient-to-t from-black/0 via-black/5 to-black/30 opacity-0 transition-all group-hover/image:opacity-100', borderStyle === 'rounded' && 'rounded-lg')}></div>
                </>
            )}

            {!isLoading && (
                <div className="absolute right-1 top-1 flex space-x-1 opacity-0 transition-all group-hover/image:opacity-100">
                    {additionalActions}
                    { isPinturaEnabled && <IconButton Icon={WandIcon} label="Edit" onClick={() => openImageEditor({
                        image: src,
                        handleSave: (editedImage) => {
                            onFileChange({
                                target: {
                                    files: [editedImage]
                                }
                            });
                        }
                    })} /> }
                    <IconButton dataTestId="media-upload-remove" Icon={DeleteIcon} label="Delete" onClick={onRemove} />
                </div>
            )}

            {isLoading && (
                <div
                    className={clsx('absolute inset-0 flex min-w-full items-center justify-center overflow-hidden bg-grey-100', borderStyle === 'rounded' && 'rounded-lg')}
                    data-testid="custom-thumbnail-progress"
                >
                    <ProgressBar style={progressStyle} />
                </div>
            )}
        </div>
    );
}

MediaUploader.propTypes = {
    additionalActions: PropTypes.node,
    alt: PropTypes.string,
    backgroundSize: PropTypes.oneOf(['cover', 'contain']),
    borderStyle: PropTypes.oneOf(['squared', 'rounded']),
    className: PropTypes.string,
    desc: PropTypes.string,
    dragHandler: PropTypes.shape({isDraggedOver: PropTypes.bool, setRef: PropTypes.func}),
    errors: PropTypes.arrayOf(PropTypes.shape({message: PropTypes.string})),
    icon: PropTypes.string,
    imgClassName: PropTypes.string,
    isEditing: PropTypes.bool,
    isLoading: PropTypes.bool,
    isPinturaEnabled: PropTypes.bool,
    mimeTypes: PropTypes.arrayOf(PropTypes.string),
    onFileChange: PropTypes.func,
    onRemoveMedia: PropTypes.func,
    openImageEditor: PropTypes.func,
    progress: PropTypes.number,
    setFileInputRef: PropTypes.func,
    size: PropTypes.string,
    src: PropTypes.string,
    type: PropTypes.oneOf(['image', 'button'])
};
