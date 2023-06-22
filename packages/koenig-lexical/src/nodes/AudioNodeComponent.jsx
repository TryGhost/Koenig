import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext';
import React from 'react';
import useFileDragAndDrop from '../hooks/useFileDragAndDrop';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar';
import {AudioCard} from '../components/ui/cards/AudioCard';
import {SnippetActionToolbar} from '../components/ui/SnippetActionToolbar.jsx';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu';
import {audioUploadHandler} from '../utils/audioUploadHandler';
import {openFileSelection} from '../utils/openFileSelection';
import {thumbnailUploadHandler} from '../utils/thumbnailUploadHandler';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function AudioNodeComponent({duration, initialFile, nodeKey, src, thumbnailSrc, title, triggerFileDialog}) {
    const [editor] = useLexicalComposerContext();
    const {fileUploader, cardConfig} = React.useContext(KoenigComposerContext);
    const {isSelected, isEditing, setEditing} = React.useContext(CardContext);
    const audioFileInputRef = React.useRef();
    const thumbnailFileInputRef = React.useRef();
    const cardContext = React.useContext(CardContext);
    const [showSnippetToolbar, setShowSnippetToolbar] = React.useState(false);

    const audioUploader = fileUploader.useFileUpload('audio');
    const thumbnailUploader = fileUploader.useFileUpload('mediaThumbnail');
    const audioDragHandler = useFileDragAndDrop({handleDrop: handleAudioDrop});
    const thumbnailDragHandler = useFileDragAndDrop({handleDrop: handleThumbnailDrop, disabled: !isEditing});

    React.useEffect(() => {
        const uploadInitialFile = async (file) => {
            if (file && !src && !audioUploader.isLoading) {
                await audioUploadHandler([file], nodeKey, editor, audioUploader.upload);
            }
        };

        uploadInitialFile(initialFile);

        // We only do this for init
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onAudioFileChange = async (e) => {
        const fls = e.target.files;
        return await audioUploadHandler(fls, nodeKey, editor, audioUploader.upload);
    };

    const onThumbnailFileChange = async (e) => {
        const fls = e.target.files;
        return await thumbnailUploadHandler(fls, nodeKey, editor, thumbnailUploader.upload);
    };

    const setTitle = (newTitle) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.title = newTitle;
        });
    };

    const removeThumbnail = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.thumbnailSrc = '';
        });
    };

    async function handleAudioDrop(files) {
        await audioUploadHandler(files, nodeKey, editor, audioUploader.upload);
    }

    async function handleThumbnailDrop(files) {
        await thumbnailUploadHandler(files, nodeKey, editor, thumbnailUploader.upload);
    }

    const handleToolbarEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setEditing(true);
    };

    // when card is inserted from the card menu or slash command we want to show the file picker immediately
    // uses a setTimeout to avoid issues with React rendering the component twice in dev mode 🙈
    React.useEffect(() => {
        if (!triggerFileDialog) {
            return;
        }

        const renderTimeout = setTimeout(() => {
            // trigger dialog
            openFileSelection({fileInputRef: audioFileInputRef});

            // clear the property on the node so we don't accidentally trigger anything with a re-render
            editor.update(() => {
                const node = $getNodeByKey(nodeKey);
                node.triggerFileDialog = false;
            });
        });

        return (() => {
            clearTimeout(renderTimeout);
        });
    });

    return (
        <>
            <AudioCard
                audioDragHandler={audioDragHandler}
                audioFileInputRef={audioFileInputRef}
                audioMimeTypes={fileUploader.fileTypes.audio?.mimeTypes}
                audioUploader={audioUploader}
                duration={duration}
                isEditing={cardContext.isEditing}
                nodeKey={nodeKey}
                removeThumbnail={removeThumbnail}
                src={src}
                thumbnailDragHandler={thumbnailDragHandler}
                thumbnailFileInputRef={thumbnailFileInputRef}
                thumbnailMimeTypes={fileUploader.fileTypes.image?.mimeTypes}
                thumbnailSrc={thumbnailSrc}
                thumbnailUploader={thumbnailUploader}
                title={title}
                updateTitle={setTitle}
                onAudioFileChange={onAudioFileChange}
                onThumbnailFileChange={onThumbnailFileChange}
            />
            <ActionToolbar
                data-kg-card-toolbar="audio"
                isVisible={showSnippetToolbar}
            >
                <SnippetActionToolbar onClose={() => setShowSnippetToolbar(false)} />
            </ActionToolbar>

            <ActionToolbar
                data-kg-card-toolbar="audio"
                isVisible={src && isSelected && !isEditing && !showSnippetToolbar}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem icon="edit" isActive={false} label="Edit" onClick={handleToolbarEdit} />
                    <ToolbarMenuSeparator hide={!cardConfig.createSnippet} />
                    <ToolbarMenuItem
                        dataTestId="create-snippet"
                        hide={!cardConfig.createSnippet}
                        icon="snippet"
                        isActive={false}
                        label="Snippet"
                        onClick={() => setShowSnippetToolbar(true)}
                    />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}