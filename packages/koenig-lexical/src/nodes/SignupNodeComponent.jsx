import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext';
import useFileDragAndDrop from '../hooks/useFileDragAndDrop';
import useFocusHistory from '../hooks/useFocusHistory';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar';
import {EDIT_CARD_COMMAND} from '../plugins/KoenigBehaviourPlugin';
import {SignupCard} from '../components/ui/cards/SignupCard.jsx';
import {SnippetActionToolbar} from '../components/ui/SnippetActionToolbar.jsx';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu';
import {backgroundImageUploadHandler} from '../utils/imageUploadHandler';
import {useContext, useEffect, useState} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

function SignupNodeComponent({
    alignment,
    backgroundColor,
    backgroundImageSrc,
    buttonColor,
    buttonPlaceholder,
    buttonText,
    nodeKey,
    disclaimer,
    disclaimerPlaceholder,
    disclaimerTextEditor,
    disclaimerTextEditorInitialState,
    header,
    headerPlaceholder,
    headerTextEditor,
    headerTextEditorInitialState,
    labels,
    layout,
    subheader,
    subheaderPlaceholder,
    subheaderTextEditor,
    subheaderTextEditorInitialState
}) {
    const [editor] = useLexicalComposerContext();
    const {cardConfig} = useContext(KoenigComposerContext);
    const {fileUploader} = useContext(KoenigComposerContext);
    const {isEditing, isSelected} = useContext(CardContext);
    const [showSnippetToolbar, setShowSnippetToolbar] = useState(false);
    const [availableLabels, setAvailableLabels] = useState([]);
    const [showBackgroundImage, setShowBackgroundImage] = useState(Boolean(backgroundImageSrc));
    const {restorePreviousFocus} = useFocusHistory({enabled: isEditing});

    useEffect(() => {
        if (cardConfig?.fetchLabels) {
            cardConfig.fetchLabels().then((options) => {
                setAvailableLabels(options);
            });
        }
    }, [cardConfig]);

    useEffect(() => {
        if (layout !== 'split') {
            setShowBackgroundImage(Boolean(backgroundImageSrc));
        }
        // We just want to reset the show background image state when the layout changes, not when the image changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layout]);

    const handleAlignment = (a) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setAlignment(a);
            restorePreviousFocus();
        });
    };

    const handleToolbarEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        editor.dispatchCommand(EDIT_CARD_COMMAND, {cardKey: nodeKey});
    };

    const imageUploader = fileUploader.useFileUpload('image');

    const handleImageChange = async (files) => {
        // reset original src so it can be replaced with preview and upload progress
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setBackgroundImageSrc('');
        });

        const {imageSrc} = await backgroundImageUploadHandler(files, imageUploader.upload);

        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setBackgroundImageSrc(imageSrc);
        });
    };

    const onFileChange = async (e) => {
        handleImageChange(e.target.files);
    };

    const imageDragHandler = useFileDragAndDrop({handleDrop: handleImageChange});

    const handleLayout = (l) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setLayout(l);
            restorePreviousFocus();
        });
    };

    const handleButtonText = (event) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setButtonText(event.target.value);
        });
    };

    const handleClearBackgroundImage = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setBackgroundImageSrc('');
        });
    };

    const handleToggleBackgroundImage = (e) => {
        if (e.target.checked) {
            setShowBackgroundImage(true);
        } else {
            setShowBackgroundImage(false);
            handleClearBackgroundImage();
        }
    };

    const handleBackgroundColor = (color) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setBackgroundColor(color);
        });
    };

    const handleButtonColor = (color) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setButtonColor(color);
        });
    };

    const handleLabels = (newLabels) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setLabels(newLabels);
        });
    };

    useEffect(() => {
        headerTextEditor.setEditable(isEditing);
        subheaderTextEditor.setEditable(isEditing);
    }, [isEditing, headerTextEditor, subheaderTextEditor]);

    return (
        <>
            <SignupCard
                alignment={alignment}
                availableLabels={availableLabels}
                backgroundColor={backgroundColor}
                backgroundImageSrc={backgroundImageSrc}
                buttonColor={buttonColor}
                buttonText={buttonText}
                disclaimer={disclaimer}
                disclaimerTextEditor={disclaimerTextEditor}
                disclaimerTextEditorInitialState={disclaimerTextEditorInitialState}
                fileUploader={imageUploader}
                handleAlignment={handleAlignment}
                handleBackgroundColor={handleBackgroundColor}
                handleButtonColor={handleButtonColor}
                handleButtonText={handleButtonText}
                handleClearBackgroundImage={handleClearBackgroundImage}
                handleLabels={handleLabels}
                handleLayout={handleLayout}
                handleToggleBackgroundImage={handleToggleBackgroundImage}
                header={header}
                headerTextEditor={headerTextEditor}
                headerTextEditorInitialState={headerTextEditorInitialState}
                imageDragHandler={imageDragHandler}
                isEditing={isEditing}
                labels={labels}
                layout={layout}
                showBackgroundImage={showBackgroundImage}
                subheader={subheader}
                subheaderTextEditor={subheaderTextEditor}
                subheaderTextEditorInitialState={subheaderTextEditorInitialState}
                onFileChange={onFileChange}
            />
            <ActionToolbar
                data-kg-card-toolbar="signup"
                isVisible={showSnippetToolbar}
            >
                <SnippetActionToolbar onClose={() => setShowSnippetToolbar(false)} />
            </ActionToolbar>

            <ActionToolbar
                data-kg-card-toolbar="signup"
                isVisible={isSelected && !isEditing && !showSnippetToolbar}
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

export default SignupNodeComponent;
