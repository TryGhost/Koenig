import EmojiPickerPortal from '../EmojiPickerPortal';
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

export function CalloutCard({
    color, 
    emoji, 
    isEditing,
    setEditing,
    toggleEmoji, 
    handleColorChange, 
    changeEmoji,
    emojiValue,
    children
}) {
    const calloutColorPicker = [
        {
            label: 'Grey',
            name: 'grey',
            colorClass: 'bg-grey-100'
        },
        {
            label: 'White',
            name: 'white',
            colorClass: 'bg-white'
        },
        {
            label: 'Blue',
            name: 'blue',
            colorClass: 'bg-blue-100'
        },
        {
            label: 'Green',
            name: 'green',
            colorClass: 'bg-green-100'
        },
        {
            label: 'Yellow',
            name: 'yellow',
            colorClass: 'bg-yellow-100'
        },
        {
            label: 'Red',
            name: 'red',
            colorClass: 'bg-red-100'
        },
        {
            label: 'Pink',
            name: 'pink',
            colorClass: 'bg-pink-100'
        },
        {
            label: 'Purple',
            name: 'purple',
            colorClass: 'bg-purple-100'
        },
        {
            label: 'Accent',
            name: 'accent',
            colorClass: 'bg-pink' //todo - this should be the theme colour
        }
    ];

    const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

    const toggleEmojiPicker = () => {
        if (!isEditing) {
            setEditing(true);
            return;
        }
        setShowEmojiPicker(!showEmojiPicker);
    };

    const emojiButtonRef = React.useRef(null);

    React.useEffect(() => {
        if (!isEditing) {
            setShowEmojiPicker(false);
        }
    }, [isEditing]);

    return (
        <>
            <div className={`flex items-center rounded border px-7 ${CALLOUT_COLORS[color]} `}>
                <div>
                    {emoji && 
                    <>
                        <button 
                            ref={emojiButtonRef}
                            className={`mr-2 h-8 cursor-pointer rounded px-2 text-xl ${isEditing ? 'hover:bg-grey-500/20' : ''} ` } type="button" onClick={toggleEmojiPicker} >{emojiValue}</button>
                        {
                            isEditing && showEmojiPicker && (
                                <EmojiPickerPortal
                                    buttonRef={emojiButtonRef}
                                    onEmojiClick={changeEmoji} />
                            )
                        }
                    </>
                    }
                </div>
                {children}
            </div>
            {
                isEditing && (
                    <SettingsPanel>
                        <ToggleSetting
                            dataTestID='emoji-toggle'
                            isChecked={emoji}
                            label='Emoji'
                            onChange={toggleEmoji}
                        />
                        <ColorPickerSetting
                            buttons={calloutColorPicker}
                            dataTestID='callout-color-picker'
                            label='Background color'
                            layout='stacked'
                            selectedName={color}
                            onClick={handleColorChange}
                        />
                    </SettingsPanel>
                )
            }
        </>
    );
}

CalloutCard.propTypes = {
    color: PropTypes.oneOf(['grey', 'white', 'blue', 'green', 'yellow', 'red', 'pink', 'purple', 'accent']),
    text: PropTypes.string,
    placeholder: PropTypes.string,
    isEditing: PropTypes.bool,
    updateText: PropTypes.func,
    emoji: PropTypes.bool,
    emojiValue: PropTypes.string
};

CalloutCard.defaultProps = {
    color: 'green',
    emojiValue: '💡'
};
