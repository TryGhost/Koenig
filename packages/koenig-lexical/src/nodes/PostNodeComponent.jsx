import CardContext from '../context/CardContext';
import React from 'react';
import {PostCard} from '../components/ui/cards/PostCard';

export function PostNodeComponent({nodeKey, contentEditor, contentEditorInitialState}) {
    const cardContext = React.useContext(CardContext);
    const {isEditing} = cardContext;

    React.useEffect(() => {
        contentEditor.setEditable(isEditing);
    }, [isEditing, contentEditor]);

    return (
        <>
            <PostCard
                contentEditor={contentEditor}
                contentEditorInitialState={contentEditorInitialState}
                isEditing={isEditing}
            />
        </>
    );
}
