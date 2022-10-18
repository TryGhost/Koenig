import React from 'react';
import {$getNodeByKey} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import CardContext from '../../../context/CardContext';
import ImageCard from './ImageCard';
import KoenigComposerContext from '../../../context/KoenigComposerContext';

function ImageCardContainer({nodeKey}) {
    const [editor] = useLexicalComposerContext();
    const [payload, setPayload] = React.useState({});
    const {isSelected} = React.useContext(CardContext);
    const {imageUploader} = React.useContext(KoenigComposerContext);
    const [altText, setAltText] = React.useState(true);

    const onUploadChange = async (e) => {
        const fls = e.target.files;
        const files = await imageUploader.imageUploader(fls); // idea here is to have something like imageUploader.uploadProgressPercentage to pass to the progress bar.
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setSrc(files.src);
            setPayload(node.getPayload());
        });
    };

    React.useEffect(() => {
        const editorState = editor.getEditorState();
        editorState.read(() => {
            const node = $getNodeByKey(nodeKey);
            setPayload(node.getPayload());
        });
    }, [editor, nodeKey]);

    const updateCaption = (cap) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setCaption(cap);
            setPayload(node.getPayload());
        });
    };

    const updateAltText = (alt) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setAltText(alt);
            setPayload(node.getPayload());
        });
    };

    const handleCapInput = (e) => {
        if (!altText) {
            const cap = e.target.value;
            updateCaption(cap);
        } else {
            const alt = e.target.value;
            updateAltText(alt);
        }
    };

    return (
        <ImageCard
            payload={payload}
            editor={editor}
            nodeKey={nodeKey}
            isSelected={isSelected}
            onUploadChange={onUploadChange}
            updateCaption={updateCaption}
            updateAltText={updateAltText}
            handleCapInput={handleCapInput}
            toggleAltText={{altText, setAltText}}
        />
    );
}

export default ImageCardContainer;
