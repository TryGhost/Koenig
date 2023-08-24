import PropTypes from 'prop-types';
import React from 'react';
import {ColorOptionSetting, DropdownSetting, SettingsPanel, SliderSetting} from '../SettingsPanel';

export const HORIZONTAL_RULE_COLORS = {
    grey: 'border-grey-300',
    white: 'border-white',
    blue: 'border-blue',
    green: 'border-green',
    yellow: 'border-yellow',
    red: 'border-red',
    pink: 'border-pink',
    purple: 'border-purple',
    accent: 'border-accent'
};

export const buttonColors = [
    {
        label: 'Grey',
        name: 'grey',
        color: 'bg-grey/30'
    },
    {
        label: 'White',
        name: 'white',
        color: 'bg-white'
    },
    {
        label: 'Blue',
        name: 'blue',
        color: 'bg-blue'
    },
    {
        label: 'Green',
        name: 'green',
        color: 'bg-green'
    },
    {
        label: 'Yellow',
        name: 'yellow',
        color: 'bg-yellow'
    },
    {
        label: 'Red',
        name: 'red',
        color: 'bg-red'
    },
    {
        label: 'Pink',
        name: 'pink',
        color: 'bg-pink'
    },
    {
        label: 'Purple',
        name: 'purple',
        color: 'bg-purple'
    },
    {
        label: 'Accent',
        name: 'accent',
        color: 'bg-accent'
    }
];

const dropdownHeightOptions = [
    {
        label: '1px',
        name: '1'
    }, 
    {
        label: '2px',
        name: '2'
    }, 
    {
        label: '4px',
        name: '4'
    }
];

const dropdownWidthOptions = [
    {
        label: '2%',
        name: '2'
    }, 
    {
        label: '3%',
        name: '3'
    }, 
    {
        label: '4%',
        name: '4'
    },
    {
        label: '5%',
        name: '5'
    }, 
    {
        label: '6%',
        name: '6'
    }, 
    {
        label: '7%',
        name: '7'
    }, 
    {
        label: '8%',
        name: '8'
    }, 
    {
        label: '9%',
        name: '9'
    }, 
    {
        label: '10%',
        name: '10'
    }, 
    {
        label: '12%',
        name: '12'
    }, 
    {
        label: '14%',
        name: '14'
    }, 
    {
        label: '16%',
        name: '16'
    }, 
    {
        label: '20%',
        name: '20'
    }, 
    {
        label: '32%',
        name: '32'
    }, 
    {
        label: '100%',
        name: '100'
    }, 
];

const dropdownStyleOptions = [
    {
        label: 'dashed',
        name: 'border-dashed'
    },
    {
        label: 'dotted',
        name: 'border-dotted'
    },
    {
        label: 'double',
        name: 'border-double'
    },
    {
        label: 'solid',
        name: 'border-solid'
    },
];

export function HorizontalRuleCard({
    color,
    handleColorChange,
    height,
    handleHeightChange,
    width,
    handleWidthChange,
    style,
    handleStyleChange,
    isEditing
}) {
    return (
        <>
            <hr className={`m-0 justify-center block w-${width} h-[1px] ${style} border-${height} border-t ${HORIZONTAL_RULE_COLORS[color]}`} />
            {isEditing && (
                <SettingsPanel>
                    <ColorOptionSetting
                        buttons={buttonColors}
                        dataTestId='horizontalrule-color-picker'
                        label='Color'
                        layout='stacked'
                        selectedName={color}
                        onClick={handleColorChange}
                    />
                    <DropdownSetting
                        defaultValue={'1'}
                        dataTestId='horizontalrule-height-dropdown'
                        label='Height'
                        menu={dropdownHeightOptions}
                        value={height}
                        onChange={handleHeightChange}
                    />
                    <DropdownSetting
                        defaultValue={'100'}
                        dataTestId='horizontalrule-width-dropdown'
                        label='Width'
                        menu={dropdownWidthOptions}
                        value={width}
                        onChange={handleWidthChange}
                    />
                    <DropdownSetting
                        defaultValue={'border-solid'}
                        dataTestId='horizontalrule-style-dropdown'
                        label='Style'
                        menu={dropdownStyleOptions}
                        value={style}
                        onChange={handleStyleChange}
                    />
                </SettingsPanel>
            )}
        </>
    );
}

HorizontalRuleCard.propTypes = {
    color: PropTypes.oneOf(['grey', 'white', 'blue', 'green', 'yellow', 'red', 'pink', 'purple', 'accent']),
    handleColorChange: PropTypes.func,
    height: PropTypes.string,
    handleHeightChange: PropTypes.func,
    width: PropTypes.string,
    handleWidthChange: PropTypes.func,
    style: PropTypes.string,
    handleStyleChange: PropTypes.func,
    isEditing: PropTypes.bool,
};

HorizontalRuleCard.defaultProps = {
    color: 'grey',
    height: '1',
    width: '100',
    style: 'border-solid'
};