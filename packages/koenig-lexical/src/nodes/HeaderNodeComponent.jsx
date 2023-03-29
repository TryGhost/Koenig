import CardContext from '../context/CardContext';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {HeaderCard} from '../components/ui/cards/HeaderCard';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

function HeaderNodeComponent(props) {
    const {nodeKey} = props;
    const [editor] = useLexicalComposerContext();

    const {isSelected, isEditing, setEditing} = React.useContext(CardContext);

    const handleHeadingTextEdit = (event) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setHeading(event.target.innerText);
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
