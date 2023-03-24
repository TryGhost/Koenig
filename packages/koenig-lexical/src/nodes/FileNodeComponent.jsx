import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext';
import React from 'react';
import useDragAndDrop from '../hooks/useDragAndDrop';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar.jsx';
import {FileCard} from '../components/ui/cards/FileCard';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu.jsx';
import {fileUploadHandler} from '../utils/fileUploadHandler';
import {openFileSelection} from '../utils/openFileSelection';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

function FileNodeComponent({
    fileDesc,
    fileDescPlaceholder,
    fileName,
    fileSize,
    fileTitle,
    fileTitlePlaceholder,
    fileSrc,
    nodeKey,
    triggerFileDialog,
    initialFile

}) {
    const [editor] = useLexicalComposerContext();
    const [isPopulated, setIsPopulated] = React.useState(false);
    const {fileUploader} = React.useContext(KoenigComposerContext);
    const {isSelected, isEditing, setEditing} = React.useContext(CardContext);
    const fileInputRef = React.useRef();
    // const [, setFileInputRef] = React.useState(null);

    const uploader = fileUploader.useFileUpload('file');
    const fileDragHandler = useDragAndDrop({handleDrop: handleFileDrop});

    // const isPopulated = () => {
    //     const bool = checkIfPopulated(fileDesc, fileName, fileSize, fileTitle, fileSrc);
    //     return bool;
    // };

    React.useEffect(() => {
        const uploadInitialFile = async (file) => {
            if (file && !fileSrc) {
                await fileUploadHandler([file], nodeKey, editor, uploader.upload);
            }
        };

        uploadInitialFile(initialFile);

        // We only do this for init
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFileChange = async (e) => {
        const files = e.target.files;

        // reset original src so it can be replaced with preview and upload progress
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setSrc('');
        });

        return await fileUploadHandler(files, nodeKey, editor, uploader.upload);
    };

    // when card is inserted from the card menu or slash command we want to show the file picker immediately
    // uses a setTimeout to avoid issues with React rendering the component twice in dev mode 🙈
    React.useEffect(() => {
        if (!triggerFileDialog) {
            return;
        }

        const renderTimeout = setTimeout(() => {
            // trigger dialog
            openFileSelection({fileInputRef});

            // clear the property on the node so we don't accidentally trigger anything with a re-render
            editor.update(() => {
                const node = $getNodeByKey(nodeKey);
                node.setTriggerFileDialog(false);
            });
        });

        return (() => {
            clearTimeout(renderTimeout);
        });
    });

    React.useEffect(() => {
        // it should always be populated if it has a fileSrc, fileSize and fileName
        if (fileSrc && fileSize && fileName) {
            setIsPopulated(true);
        }
    }, [fileName, fileSize, fileSrc]);

    const onFileInputRef = (element) => {
        fileInputRef.current = element;
    };

    const enableEditing = (e) => {
        // prevent card from propagating click event to the editor
        e.stopPropagation();
        setEditing(true);
    };

    const handleFileTitle = (e) => {
        const title = e.target.value;

        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setTitle(title);
        });
    };

    const handleFileDesc = (e) => {
        const desc = e.target.value;

        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setDescription(desc);
        });
    };

    async function handleFileDrop(files) {
        await fileUploadHandler(files, nodeKey, editor, uploader.upload);
    }

    return (
        <>
            <FileCard
                fileDesc={fileDesc}
                fileDescPlaceholder={fileDescPlaceholder}
                fileDragHandler={fileDragHandler}
                fileInputRef={fileInputRef}
                fileName={fileName}
                fileSize={fileSize}
                fileTitle={fileTitle}
                fileTitlePlaceholder={fileTitlePlaceholder}
                handleFileDesc={handleFileDesc}
                handleFileTitle={handleFileTitle}
                handleSelectorClick={() => openFileSelection({fileInputRef})}
                isEditing={isEditing}
                isPopulated={isPopulated}
                onFileChange={onFileChange}
                onFileInputRef={onFileInputRef}
            />
            <ActionToolbar
                data-kg-card-toolbar="file-upload"
                isVisible={isSelected && !isEditing && isPopulated}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem dataTestId="edit-file-upload-card" icon="edit" isActive={false} label="Edit" onClick={enableEditing} />
                    <ToolbarMenuSeparator />
                    <ToolbarMenuItem icon="snippet" isActive={false} label="Snippet" />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}

export default FileNodeComponent;
