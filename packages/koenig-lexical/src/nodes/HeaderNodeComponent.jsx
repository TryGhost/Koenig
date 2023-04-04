import CardContext from '../context/CardContext';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {HeaderCard} from '../components/ui/cards/HeaderCard';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

function HeaderNodeComponent(props) {
    const {nodeKey} = props;
    const [editor] = useLexicalComposerContext();

    const {isSelected, isEditing, setEditing} = React.useContext(CardContext);

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

    return (
        <HeaderCard
            backgroundColor={props.backgroundColor}
            button={props.button}
            buttonPlaceholder={props.buttonPlaceholder}
            buttonText={props.buttonText}
            buttonUrl={props.buttonUrl}
            handleButtonText={handleButtonText}
            handleButtonToggle={handleButtonToggle}
            handleButtonUrl={handleButtonUrl}
            handleColorSelector={handleColorSelector}
            handleHeadingTextEdit={handleHeadingTextEdit}
            handleSizeSelector={handleSizeSelector}
            handleSubheadingTextEdit={handleSubheadingTextEdit}
            heading={props.heading}
            headingPlaceholder={props.headingPlaceholder}
            isEditing={isEditing}
            size={props.size}
            subHeading={props.subHeading}
            subHeadingPlaceholder={props.subHeadingPlaceholder}
        />
    );
}

export default HeaderNodeComponent;
