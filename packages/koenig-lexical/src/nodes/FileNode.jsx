import CardContext from '../context/CardContext';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import React from 'react';
import {FileNode as BaseFileNode, INSERT_FILE_COMMAND} from '@tryghost/kg-default-nodes';
import {FileCard} from '../components/ui/cards/FileCard';
import {ReactComponent as FileCardIcon} from '../assets/icons/kg-card-type-file.svg';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_FILE_COMMAND} from '@tryghost/kg-default-nodes';

function checkIfPopulated(fileDesc, fileName, fileSize, fileTitle, fileSrc) {
    return (
        (fileDesc !== '' && fileDesc !== null && fileDesc !== undefined) ||
      (fileName !== '' && fileName !== null && fileName !== undefined) ||
      (fileSize !== '' && fileSize !== null && fileSize !== undefined) ||
      (fileTitle !== '' && fileTitle !== null && fileTitle !== undefined) ||
      (fileSrc !== '' && fileSrc !== null && fileSrc !== undefined)
    );
}

function FileNodeComponent({
    fileDesc,
    fileDescPlaceholder,
    fileName,
    fileSize,
    fileTitle,
    fileTitlePlaceholder,
    fileSrc,
    nodeKey

}) {
    const [editor] = useLexicalComposerContext();

    const {isSelected, isEditing, setEditing} = React.useContext(CardContext);

    const isPopulated = () => {
        const bool = checkIfPopulated(fileDesc, fileName, fileSize, fileTitle, fileSrc);
        return bool;
    };

    return (
        <FileCard
            fileDesc={fileDesc}
            fileDescPlaceholder={fileDescPlaceholder}
            fileName={fileName}
            fileSize={fileSize}
            fileSrc={fileSrc}
            fileTitle={fileTitle}
            fileTitlePlaceholder={fileTitlePlaceholder}
            isDragDropHover={false}
            isEditing={isEditing}
            isPopulated={isPopulated()}
        />
    );
}

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
        const {triggerFileDialog} = dataset;
        this.__triggerFileDialog = (!dataset.src && triggerFileDialog) || false;
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
                    nodeKey={this.getKey()}
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
