import KoenigProductEditor from '../../KoenigProductEditor';
import PropTypes from 'prop-types';
import React from 'react';
import {Button} from '../Button';
import {ButtonGroupSetting, DropdownSetting, InputSetting, SettingsDivider, SettingsPanel, ToggleSetting} from '../SettingsPanel';
import {ReactComponent as CenterAlignIcon} from '../../../assets/icons/kg-align-center.svg';
import {ReactComponent as LeftAlignIcon} from '../../../assets/icons/kg-align-left.svg';

export function EmailCtaCard({
    alignment,
    buttonText,
    buttonUrl,
    handleSegmentChange,
    htmlEditor,
    htmlEditorInitialState,
    isEditing,
    segment,
    showDividers,
    showButton,
    toggleDividers,
    updateAlignment
}) {
    const alignmentOpts = [
        {
            label: 'Left',
            name: 'left',
            Icon: LeftAlignIcon
        },
        {
            label: 'Center',
            name: 'center',
            Icon: CenterAlignIcon
        }
    ];

    const dropdownOptions = [{
        label: 'Free members',
        name: 'status:free'
    }, {
        label: 'Paid members',
        name: 'status:-free'
    }];

    const segmentName = dropdownOptions.find(option => option.name === segment)?.label ?? '';

    return (
        <>
            <div className="w-full pb-6">
                {/* Segment */}
                <div className="pt-1 pb-7 font-sans text-xs font-semibold uppercase leading-8 tracking-tight text-grey dark:text-grey-800">
                    {segmentName}
                </div>

                {/* Top divider */}
                {showDividers && <hr className="-mt-4 mb-12 block border-t-grey-300 dark:border-t-grey-900" />}

                {/* HTML content */}
                <KoenigProductEditor
                    autoFocus={true}
                    initialEditor={htmlEditor}
                    initialEditorState={htmlEditorInitialState}
                    nodes='basic'
                    placeholderClassName={`w-full bg-transparent font-serif text-xl text-grey-500 dark:text-grey-800 ${alignment === 'left' ? 'text-left' : 'text-center'} ` }
                    placeholderText="Email only text... (optional)"
                    textClassName={`w-full bg-transparent font-serif text-xl text-grey-900 dark:text-grey-200 ${alignment === 'left' ? 'text-left' : 'text-center'} ` }
                />

                {/* Button */}
                { (showButton && (isEditing || (buttonText && buttonUrl))) &&
                    <div className={`mt-6 ${alignment === 'left' ? 'text-left' : 'text-center'} ` }>
                        <Button placeholder="Add button text" value={buttonText} />
                    </div>
                }

                {/* Bottom divider */}
                {showDividers && <hr className="mt-12 mb-0 block border-t-grey-300 dark:border-t-grey-900" />}

                {/* Read-only overlay */}
                {!isEditing && <div className="absolute top-0 z-10 m-0 h-full w-full cursor-default p-0"></div>}
            </div>

            {isEditing && (
                <SettingsPanel>
                    {/* Segment settings */}
                    <DropdownSetting
                        description='Visible for this audience when delivered by email. This card is not published on your site.'
                        label='Visibility'
                        menu={dropdownOptions}
                        value={segment}
                        onChange={handleSegmentChange}
                    />
                    <SettingsDivider />

                    {/* Alignment settings */}
                    <ButtonGroupSetting
                        buttons={alignmentOpts}
                        label='Content alignment'
                        selectedName={alignment}
                        onClick={updateAlignment}
                    />

                    {/* Dividers settings */}
                    <ToggleSetting
                        isChecked={showDividers}
                        label='Separators'
                        onChange={toggleDividers}
                    />
                    <SettingsDivider />

                    {/* Button settings */}
                    <ToggleSetting
                        isChecked={showButton}
                        label='Button'
                        onChange={() => {}}
                    />
                    {showButton && (
                        <>
                            <InputSetting
                                label='Button text'
                                placeholder='Add button text'
                                value={buttonText}
                                onChange={() => {}}
                            />
                            <InputSetting
                                label='Button URL'
                                placeholder='https://yoursite.com/#/portal/signup/'
                                value={buttonUrl}
                                onChange={() => {}}
                            />
                        </>
                    )}
                </SettingsPanel>
            )}
        </>
    );
}

EmailCtaCard.propTypes = {
    alignment: PropTypes.oneOf(['left', 'center']),
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
    htmlEditor: PropTypes.object,
    isEditing: PropTypes.bool,
    segment: PropTypes.oneOf(['status:free', 'status:-free']),
    showButton: PropTypes.bool,
    showDividers: PropTypes.bool,
    updateAlignment: PropTypes.func
};

EmailCtaCard.defaultProps = {
    alignment: 'left',
    buttonText: '',
    buttonUrl: '',
    isEditing: false,
    segment: 'status:free',
    showButton: true,
    showDividers: true
};
