import CardContext from '../context/CardContext';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import KoenigComposerContext from '../context/KoenigComposerContext';
import React from 'react';
import useFileDragAndDrop from '../hooks/useFileDragAndDrop';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar';
import {AudioCard} from '../components/ui/cards/AudioCard';
import {ReactComponent as AudioCardIcon} from '../assets/icons/kg-card-type-audio.svg';
import {AudioNode as BaseAudioNode, INSERT_AUDIO_COMMAND} from '@tryghost/kg-default-nodes';
import {SnippetActionToolbar} from '../components/ui/SnippetActionToolbar.jsx';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu';
import {audioUploadHandler} from '../utils/audioUploadHandler';
import {openFileSelection} from '../utils/openFileSelection';
import {thumbnailUploadHandler} from '../utils/thumbnailUploadHandler';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_AUDIO_COMMAND} from '@tryghost/kg-default-nodes';

function AudioNodeComponent({nodeKey, initialFile, src, thumbnailSrc, title, duration, triggerFileDialog}) {
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
        const uploadInitialFiles = async (file) => {
            if (file && !src && !audioUploader.isLoading) {
                await audioUploadHandler([file], nodeKey, editor, audioUploader.upload);
            }
        };
        uploadInitialFiles(initialFile);

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
            node.setTitle(newTitle);
        });
    };

    const removeThumbnail = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setThumbnailSrc('');
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
                node.setTriggerFileDialog(false);
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
                        label="Create snippet"
                        onClick={() => setShowSnippetToolbar(true)}
                    />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}

export class AudioNode extends BaseAudioNode {
    // transient properties used to control node behaviour
    __triggerFileDialog = false;
    __initialFile = null;

    static kgMenu = [{
        label: 'Audio',
        desc: 'Upload and play an audio file',
        Icon: AudioCardIcon,
        insertCommand: INSERT_AUDIO_COMMAND,
        insertParams: {
            triggerFileDialog: true
        },
        matches: ['audio'],
        priority: 14
    }];

    static uploadType = 'audio';

    constructor(dataset = {}, key) {
        super(dataset, key);

        const {triggerFileDialog, initialFile} = dataset;

        // don't trigger the file dialog when rendering if we've already been given a url
        this.__triggerFileDialog = (!dataset.src && triggerFileDialog) || false;
        this.__initialFile = initialFile || null;
    }

    getIcon() {
        return AudioCardIcon;
    }

    setTriggerFileDialog(shouldTrigger) {
        const writable = this.getWritable();
        return writable.__triggerFileDialog = shouldTrigger;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()} width={this.__cardWidth}>
                <AudioNodeComponent
                    duration={this.__duration}
                    initialFile={this.__initialFile}
                    nodeKey={this.getKey()}
                    src={this.__src}
                    thumbnailSrc={this.__thumbnailSrc}
                    title={this.__title}
                    triggerFileDialog={this.__triggerFileDialog}
                />
            </KoenigCardWrapper>
        );
    }
}

export const $createAudioNode = (dataset) => {
    return new AudioNode(dataset);
};

export function $isAudioNode(node) {
    return node instanceof AudioNode;
}
