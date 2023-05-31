import KoenigNestedEditor from '../../KoenigNestedEditor';
import PropTypes from 'prop-types';
import React from 'react';

export function PostCard({contentEditor, contentEditorInitialState, isEditing}) {
    return (
        <div className="w-full">
            {/* Nested text editor */}
            <KoenigNestedEditor
                autoFocus={true}
                initialEditor={contentEditor}
                initialEditorState={contentEditorInitialState}
                nodes='basic'
                textClassName='whitespace-normal pb-1'
            />

            {/* When the card is in edit mode, display a disclaimer for the publisher about the card */}
            {isEditing &&
                <div className="!-mx-3 !mt-3 flex items-center justify-center bg-grey-100 p-2 font-sans text-sm font-normal leading-none text-grey-600 dark:bg-grey-950 dark:text-grey-800">
                    Only visible in web posts, this card will not be sent by email.
                </div>
            }

            {/* When the card is in read mode, display an overlay on top of the card to prevent accidental edits */}
            {!isEditing && <div className="absolute top-0 z-10 !m-0 h-full w-full cursor-default p-0"></div>}
        </div>
    );
}

PostCard.propTypes = {
    contentEditor: PropTypes.object,
    isEditing: PropTypes.bool,
    contentEditorInitialState: PropTypes.string
};

PostCard.defaultProps = {
    isEditing: false
};
