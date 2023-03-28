import FileUploadForm from '../FileUploadForm';
import PropTypes from 'prop-types';
import React from 'react';
import {ReactComponent as FileUploadIcon} from '../../../assets/icons/kg-file-upload.svg';
import {MediaPlaceholder} from '../MediaPlaceholder';
import {ProgressBar} from '../ProgressBar';
import {openFileSelection} from '../../../utils/openFileSelection';

function FileUploading({progress}) {
    const progressStyle = {
        width: `${progress?.toFixed(0)}%`
    };

    return (
        <div className="h-full border border-transparent">
            <div className="relative flex h-full items-center justify-center border border-grey/20 bg-grey-50 before:pb-[12.5%]">
                <div className="flex w-full items-center justify-center overflow-hidden">
                    <ProgressBar style={progressStyle} />
                </div>
            </div>
        </div>
    );
}

function EmptyFileCard({handleSelectorClick, fileDragHandler}) {
    return (
        <MediaPlaceholder
            desc="Click to upload a file"
            filePicker={() => handleSelectorClick()}
            icon='file'
            isDraggedOver={fileDragHandler.isDraggedOver}
            placeholderRef={fileDragHandler.setRef}
            size='xsmall'
        />
    );
}

function PopulatedFileCard({isEditing, title, titlePlaceholder, desc, descPlaceholder, name, size, handleFileTitle, handleFileDesc, ...args}) {
    return (
        <div className="flex justify-between rounded border border-grey/30 p-2">
            <div className="flex w-full flex-col justify-between px-2 font-sans" {...args}>
                <div className="flex flex-col">
                    { (isEditing || title) && <input className="h-[30px] bg-transparent text-lg font-bold leading-none tracking-tight text-black dark:text-grey-200" data-kg-file-card="fileTitle" placeholder={titlePlaceholder} value={title} onChange={handleFileTitle} />}
                    { (isEditing || desc) && <input className="h-[26px] bg-transparent pb-1 text-[1.6rem] font-normal leading-none text-grey-700 placeholder:text-grey-500 dark:text-grey-300 dark:placeholder:text-grey-800" data-kg-file-card="fileDescription" placeholder={descPlaceholder} value={desc} onChange={handleFileDesc} />}
                </div>
                <div className="py-1 text-sm font-medium text-grey-900 dark:text-grey-200" data-kg-file-card="dataset">
                    {name}
                    <span className="text-grey-700"> • {size}</span>
                </div>
            </div>
            <div className={`flex w-full max-w-[96px] items-center justify-center rounded bg-grey-200 dark:bg-grey-900 ${((title && desc) || isEditing) ? 'h-[96px]' : (title || desc) ? 'h-[64px]' : 'h-[40px]'}`}>
                <FileUploadIcon className={`text-green transition-all duration-75 ease-in ${((title || desc) || isEditing) ? 'h-6 w-6' : 'h-5 w-5'}`} />
            </div>
        </div>
    );
}

export function FileCard(
    {isPopulated, 
        fileTitle, 
        fileTitlePlaceholder, 
        fileDesc, 
        fileDescPlaceholder, 
        fileName, 
        fileSize, 
        fileDragHandler,
        isEditing,
        fileInputRef,
        onFileChange,
        handleFileTitle,
        handleFileDesc,
        fileUploader,
        ...args}) {
    const {isLoading: isUploading, progress} = fileUploader;
    const setFileInputRef = (ref) => {
        if (fileInputRef) {
            fileInputRef.current = ref.current;
        }
    };
    const onFileInputRef = (element) => {
        fileInputRef.current = element;
        setFileInputRef(fileInputRef);
    };
    const handleOpenFileSelection = () => {
        openFileSelection({fileInputRef: fileInputRef});
    };
    if (isUploading) {
        return (
            <FileUploading progress={progress} />
        );
    }
    if (isPopulated) {
        return (
            <PopulatedFileCard 
                desc={fileDesc}
                descPlaceholder={fileDescPlaceholder}
                handleFileDesc={handleFileDesc} 
                handleFileTitle={handleFileTitle}
                isEditing={isEditing}
                name={fileName}
                size={fileSize}
                title={fileTitle}
                titlePlaceholder={fileTitlePlaceholder}
                {...args} 
            />
        );
    }
    
    return (
        <>
            <EmptyFileCard
                fileDragHandler={fileDragHandler}
                handleSelectorClick={handleOpenFileSelection}
            />
            <FileUploadForm
                fileInputRef={onFileInputRef}
                setFileInputRef={setFileInputRef}
                onFileChange={onFileChange}
            />
        </>
    );
}

FileCard.propTypes = {
    isPopulated: PropTypes.bool,
    fileTitle: PropTypes.string,
    fileTitlePlaceholder: PropTypes.string,
    fileDesc: PropTypes.string,
    fileDescPlaceholder: PropTypes.string,
    fileName: PropTypes.string,
    fileSize: PropTypes.string
};