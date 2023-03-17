import CardContext from '../context/CardContext';
import React, {useState} from 'react';
import {$getNodeByKey} from 'lexical';
import {ToggleCard} from '../components/ui/cards/ToggleCard';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function ToggleNodeComponent({nodeKey, content, contentPlaceholder, header, headerPlaceholder}) {
    const [editor] = useLexicalComposerContext();
    const cardContext = React.useContext(CardContext);

    const [isContentVisible, setContentVisible] = useState(false);

    const toggleContent = () => {
        setContentVisible(!isContentVisible);
    };

    const setHeader = (newHeader) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setHeader(newHeader);
        });
    };

    const setContent = (newContent) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setContent(newContent);
        });
    };

    return (
        <ToggleCard
            content={content}
            contentPlaceholder={contentPlaceholder}
            header={header}
            headerPlaceholder={headerPlaceholder}
            isContentVisible={isContentVisible}
            isEditing={cardContext.isEditing}
            isSelected={cardContext.isSelected}
            setContent={setContent}
            setHeader={setHeader}
            toggleContent={toggleContent}
        />
    );
}
