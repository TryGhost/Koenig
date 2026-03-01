import CenterAlignIcon from '../../../assets/icons/kg-align-center.svg?react';
import LeftAlignIcon from '../../../assets/icons/kg-align-left.svg?react';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Button} from '../Button';
import {ButtonGroupSetting, ColorPickerSetting, InputSetting, InputUrlSetting, SettingsPanel} from '../SettingsPanel';
import {ReadOnlyOverlay} from '../ReadOnlyOverlay';
import {getAccentColor} from '../../../utils/getAccentColor';
import {textColorForBackgroundColor} from '@tryghost/color-utils';

export function ButtonCard({
    alignment,
    buttonColor,
    buttonText,
    buttonTextColor,
    buttonPlaceholder,
    buttonUrl,
    handleAlignmentChange,
    handleButtonColorChange,
    handleButtonTextChange,
    handleButtonUrlChange,
    isEditing
}) {
    const [buttonColorPickerExpanded, setButtonColorPickerExpanded] = useState(false);
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

    const hexColorValue = (color) => {
        if (!color) {
            return '';
        }
        if (color === 'accent') {
            return getAccentColor().trim();
        }
        return color.trim();
    };

    const matchingTextColor = (color) => {
        return textColorForBackgroundColor(hexColorValue(color)).hex();
    };

    return (
        <>
            <div className="inline-block w-full">
                <div className={`my-3 flex items-center ${isEditing || buttonUrl ? 'opacity-100' : 'opacity-50'} ${alignment === 'left' ? 'justify-start' : 'justify-center'} `} data-testid="button-card">
                    <Button
                        dataTestId="button-card-btn"
                        href={buttonUrl}
                        placeholder={buttonPlaceholder}
                        shrink={true}
                        style={{
                            backgroundColor: hexColorValue(buttonColor),
                            color: hexColorValue(buttonTextColor)
                        }}
                        value={buttonText}
                    />
                </div>
            </div>
            <ReadOnlyOverlay />
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
                    <ColorPickerSetting
                        dataTestId='button-color'
                        eyedropper={true}
                        isExpanded={buttonColorPickerExpanded}
                        label='Button color'
                        swatches={[
                            {title: 'Black', hex: '#000000'},
                            {title: 'Grey', hex: '#F0F0F0'},
                            {title: 'Brand color', accent: true}
                        ]}
                        value={buttonColor}
                        onPickerChange={color => handleButtonColorChange(color, matchingTextColor(color))}
                        onSwatchChange={(color) => {
                            handleButtonColorChange(color, matchingTextColor(color));
                            setButtonColorPickerExpanded(false);
                        }}
                        onTogglePicker={setButtonColorPickerExpanded}
                    />
                </SettingsPanel>
            )}
        </>
    );
}

ButtonCard.propTypes = {
    alignment: PropTypes.string,
    buttonColor: PropTypes.string,
    buttonText: PropTypes.string,
    buttonTextColor: PropTypes.string,
    buttonPlaceholder: PropTypes.string,
    buttonUrl: PropTypes.string,
    handleAlignmentChange: PropTypes.func,
    handleButtonColorChange: PropTypes.func,
    handleButtonTextChange: PropTypes.func,
    handleButtonUrlChange: PropTypes.func,
    handleButtonUrlFocus: PropTypes.func,
    handleOptionClick: PropTypes.func,
    isEditing: PropTypes.bool,
    suggestedUrls: PropTypes.array,
    suggestedUrlVisibility: PropTypes.bool
};
