import CardContext from '../context/CardContext';
import React, {useEffect, useRef, useState} from 'react';
import {$getNodeByKey} from 'lexical';
import {ToggleCard} from '../components/ui/cards/ToggleCard';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function ToggleNodeComponent({nodeKey, content, contentPlaceholder, header, headerPlaceholder}) {
    const [editor] = useLexicalComposerContext();
    const cardContext = React.useContext(CardContext);

    const [isContentVisible, setContentVisible] = useState(false);
    const [isContentFocused, setFocusOnContent] = useState(false);
    const [isHeaderFocused, setFocusOnHeader] = useState(true);

    const toggleRef = useRef(null);

    useEffect(() => {
        if (toggleRef && toggleRef.current) {
            toggleRef.current.click();
        }
    }, []);

    const toggleContent = () => {
        setContentVisible(!isContentVisible);
    };

    const focusOnContent = (e) => {
        if (e.key === 'Enter') {
            setFocusOnHeader(false);
            setFocusOnContent(true);

            if (!isContentVisible && toggleRef && toggleRef.current) {
                toggleRef.current.click();
            }
        }
    };

    const focusOnHeader = (e) => {
        setFocusOnContent(false);
        setFocusOnHeader(true);

        console.log('isContentVisible', isContentVisible);
        console.log('isContentFocused', isContentFocused);
        console.log('isHeaderFocused', isHeaderFocused);
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
            contentPlaceholder={'Collapsible content'}
            focusOnContent={focusOnContent}
            focusOnHeader={focusOnHeader}
            header={header}
            headerPlaceholder={'Toggle header'}
            isContentFocused={isContentFocused}
            isContentVisible={isContentVisible}
            isEditing={cardContext.isEditing}
            isHeaderFocused={isHeaderFocused}
            isSelected={cardContext.isSelected}
            setContent={setContent}
            setHeader={setHeader}
            toggleContent={toggleContent}
            toggleRef={toggleRef}
        />
    );
}
