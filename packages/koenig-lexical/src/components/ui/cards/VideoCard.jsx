import PropTypes from 'prop-types';
import React from 'react';
import {ButtonGroupSetting, MediaUploadSetting, SettingsPanel, ToggleSetting} from '../SettingsPanel';
import {CardCaptionEditor} from '../CardCaptionEditor';
import {ReactComponent as ImgFullIcon} from '../../../assets/icons/kg-img-full.svg';
import {ReactComponent as ImgRegularIcon} from '../../../assets/icons/kg-img-regular.svg';
import {ReactComponent as ImgWideIcon} from '../../../assets/icons/kg-img-wide.svg';
import {MediaPlaceholder} from '../MediaPlaceholder';
import {MediaPlayer} from '../MediaPlayer';
import {ReactComponent as PlayIcon} from '../../../assets/icons/kg-play.svg';
import {ProgressBar} from '../ProgressBar';
import {ReadOnlyOverlay} from '../ReadOnlyOverlay';
import {openFileSelection} from '../../../utils/openFileSelection';

function PopulatedVideoCard({
    thumbnail,
    customThumbnail,
    onCustomThumbnailChange,
    videoUploader = {},
    customThumbnailUploader = {},
    onRemoveCustomThumbnail,
    totalDuration,
    cardWidth,
    isLoopChecked,
    onLoopChange,
    onCardWidthChange,
    isEditing,
    thumbnailMimeTypes,
    thumbnailDragHandler = {}
}) {
    const progressStyle = {
        width: `${videoUploader.progress?.toFixed(0)}%`
    };

    const buttonGroupChildren = [
        {
            label: 'Regular',
            name: 'regular',
            Icon: ImgRegularIcon
        },
        {
            label: 'Wide',
            name: 'wide',
            Icon: ImgWideIcon
        },
        {
            label: 'Full',
            name: 'full',
            Icon: ImgFullIcon
        }
    ];

    return (
        <>
            <div className="not-kg-prose relative" data-testid="video-card-populated">
                <div>
                    <img alt="Video thumbnail" className="mx-auto" src={thumbnail} />
                    {customThumbnail && <img alt="Video custom thumbnail" className="absolute inset-0 h-full w-full bg-white object-cover" src={customThumbnail} />}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/0 via-black/5 to-black/30">
                    {videoUploader.isLoading || (
                        <button className="flex h-20 w-20 items-center justify-center rounded-full bg-black/50" type="button">
                            <PlayIcon className="h-auto w-5 fill-white" />
                        </button>
                    )}
                </div>
                <div className={`absolute bottom-0 flex h-20 w-full justify-end bg-gradient-to-b from-black/0 to-black/50 ${cardWidth === 'full' ? 'px-7 py-4' : 'px-4'}`}>
                    <MediaPlayer duration={totalDuration} theme='light' />
                </div>
                {/* This prevents interacting with the buttons that don't do anything, causing focus loss */}
                <ReadOnlyOverlay />
            </div>
            {
                videoUploader.isLoading && (
                    <div className="absolute inset-0 flex min-w-full items-center justify-center overflow-hidden bg-white/50" data-testid="video-progress">
                        <ProgressBar bgStyle='transparent' style={progressStyle} />
                    </div>
                )
            }

            {
                !!thumbnail && !videoUploader.isLoading && isEditing && (
                    <SettingsPanel>
                        <ButtonGroupSetting
                            buttons={buttonGroupChildren}
                            label="Video width"
                            selectedName={cardWidth}
                            onClick={onCardWidthChange}
                        />
                        <ToggleSetting
                            dataTestId="loop-video"
                            description='Autoplay your video on a loop without sound.'
                            isChecked={isLoopChecked}
                            label='Loop'
                            onChange={onLoopChange}
                        />
                        {!isLoopChecked && (
                            <MediaUploadSetting
                                alt='Custom thumbnail'
                                borderStyle={'dashed'}
                                dataTestId="custom-thumbnail-replace"
                                errors={customThumbnailUploader.errors}
                                icon='file'
                                isDraggedOver={thumbnailDragHandler.isDraggedOver}
                                isLoading={customThumbnailUploader.isLoading}
                                label='Custom thumbnail'
                                mimeTypes={thumbnailMimeTypes}
                                placeholderRef={thumbnailDragHandler.setRef}
                                progress={customThumbnailUploader.progress}
                                size='xsmall'
                                src={customThumbnail}
                                onFileChange={onCustomThumbnailChange}
                                onRemoveMedia={onRemoveCustomThumbnail}
                            />
                        )}
                    </SettingsPanel>
                )
            }
        </>
    );
}

function EmptyVideoCard({onFileChange, fileInputRef, errors, videoMimeTypes = [], videoDragHandler = {}}) {
    return (
        <>
            <MediaPlaceholder
                desc="Click to select a video"
                errors={errors}
                filePicker={() => openFileSelection({fileInputRef})}
                icon='video'
                isDraggedOver={videoDragHandler.isDraggedOver}
                placeholderRef={videoDragHandler.setRef}
            />
            <form onChange={onFileChange}>
                <input
                    ref={fileInputRef}
                    accept={videoMimeTypes.join(',')}
                    hidden={true}
                    name="image-input"
                    type='file'
                />
            </form>
        </>
    );
}

const VideoHolder = ({
    fileInputRef,
    onVideoFileChange,
    videoDragHandler,
    videoUploader = {},
    videoUploadErrors,
    videoMimeTypes,
    ...props
}) => {
    const showPopulatedCard = props.customThumbnail || props.thumbnail || videoUploader.isLoading;
    if (showPopulatedCard) {
        return (
            <PopulatedVideoCard {...props} videoUploader={videoUploader}/>
        );
    } else {
        return (
            <EmptyVideoCard
                errors={videoUploadErrors}
                fileInputRef={fileInputRef}
                videoDragHandler={videoDragHandler}
                videoMimeTypes={videoMimeTypes}
                onFileChange={onVideoFileChange}
            />
        );
    }
};

export function VideoCard({
    captionEditor,
    captionEditorInitialState,
    isSelected,
    isEditing,
    ...props
}) {
    return (
        <figure className="not-kg-prose">
            <VideoHolder {...props} isEditing={isEditing} />
            <CardCaptionEditor
                captionEditor={captionEditor}
                captionEditorInitialState={captionEditorInitialState}
                captionPlaceholder="Type caption for video (optional)"
                dataTestId="video-card-caption"
                isSelected={isSelected}
            />
        </figure>
    );
}

VideoCard.propTypes = {
    captionEditor: PropTypes.object,
    captionEditorInitialState: PropTypes.object,
    isSelected: PropTypes.bool,
    isEditing: PropTypes.bool
};

PopulatedVideoCard.propTypes = {
    thumbnail: PropTypes.string,
    customThumbnail: PropTypes.string,
    onCustomThumbnailChange: PropTypes.func,
    videoUploader: PropTypes.object,
    customThumbnailUploader: PropTypes.object,
    onRemoveCustomThumbnail: PropTypes.func,
    totalDuration: PropTypes.string,
    cardWidth: PropTypes.string,
    isLoopChecked: PropTypes.bool,
    onLoopChange: PropTypes.func,
    onCardWidthChange: PropTypes.func,
    isEditing: PropTypes.bool,
    thumbnailMimeTypes: PropTypes.array,
    thumbnailDragHandler: PropTypes.object
};

EmptyVideoCard.propTypes = {
    onFileChange: PropTypes.func,
    fileInputRef: PropTypes.object,
    errors: PropTypes.array,
    videoMimeTypes: PropTypes.array,
    videoDragHandler: PropTypes.object
};

VideoHolder.propTypes = {
    fileInputRef: PropTypes.object,
    onVideoFileChange: PropTypes.func,
    videoDragHandler: PropTypes.object,
    videoUploader: PropTypes.object,
    videoUploadErrors: PropTypes.array,
    videoMimeTypes: PropTypes.array,
    customThumbnail: PropTypes.string,
    thumbnail: PropTypes.string
};
