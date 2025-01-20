import KoenigNestedEditor from '../../KoenigNestedEditor';
import PropTypes from 'prop-types';
import React from 'react';
import ReplacementStringsPlugin from '../../../plugins/ReplacementStringsPlugin';
import {Button} from '../Button';
import {InputSetting, InputUrlSetting, SettingsPanel, ToggleSetting} from '../SettingsPanel';
import {ReadOnlyOverlay} from '../ReadOnlyOverlay';

export function CtaCard({
    buttonText,
    buttonUrl,
    hasBackground,
    hasSponsorLabel,
    htmlEditor,
    htmlEditorInitialState,
    isEditing,
    showButton,
    updateButtonText,
    updateButtonUrl,
    updateShowButton,
    updateHasBackground,
    updateHasSponsorLabel
}) {
    return (
        <>
            <div className={`w-full ${hasBackground ? 'rounded-lg bg-grey-100 dark:bg-grey-900' : ''}`}>
                {/* Sponsor label */}
                {hasSponsorLabel && (
                    <div className={`not-kg-prose py-3 ${hasBackground ? 'mx-5' : ''}`}>
                        <p className="font-sans text-2xs font-semibold uppercase leading-8 tracking-normal text-grey dark:text-grey-800">Sponsored</p>
                    </div>
                )}

                <div className={`flex flex-col gap-5 py-5 ${hasSponsorLabel || !hasBackground ? 'border-t border-grey-300 dark:border-grey-800' : ''} ${hasBackground ? 'mx-5' : 'border-b border-grey-300 dark:border-grey-800'}`}>
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

            {isEditing && (
                <SettingsPanel>
                    {/* Sponsor label setting */}
                    <ToggleSetting
                        isChecked={hasSponsorLabel}
                        label='Sponsor label'
                        onChange={updateHasSponsorLabel}
                    />
                    {/* Background setting */}
                    <ToggleSetting
                        isChecked={hasBackground}
                        label='Background'
                        onChange={updateHasBackground}
                    />
                    {/* Button settings */}
                    <ToggleSetting
                        dataTestId="button-settings"
                        isChecked={showButton}
                        label='Button'
                        onChange={updateShowButton}
                    />
                    {showButton && (
                        <>
                            <InputSetting
                                dataTestId="button-text"
                                label='Button text'
                                placeholder='Add button text'
                                value={buttonText}
                                onChange={updateButtonText}
                            />
                            <InputUrlSetting
                                dataTestId="button-url"
                                label='Button URL'
                                value={buttonUrl}
                                onChange={updateButtonUrl}
                            />
                        </>
                    )}
                </SettingsPanel>
            )}
        </>
    );
}

CtaCard.propTypes = {
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
    hasBackground: PropTypes.bool,
    hasSponsorLabel: PropTypes.bool,
    isEditing: PropTypes.bool,
    showButton: PropTypes.bool,
    htmlEditor: PropTypes.object,
    htmlEditorInitialState: PropTypes.object,
    updateButtonText: PropTypes.func,
    updateButtonUrl: PropTypes.func,
    updateHasBackground: PropTypes.func,
    updateHasSponsorLabel: PropTypes.func,
    updateShowButton: PropTypes.func
};

CtaCard.defaultProps = {
    buttonText: '',
    buttonUrl: '',
    hasBackground: false,
    hasSponsorLabel: false,
    isEditing: false,
    showButton: false,
    updateHasBackground: () => {},
    updateHasSponsorLabel: () => {},
    updateShowButton: () => {}
};
