import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {HeaderCard} from '../components/ui/cards/HeaderCard';
import {backgroundImageUploadHandler} from '../utils/imageUploadHandler';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

function HeaderNodeComponent(props) {
    const {nodeKey} = props;
    const [editor] = useLexicalComposerContext();
    const {fileUploader} = React.useContext(KoenigComposerContext);

    const {isEditing} = React.useContext(CardContext);

    const imageUploader = fileUploader.useFileUpload('image');

    const onFileChange = async (e) => {
        const files = e.target.files;

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

    const [backgroundImagePreview, setBackgroundImagePreview] = React.useState(false);

    const fileInputRef = React.useRef(null);

    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    const toggleBackgroundImagePreview = () => {
        setBackgroundImagePreview(!backgroundImagePreview);
    };

    React.useEffect(() => {
        if (props.backgroundImageSrc !== '') {
            setBackgroundImagePreview(true);
        }
    }, [props.backgroundImageSrc]);

    const handleHeadingTextEdit = (text) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setHeader(text);
        });
    };

    const handleSubheadingTextEdit = (text) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setSubheader(text);
        });
    };

    const handleColorSelector = (color) => {
        color === 'bg-image' ? setBackgroundImagePreview(true) : setBackgroundImagePreview(false);

        if (color === 'bg-image' && props.backgroundImageSrc === ''){
            openFilePicker();
        }
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setBackgroundImageStyle(color);
        });
    };

    const handleSizeSelector = (size) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setSize(size);
        });
    };

    const handleButtonToggle = (event) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setButtonEnabled(event.target.checked);
        });
    };
    
    const handleButtonText = (event) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setButtonText(event.target.value);
        });
    };

    const handleButtonUrl = (event) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setButtonUrl(event.target.value);
        });
    };

    const handleClearBackgroundImage = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setBackgroundImageSrc('');
        });
    };

    return (
        <HeaderCard
            backgroundColor={props.backgroundColor}
            backgroundImagePreview={backgroundImagePreview}
            backgroundImageSrc={props.backgroundImageSrc}
            backgroundImageStyle={props.backgroundImageStyle}
            button={props.button}
            buttonPlaceholder={props.buttonPlaceholder}
            buttonText={props.buttonText}
            buttonUrl={props.buttonUrl}
            fileInputRef={fileInputRef}
            fileUploader={imageUploader}
            handleButtonText={handleButtonText}
            handleButtonToggle={handleButtonToggle}
            handleButtonUrl={handleButtonUrl}
            handleClearBackgroundImage={handleClearBackgroundImage}
            handleColorSelector={handleColorSelector}
            handleHeadingTextEdit={handleHeadingTextEdit}
            handleSizeSelector={handleSizeSelector}
            handleSubheadingTextEdit={handleSubheadingTextEdit}
            headerTextEditor={props.headerTextEditor}
            heading={props.heading}
            headingPlaceholder={props.headingPlaceholder}
            isEditing={isEditing}
            openFilePicker={openFilePicker}
            size={props.size}
            subHeaderTextEditor={props.subHeaderTextEditor}
            subHeading={props.subHeading}
            subHeadingPlaceholder={props.subHeadingPlaceholder}
            toggleBackgroundImagePreview={toggleBackgroundImagePreview}
            onFileChange={onFileChange}

        />
    );
}

export default HeaderNodeComponent;
