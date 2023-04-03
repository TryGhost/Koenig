import KoenigHeaderEditor from '../../KoenigHeaderEditor';
import PropTypes from 'prop-types';
import React from 'react';
import {Button} from '../Button';
import {ButtonGroupSetting, ColorPickerSetting, InputSetting, SettingsDivider, SettingsPanel, ToggleSetting} from '../SettingsPanel';
import {sanitizeHtml} from '../../../utils/sanitize-html';
export const HEADER_COLORS = {
    dark: 'bg-black',
    light: 'bg-grey-100',
    accent: 'bg-pink'
};

export function HeaderCard({isEditing, 
    size, 
    backgroundColor, 
    heading, 
    headingPlaceholder, 
    subHeading, 
    subHeadingPlaceholder, 
    button, 
    buttonText, 
    buttonPlaceholder, 
    buttonUrl, 
    handleHeadingTextEdit, 
    handleSubheadingTextEdit, 
    nodeKey, 
    handleColorSelector,
    handleSizeSelector}) {
    const buttonGroupChildren = [
        {
            label: 'S',
            name: 'small'
        },
        {
            label: 'M',
            name: 'medium'
        },
        {
            label: 'L',
            name: 'large'
        }
    ];

    const colorPickerChildren = [
        {
            label: 'Dark',
            name: 'dark',
            color: 'black'
        },
        {
            label: 'Light',
            name: 'light',
            color: 'grey-50'
        },
        {
            label: 'Accent',
            name: 'accent',
            color: 'pink'
        }
    ];

    return (
        <>
            <div className={`not-kg-prose flex flex-col items-center justify-center text-center font-sans ${(size === 'small') ? 'min-h-[40vh] py-[14vmin]' : (size === 'medium') ? 'min-h-[60vh] py-[12vmin]' : 'min-h-[80vh] py-[18vmin]'} ${HEADER_COLORS[backgroundColor]} `}>
                
                {
                    isEditing ?
                        <KoenigHeaderEditor
                            className={`whitespace-normal font-extrabold leading-tight ${(size === 'small') ? 'text-6xl' : (size === 'medium') ? 'text-7xl' : 'text-8xl'} ${(backgroundColor === 'light') ? 'text-black' : 'text-white'}`}
                            headingPlaceholder={headingPlaceholder}
                            html={heading}
                            nodeKey={nodeKey}
                            readOnly={isEditing}
                            setHtml={handleHeadingTextEdit}
                            size={size}
                        />
                        :
                        <div dangerouslySetInnerHTML={{__html: heading !== '' ? sanitizeHtml(heading) : headingPlaceholder}} className={`whitespace-normal font-extrabold leading-tight ${(size === 'small') ? 'text-6xl' : (size === 'medium') ? 'text-7xl' : 'text-8xl'} ${(backgroundColor === 'light') ? 'text-black' : 'text-white'} {heading || ''}`}/>
                }

                {
                    isEditing ?
                        <KoenigHeaderEditor
                            className={`w-full whitespace-normal font-normal ${(size === 'small') ? 'mt-2 text-2xl' : (size === 'medium') ? 'mt-3 text-[2.7rem]' : 'mt-3 text-3xl'} ${(backgroundColor === 'light') ? 'text-black' : 'text-white'}`}
                            headingPlaceholder={subHeadingPlaceholder}
                            html={subHeading}
                            nodeKey={nodeKey}
                            readOnly={isEditing}
                            setHtml={handleSubheadingTextEdit}
                            size={size}
                        />
                        :
                        <div dangerouslySetInnerHTML={{__html: heading ? sanitizeHtml(subHeading) : subHeadingPlaceholder}} className={`w-full whitespace-normal font-normal ${(size === 'small') ? 'mt-2 text-2xl' : (size === 'medium') ? 'mt-3 text-[2.7rem]' : 'mt-3 text-3xl'} ${(backgroundColor === 'light') ? 'text-black' : 'text-white'}`}/>
                }

                { (button && (isEditing || (buttonText && buttonUrl))) && 
                <div className={`${(size === 'S') ? 'mt-6' : (size === 'M') ? 'mt-8' : 'mt-10'}`}>
                    {((button && (backgroundColor === 'light')) && <Button placeholder={buttonPlaceholder} size={size} value={buttonText} />) || (button && <Button color='light' placeholder={buttonPlaceholder} size={size} value={buttonText} />)}
                </div>
                }
            </div>

            {isEditing && (
                <SettingsPanel>
                    <ButtonGroupSetting
                        buttons={buttonGroupChildren}
                        label='Size'
                        selectedName={size}
                        onClick={handleSizeSelector}
                    />
                    <ColorPickerSetting
                        buttons={colorPickerChildren}
                        label='Style'
                        selectedName={backgroundColor}
                        onClick={handleColorSelector}
                    />
                    <SettingsDivider />
                    <ToggleSetting
                        isChecked={button}
                        label='Button'
                    />
                    {button && (
                        <>
                            <InputSetting
                                label='Button text'
                                placeholder='Add button text'
                                value={buttonText}
                            />
                            <InputSetting
                                label='Button URL'
                                placeholder='https://yoursite.com/#/portal/signup/'
                                value={buttonUrl}
                            />
                        </>
                    )}
                </SettingsPanel>    
            )}
        </>
    );
}

HeaderCard.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    backgroundColor: PropTypes.oneOf(['dark', 'light', 'accent']),
    heading: PropTypes.string,
    headingPlaceholder: PropTypes.string,
    subHeading: PropTypes.string,
    subHeadingPlaceholder: PropTypes.string,
    button: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonPlaceholder: PropTypes.string
};