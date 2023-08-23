import PropTypes from 'prop-types';
import React from 'react';
import {ColorOptionSetting, SettingsPanel, SliderSetting} from '../SettingsPanel';

export const HORIZONTAL_RULE_COLORS = {
    grey: 'bg-grey/10',
    white: 'bg-white/10',
    blue: 'bg-blue/10',
    green: 'bg-green/10',
    yellow: 'bg-yellow/10',
    red: 'bg-red/10',
    pink: 'bg-pink/10',
    purple: 'bg-purple/10',
    accent: 'bg-accent'
};

export const horizontalRuleColorPicker = [
    {
        label: 'Grey',
        name: 'grey',
        color: 'bg-grey/10'
    },
    {
        label: 'White',
        name: 'white',
        color: 'bg-white/10'
    },
    {
        label: 'Blue',
        name: 'blue',
        color: 'bg-blue/10'
    },
    {
        label: 'Green',
        name: 'green',
        color: 'bg-green/10'
    },
    {
        label: 'Yellow',
        name: 'yellow',
        color: 'bg-yellow/10'
    },
    {
        label: 'Red',
        name: 'red',
        color: 'bg-red/10'
    },
    {
        label: 'Pink',
        name: 'pink',
        color: 'bg-pink/10'
    },
    {
        label: 'Purple',
        name: 'purple',
        color: 'bg-purple/10'
    },
    {
        label: 'Accent',
        name: 'accent',
        color: 'bg-accent'
    }
];

export function HorizontalRuleCard({
    color,
    size,
    handleSizeChange,
    handleColorChange,
    isEditing
}) {
    // border-grey-300 was the default color for hr
    return (
        <>
            <hr className={`m-0 block h-[${size}px] border-0 border-t ${HORIZONTAL_RULE_COLORS[color]}`} />
            {isEditing && (
                <SettingsPanel>
                    <ColorOptionSetting
                        buttons={horizontalRuleColorPicker}
                        dataTestId='horizontalrule-color-picker'
                        label='Color'
                        layout='stacked'
                        selectedName={color}
                        onClick={handleColorChange}
                    />
                    <SliderSetting
                        defaultValue={1}
                        label="Size"
                        max={100}
                        min={1}
                        value={size}
                        onChange={handleSizeChange}
                    />
                </SettingsPanel>
            )}
        </>
    );
}

HorizontalRuleCard.propTypes = {
    color: PropTypes.oneOf(['grey', 'white', 'blue', 'green', 'yellow', 'red', 'pink', 'purple', 'accent']),
    size: PropTypes.number,
    handleSizeChange: PropTypes.func,
    handleColorChange: PropTypes.func,
    isEditing: PropTypes.bool,
};

HorizontalRuleCard.defaultProps = {
    color: 'grey',
    size: 1
};