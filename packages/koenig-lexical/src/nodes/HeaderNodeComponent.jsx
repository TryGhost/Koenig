import CardContext from '../context/CardContext';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {HeaderCard} from '../components/ui/cards/HeaderCard';
import {sanitizeHtml} from '../utils/sanitize-html';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

function HeaderNodeComponent(props) {
    const {nodeKey} = props;
    const [editor] = useLexicalComposerContext();

    const {isSelected, isEditing, setEditing} = React.useContext(CardContext);

    const handleHeadingTextEdit = (text) => {
        console.log(nodeKey);
        console.log('handleHeadingTextEdit', text);
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
            node.setSubheading(text);
        });
    };

    return (
        <HeaderCard
            backgroundColor={props.backgroundColor}
            button={props.button}
            buttonPlaceholder={props.buttonPlaceholder}
            buttonText={props.buttonText}
            buttonUrl={props.buttonUrl}
            handleHeadingTextEdit={handleHeadingTextEdit}
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
