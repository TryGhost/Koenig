import KoenigCardWrapper from '../components/KoenigCardWrapper';
import React from 'react';

import {FileNode as BaseFileNode, INSERT_FILE_COMMAND} from '@tryghost/kg-default-nodes';

import FileNodeComponent from './FileNodeComponent';
import {ReactComponent as FileCardIcon} from '../assets/icons/kg-card-type-file.svg';
// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_FILE_COMMAND} from '@tryghost/kg-default-nodes';

export class FileNode extends BaseFileNode {
    __triggerFileDialog = false;

    static kgMenu = [{
        label: 'File',
        desc: 'Upload a downloadable file',
        Icon: FileCardIcon,
        insertCommand: INSERT_FILE_COMMAND,
        matches: ['file'],
        insertParams: {
            triggerFileDialog: true
        },
        queryParams: ['src']
    }];

    constructor(dataset = {}, key) {
        super(dataset, key);
        const {triggerFileDialog, initialFile} = dataset;
        this.__triggerFileDialog = (!dataset.src && triggerFileDialog) || false;
        // passed via INSERT_MEDIA_COMMAND on drag+drop or paste
        this.__initialFile = initialFile || null;
    }

    getDataset() {
        const dataset = super.getDataset();

        dataset.__triggerFileDialog = this.__triggerFileDialog;
        dataset.__previewSrc = this.__previewSrc;

        return dataset;
    }

    setTriggerFileDialog(shouldTrigger) {
        const writable = this.getWritable();
        return writable.__triggerFileDialog = shouldTrigger;
    }

    createDOM() {
        return document.createElement('div');
    }

    decorate() {
        return (
            <KoenigCardWrapper
                nodeKey={this.getKey()}
            >
                <FileNodeComponent
                    fileDesc={this.getDescription()}
                    fileDescPlaceholder={'Enter a description'}
                    fileName={this.getFileName()} 
                    fileSize={this.getFileSize()}
                    fileSrc = {this.getSrc()}
                    fileTitle={this.getTitle()}
                    fileTitlePlaceholder={'Enter a title'}
                    initialFile={this.__initialFile}
                    nodeKey={this.getKey()}
                    triggerFileDialog={this.__triggerFileDialog}
                />
            </KoenigCardWrapper>
        );
    }
}

export const $createFileNode = (dataset) => {
    return new FileNode(dataset);
};

export function $isFileNode(node) {
    return node instanceof FileNode;
}
