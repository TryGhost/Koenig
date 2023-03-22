import CardContext from '../context/CardContext';
import React from 'react';
import {FileNode as BaseFileNode, INSERT_FILE_COMMAND} from '@tryghost/kg-default-nodes';
import {ReactComponent as FileCardIcon} from '../assets/icons/kg-card-type-file.svg';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_FILE_COMMAND} from '@tryghost/kg-default-nodes';

function FileNodeComponent({nodeKey}) {
    const [editor] = useLexicalComposerContext();

    const {isSelected, isEditing, setEditing} = React.useContext(CardContext);

    return (
        <>
        </>
    );
}

export class FileNode extends BaseFileNode {
    static kgMenu = [{
        label: 'File',
        desc: 'Upload a downloadable file',
        Icon: FileCardIcon,
        insertCommand: INSERT_FILE_COMMAND,
        matches: ['file']
    }];

    constructor(dataset = {}, key) {
        super(dataset, key);
    }

    decorate() {
        return <FileNodeComponent nodeKey={this.key} />;
    }
}

export const $createFileNode = (dataset) => {
    return new FileNode(dataset);
};

export function $isFileNode(node) {
    return node instanceof FileNode;
}
