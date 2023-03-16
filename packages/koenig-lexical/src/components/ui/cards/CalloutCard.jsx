import KoenigCalloutEditor from '../../KoenigCalloutEditor';
import PropTypes from 'prop-types';
import React from 'react';
import {ColorPickerSetting, SettingsPanel, ToggleSetting} from '../SettingsPanel';
import {createPopup} from '@picmo/popup-picker';

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
    text,
    isEditing, 
    updateText, 
    toggleEmoji, 
    handleColorChange, 
    changeEmoji,
    emojiValue
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
            colorClass: 'bg-pink'
        }
    ];

    const cardRef = React.useRef(null);
    const emojiButtonRef = React.useRef(null);

    const memoizedChangeEmoji = React.useCallback(changeEmoji, []); //eslint-disable-line react-hooks/exhaustive-deps

    const handleEmojiClick = React.useCallback(() => {
        const picker = createPopup(
            {},
            {
                triggerElement: emojiButtonRef.current,
                referenceElement: emojiButtonRef.current,
                position: 'left-end'
            }
        );
    
        const handleEmojiSelect = (event) => {
            memoizedChangeEmoji(event.emoji);
        };
    
        picker.addEventListener('emoji:select', handleEmojiSelect);
    
        picker.toggle();
    
        return () => {
            picker.removeEventListener('emoji:select', handleEmojiSelect);
        };
    }, [memoizedChangeEmoji]);

    React.useEffect(() => {
        const triggerButton = emojiButtonRef.current;
        triggerButton.addEventListener('click', handleEmojiClick);
    
        return () => {
            triggerButton.removeEventListener('click', handleEmojiClick);
        };
    }, [handleEmojiClick]);

    return (
        <>
            <div ref={cardRef} className={`flex items-center rounded border py-5 px-7 ${CALLOUT_COLORS[color]} `}>
                {emoji && <button ref={emojiButtonRef} className={`mr-2 h-8 rounded px-2 text-xl ${isEditing ? 'hover:bg-grey-500/20' : ''} ` } type="button">{emojiValue}</button>}
                <KoenigCalloutEditor
                    className="w-full bg-transparent font-serif text-xl font-normal text-black"
                    html={text}
                    placeholderText={'Callout text...'}
                    readOnly={!isEditing}
                    setHtml={updateText}
                />
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
    color: PropTypes.oneOf(['grey', 'white', 'blue', 'green', 'yellow', 'red', 'pink', 'purple']),
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
