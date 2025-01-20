import KoenigNestedEditor from '../../KoenigNestedEditor';
import PropTypes from 'prop-types';
import React from 'react';
import ReplacementStringsPlugin from '../../../plugins/ReplacementStringsPlugin';
import {Button} from '../Button';
import {ReadOnlyOverlay} from '../ReadOnlyOverlay';

export function CtaCard({
    buttonText,
    buttonUrl,
    htmlEditor,
    htmlEditorInitialState,
    isEditing,
    showButton
}) {
    return (
        <>
            <div className="w-full">
                {/* Sponsor label */}
                <div className="not-kg-prose border-b border-grey-300 py-3 dark:border-grey-900">
                    <p className="font-sans text-2xs font-semibold uppercase leading-8 tracking-normal text-grey dark:text-grey-800">Sponsored</p>
                </div>

                <div className="flex flex-col gap-5 border-b border-grey-300 py-5 dark:border-grey-900">
                    {/* HTML content */}
                    <KoenigNestedEditor
                        autoFocus={true}
                        hasSettingsPanel={true}
                        initialEditor={htmlEditor}
                        initialEditorState={htmlEditorInitialState}
                        nodes='basic'
                        placeholderClassName={`bg-transparent whitespace-normal font-serif text-xl !text-grey-500 !dark:text-grey-800 ` }
                        placeholderText="Write something worth clicking..."
                        textClassName="w-full bg-transparent whitespace-normal font-serif text-xl text-grey-900 dark:text-grey-200"
                    >
                        <ReplacementStringsPlugin />
                    </KoenigNestedEditor>

                    {/* Button */}
                    { (showButton && (isEditing || (buttonText && buttonUrl))) &&
                        <div>
                            <Button color={'accent'} dataTestId="cta-button" placeholder="Add button text" value={buttonText}/>
                        </div>
                    }
                </div>

                {/* Read-only overlay */}
                {!isEditing && <ReadOnlyOverlay />}
            </div>
        </>
    );
}

CtaCard.propTypes = {
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
    isEditing: PropTypes.bool,
    showButton: PropTypes.bool,
    htmlEditor: PropTypes.object,
    htmlEditorInitialState: PropTypes.object
};

CtaCard.defaultProps = {
    buttonText: '',
    buttonUrl: '',
    isEditing: false
};
