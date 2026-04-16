import React from 'react';

interface AudioUploadFormProps {
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.Ref<HTMLInputElement>;
    filePicker?: () => void;
    mimeTypes?: string[];
}

export function AudioUploadForm({onFileChange, fileInputRef, mimeTypes = ['audio/*']}: AudioUploadFormProps) {
    return (
        <form onChange={onFileChange as unknown as React.FormEventHandler<HTMLFormElement>}>
            <input
                ref={fileInputRef}
                accept={mimeTypes.join(',')}
                hidden={true}
                name="audio-input"
                type='file'
            />
        </form>
    );
}

export default AudioUploadForm;
