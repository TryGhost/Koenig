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
        // this text should come from lexical
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setHeader(text);
        });
    };

    const handleSubheadingTextEdit = (text) => {
        // this text should come from lexical
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setSubheader(text);
        });
    };

    const handleColorSelector = (color) => {
        // this text should come from lexical
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setBackgroundImageStyle(color);
        });
    };

    const handleSizeSelector = (size) => {
        // this text should come from lexical
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setSize(size);
        });
    };

    return (
        <HeaderCard
            backgroundColor={props.backgroundColor}
            button={props.button}
            buttonPlaceholder={props.buttonPlaceholder}
            buttonText={props.buttonText}
            buttonUrl={props.buttonUrl}
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
