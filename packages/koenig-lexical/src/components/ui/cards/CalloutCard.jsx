import KoenigMiniEditor from '../../KoenigMiniEditor';
import PropTypes from 'prop-types';
import React from 'react';
import {ColorPickerSetting, SettingsPanel, ToggleSetting} from '../SettingsPanel';

export const CALLOUT_COLORS = {
    grey: 'bg-grey/10 border-transparent',
    white: 'bg-white border-grey/30',
    blue: 'bg-blue/10 border-transparent',
    green: 'bg-green/10 border-transparent',
    yellow: 'bg-yellow/10 border-transparent',
    red: 'bg-red/10 border-transparent',
    pink: 'bg-pink/10 border-transparent',
    purple: 'bg-purple/10 border-transparent'
};

export function CalloutCard({color, emoji, text, placeholder, isEditing, updateText}) {
    const calloutColorPicker = [
        {
            label: 'Grey',
            name: 'grey',
            color: 'grey-100'
        },
        {
            label: 'White',
            name: 'white',
            color: 'white'
        },
        {
            label: 'Blue',
            name: 'blue',
            color: 'blue-100'
        },
        {
            label: 'Green',
            name: 'green',
            color: 'green-100'
        },
        {
            label: 'Yellow',
            name: 'yellow',
            color: 'yellow-100'
        },
        {
            label: 'Red',
            name: 'red',
            color: 'red-100'
        },
        {
            label: 'Pink',
            name: 'pink',
            color: 'pink-100'
        },
        {
            label: 'Purple',
            name: 'purple',
            color: 'purple-100'
        },
        {
            label: 'Accent',
            name: 'accent',
            color: 'pink'
        }
    ];

    return (
        <>
            <div className={`flex items-center rounded border py-5 px-7 ${CALLOUT_COLORS[color]} `}>
                {emoji && <button className={`mr-2 h-8 rounded px-2 text-xl ${isEditing ? 'hover:bg-grey-500/20' : ''} ` } type="button">&#128161;</button>}
                <KoenigMiniEditor
                    className="w-full bg-transparent font-serif text-xl font-normal text-black"
                    html={text}
                    placeholderText={'Add a callout...'}
                    readOnly={!isEditing}
                    setHtml={updateText}
                />
                <SettingsPanel>
                    <ColorPickerSetting
                        buttons={calloutColorPicker}
                        label='Background color'
                        layout='stacked'
                        selectedName={color}
                    />
                    <ToggleSetting
                        isChecked={emoji}
                        label='Emoji'
                    />
                </SettingsPanel>
            </div>
        </>
    );
}

CalloutCard.propTypes = {
    color: PropTypes.oneOf(['grey', 'white', 'blue', 'green', 'yellow', 'red', 'pink', 'purple']),
    text: PropTypes.string,
    placeholder: PropTypes.string,
    isEditing: PropTypes.bool,
    updateText: PropTypes.func,
    emoji: PropTypes.bool
};

CalloutCard.defaultProps = {
    color: 'green'
};
