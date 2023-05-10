import KoenigNestedEditor from '../../KoenigNestedEditor';
import PropTypes from 'prop-types';
import React from 'react';
import {Button} from '../Button';
import {ColorPickerSetting, InputSetting, SettingsDivider, SettingsPanel} from '../SettingsPanel';
import {ReactComponent as FileUploadIcon} from '../../../assets/icons/kg-upload-fill.svg';
import {ProgressBar} from '../ProgressBar';
import {ReactComponent as TrashIcon} from '../../../assets/icons/kg-trash.svg';
import {isEditorEmpty} from '../../../utils/isEditorEmpty';

export const SIGNUP_COLORS = {
    dark: 'bg-black',
    light: 'bg-grey-100',
    accent: 'bg-accent',
    image: 'bg-grey-300 dark:bg-grey-950 bg-gradient-to-t from-black/0 via-black/5 to-black/30'
};

export const SIGNUP_TEXT_COLORS = {
    dark: 'text-white caret-white',
    light: 'text-black caret-black',
    // kg-header-accent fixes the link color
    accent: 'text-white caret-white kg-header-accent',
    image: 'text-white caret-white'
};

function FileUploading({progress}) {
    const progressStyle = {
        width: `${progress?.toFixed(0)}%`
    };

    return (
        <div className="h-full border border-transparent">
            <div className="border-grey/20 bg-grey-50 dark:bg-grey-900 relative flex h-[120px] items-center justify-center border before:pb-[12.5%]">
                <div className="flex w-full items-center justify-center overflow-hidden">
                    <ProgressBar style={progressStyle} />
                </div>
            </div>
        </div>
    );
}

function ImagePicker({onFileChange,
    backgroundImageSrc,
    handleClearBackgroundImage,
    fileInputRef,
    backgroundImagePreview,
    openFilePicker,
    isUploading,
    progress}) {
    if (isUploading) {
        return (
            <FileUploading progress={progress} />
        );
    }
    return (
        <>
            <form onChange={onFileChange}>
                <input
                    ref={fileInputRef}
                    accept='image/*'
                    hidden={true}
                    name="image-input"
                    type='file'
                />
            </form>
            {
                backgroundImagePreview && (
                    <div className="w-full">
                        <div className="relative">
                            <div className="flex w-full items-center justify-center">
                                {
                                    backgroundImageSrc ?
                                        <>
                                            <div className="group relative mb-4 w-full rounded">
                                                <div className="absolute inset-0 rounded bg-gradient-to-t from-black/0 via-black/5 to-black/30 opacity-0 transition-all group-hover:opacity-100">
                                                </div>
                                                <div className="absolute top-5 right-5 flex opacity-0 transition-all group-hover:opacity-100">
                                                    <button className="pointer-events-auto flex h-8 w-9 cursor-pointer items-center justify-center rounded bg-white/90 transition-all hover:bg-white" type="button" onClick={handleClearBackgroundImage}>
                                                        <TrashIcon className="fill-grey-900 h-5 w-5 stroke-[3px] transition-all ease-linear group-hover:scale-105" />
                                                    </button>
                                                </div>
                                                <img alt='backgroundHeaderImage' className="max-h-64 w-full rounded object-cover" data-testid="image-picker-background" src={backgroundImageSrc} />
                                            </div>
                                        </>
                                        :
                                        <button className="border-grey-300 bg-grey-50 dark:border-grey-800 dark:bg-grey-900 group flex h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed" type="button" onClick={openFilePicker}>
                                            <FileUploadIcon className="fill-grey-700 h-5 w-5 stroke-[3px] transition-all ease-linear group-hover:scale-105" />
                                            <span className="text-grey-700 px-1 text-[1.35rem] font-medium">Click to upload background image</span>
                                        </button>
                                }
                            </div>
                        </div>
                    </div>
                )
            }

        </>
    );
}

export function SignupCard({type,
    header,
    headerPlaceholder,
    subheader,
    subheaderPlaceholder,
    disclaimer,
    disclaimerPlaceholder,
    buttonText,
    buttonPlaceholder,
    backgroundImageSrc,
    backgroundImagePreview,
    isEditing,
    fileUploader,
    fileInputRef,
    handleColorSelector,
    handleButtonText,
    handleClearBackgroundImage,
    openFilePicker,
    onFileChange,
    headerTextEditor,
    headerTextEditorInitialState,
    subheaderTextEditor,
    subheaderTextEditorInitialState,
    disclaimerTextEditor,
    disclaimerTextEditorInitialState}) {
    const colorPickerChildren = [
        {
            label: 'Dark',
            name: 'dark',
            color: 'bg-black'
        },
        {
            label: 'Light',
            name: 'light',
            color: 'bg-grey-50'
        },
        {
            label: 'Accent',
            name: 'accent',
            color: 'bg-accent'
        },
        {
            label: 'Background Image', // technically not a color, but it could have some styles associated with it when a background image is added.
            name: 'image',
            color: 'bg-grey-50'
        }
    ];

    const {isLoading: isUploading, progress} = fileUploader || {};

    return (
        <>
            <div className={`flex min-h-[60vh] flex-col items-center justify-center p-[12vmin] text-center font-sans transition-colors ease-in-out ${SIGNUP_COLORS[type]} `}
                style={backgroundImageSrc && type === 'image' ? {
                    backgroundImage: `url(${backgroundImageSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundColor: 'bg-grey-950'
                } : null}>

                {/* Heading */}
                {
                    (isEditing || !!header || !isEditorEmpty(headerTextEditor)) && (
                        <KoenigNestedEditor
                            autoFocus={true}
                            focusNext={subheaderTextEditor}
                            hasSettingsPanel={true}
                            initialEditor={headerTextEditor}
                            initialEditorState={headerTextEditorInitialState}
                            nodes="minimal"
                            placeholderClassName={`truncate opacity-50 whitespace-normal !tracking-tight !text-center w-full !leading-tight !font-bold !text-7xl ${SIGNUP_TEXT_COLORS[type]}`}
                            placeholderText={headerPlaceholder}
                            singleParagraph={true}
                            textClassName={`koenig-lexical-header-heading relative w-full whitespace-normal text-center font-bold text-center [&:has(br)]:text-left koenig-lexical-header-medium [&:has(br)]:pl-[calc(50%_-_304px)] ${SIGNUP_TEXT_COLORS[type]}`}
                        />
                    )
                }

                {/* Subheading */}
                {
                    (isEditing || !!subheader || !isEditorEmpty(subheaderTextEditor)) && (
                        <KoenigNestedEditor
                            hasSettingsPanel={true}
                            initialEditor={subheaderTextEditor}
                            initialEditorState={subheaderTextEditorInitialState}
                            nodes="minimal"
                            placeholderClassName={`truncate opacity-50 w-full whitespace-normal !text-center !leading-tight !font-normal !text-2xl ${SIGNUP_TEXT_COLORS[type]}`}
                            placeholderText={subheaderPlaceholder}
                            singleParagraph={true}
                            // TODO: Different class names for signup?
                            textClassName={`koenig-lexical-header-subheading relative w-full whitespace-normal text-center [&:has(br)]:text-left koenig-lexical-header-medium [&:has(br)]:pl-[calc(50%_-_124px)] !mt-3 ${SIGNUP_TEXT_COLORS[type]}`}
                        />
                    )
                }

                {/* Form */}
                <div className="mt-8 flex">
                    <div className="mr-4 flex items-center rounded border border-white px-4">Enter your email</div>
                    <Button color={type === 'light' ? 'accent' : 'light'} dataTestId="header-card-button" placeholder={buttonPlaceholder} size='medium' value={buttonText} />
                </div>

                {/* Disclaimer */}
                {
                    (isEditing || !!disclaimer || !isEditorEmpty(disclaimerTextEditor)) && (
                        <KoenigNestedEditor
                            hasSettingsPanel={true}
                            initialEditor={disclaimerTextEditor}
                            initialEditorState={disclaimerTextEditorInitialState}
                            nodes="minimal"
                            placeholderClassName={`truncate opacity-50 w-full whitespace-normal !text-center !leading-tight !font-normal ${SIGNUP_TEXT_COLORS[type]}`}
                            placeholderText={disclaimerPlaceholder}
                            singleParagraph={true}
                            textClassName={`koenig-lexical-signup-disclaimer relative w-full whitespace-normal text-center [&:has(br)]:text-left [&:has(br)]:pl-[calc(50%_-_88px)] !mt-6 ${SIGNUP_TEXT_COLORS[type]}`}
                        />
                    )
                }

                {/* Read-only overlay */}
                {!isEditing && <div className="absolute top-0 z-10 !m-0 h-full w-full cursor-default p-0"></div>}
            </div>

            {isEditing && (
                <SettingsPanel className="mt-0">
                    <ColorPickerSetting
                        buttons={colorPickerChildren}
                        label='Style'
                        selectedName={type}
                        onClick={handleColorSelector}
                    />
                    <ImagePicker
                        backgroundImagePreview={backgroundImagePreview}
                        backgroundImageSrc={backgroundImageSrc}
                        fileInputRef={fileInputRef}
                        handleClearBackgroundImage={handleClearBackgroundImage}
                        isUploading={isUploading}
                        openFilePicker={openFilePicker}
                        progress={progress}
                        onFileChange={onFileChange}
                    />
                    <SettingsDivider />
                    <InputSetting
                        dataTestId='header-button-text'
                        label='Button text'
                        placeholder='Add button text'
                        value={buttonText}
                        onChange={handleButtonText}
                    />
                </SettingsPanel>
            )}
        </>
    );
}

SignupCard.propTypes = {
    type: PropTypes.oneOf(['dark', 'light', 'accent', 'image']),
    header: PropTypes.string,
    headerPlaceholder: PropTypes.string,
    subheader: PropTypes.string,
    subheaderPlaceholder: PropTypes.string,
    disclaimer: PropTypes.string,
    disclaimerPlaceholder: PropTypes.string,
    buttonText: PropTypes.string,
    buttonPlaceholder: PropTypes.string,
    backgroundImageSrc: PropTypes.string,
    backgroundImagePreview: PropTypes.bool,
    isEditing: PropTypes.bool,
    fileUploader: PropTypes.object,
    fileInputRef: PropTypes.object,
    handleColorSelector: PropTypes.func,
    handleButtonText: PropTypes.func,
    handleClearBackgroundImage: PropTypes.func,
    openFilePicker: PropTypes.func,
    onFileChange: PropTypes.func,
    headerTextEditor: PropTypes.object,
    headerTextEditorInitialState: PropTypes.string,
    subheaderTextEditor: PropTypes.object,
    subheaderTextEditorInitialState: PropTypes.string,
    disclaimerTextEditor: PropTypes.object,
    disclaimerTextEditorInitialState: PropTypes.string
};

FileUploading.propTypes = {
    progress: PropTypes.number
};

ImagePicker.propTypes = {
    backgroundImagePreview: PropTypes.bool,
    backgroundImageSrc: PropTypes.string,
    fileInputRef: PropTypes.object,
    handleClearBackgroundImage: PropTypes.func,
    isUploading: PropTypes.bool,
    openFilePicker: PropTypes.func,
    progress: PropTypes.number,
    onFileChange: PropTypes.func
};
