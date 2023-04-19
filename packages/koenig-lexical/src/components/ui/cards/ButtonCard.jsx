import PropTypes from 'prop-types';
import React from 'react';
import {Button} from '../Button';
import {ButtonGroupSetting, InputSetting, InputUrlSetting, SettingsPanel} from '../SettingsPanel';
import {ReactComponent as CenterAlignIcon} from '../../../assets/icons/kg-align-center.svg';
import {ReactComponent as LeftAlignIcon} from '../../../assets/icons/kg-align-left.svg';

export function ButtonCard({
    alignment,
    buttonText,
    buttonPlaceholder,
    buttonUrl,
    handleAlignmentChange,
    handleButtonTextChange,
    handleButtonUrlChange,
    isEditing
}) {
    const buttonGroupChildren = [
        {
            label: 'Left',
            name: 'left',
            Icon: LeftAlignIcon,
            dataTestId: 'button-align-left'
        },
        {
            label: 'Center',
            name: 'center',
            Icon: CenterAlignIcon,
            dataTestId: 'button-align-center'
        }
    ];

    return (
        <>
            <div className="inline-block w-full">
                <div className={`my-3 flex h-10 items-center ${isEditing || buttonUrl ? 'opacity-100' : 'opacity-50'} ${alignment === 'left' ? 'justify-start' : 'justify-center'} `} data-testid="button-card">
                    <Button dataTestId="button-card-btn" href={buttonUrl} placeholder={buttonPlaceholder} value={buttonText} />
                </div>
            </div>
            {isEditing && (
                <SettingsPanel>
                    <ButtonGroupSetting
                        buttons={buttonGroupChildren}
                        label="Content alignment"
                        selectedName={alignment}
                        onClick={handleAlignmentChange}
                    />
                    <InputSetting
                        dataTestId="button-input-text"
                        label='Button text'
                        placeholder='Add button text'
                        value={buttonText}
                        onChange={handleButtonTextChange}
                    />
                    <InputUrlSetting
                        dataTestId="button-input-url"
                        label='Button URL'
                        value={buttonUrl}
                        onChange={handleButtonUrlChange}
                    />
                </SettingsPanel>
            )}
        </>
    );
}

ButtonCard.propTypes = {
    alignment: PropTypes.string,
    buttonText: PropTypes.string,
    buttonPlaceholder: PropTypes.string,
    buttonUrl: PropTypes.string,
    handleAlignmentChange: PropTypes.func,
    handleButtonTextChange: PropTypes.func,
    handleButtonUrlChange: PropTypes.func,
    handleButtonUrlFocus: PropTypes.func,
    handleOptionClick: PropTypes.func,
    isEditing: PropTypes.bool,
    suggestedUrls: PropTypes.array,
    suggestedUrlVisibility: PropTypes.bool
};
