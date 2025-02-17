import PropTypes from 'prop-types';
import React from 'react';

import {Tooltip} from './Tooltip';
import {usePreviousFocus} from '../../hooks/usePreviousFocus';

export function ButtonGroup({buttons = [], selectedName, onClick}) {
    return (
        <div className="flex">
            <ul className="flex items-center justify-evenly rounded-lg bg-grey-100 font-sans text-md font-normal text-white">
                {buttons.map(({label, name, Icon, dataTestId}) => (
                    <IconButton
                        key={`${name}-${label}`}
                        dataTestId={dataTestId}
                        Icon={Icon}
                        label={label}
                        name={name}
                        selectedName={selectedName}
                        onClick={onClick}
                    />
                ))}
            </ul>
        </div>
    );
}

export function IconButton({dataTestId, onClick, label, name, selectedName, Icon}) {
    const isActive = name === selectedName;

    const {handleMousedown, handleClick} = usePreviousFocus(onClick, name);

    return (
        <li className="mb-0">
            <button
                aria-label={label}
                className={`group relative flex h-7 w-8 cursor-pointer items-center justify-center rounded-lg text-black dark:text-white dark:hover:bg-grey-900 ${isActive ? 'border border-grey-300 bg-white shadow-xs dark:bg-grey-900' : '' } ${Icon ? '' : 'text-[1.3rem] font-bold'}`}
                data-testid={dataTestId}
                type="button"
                onClick={handleClick}
                onMouseDown={handleMousedown}
            >
                {Icon ? <Icon className="size-4 stroke-2" /> : label}
                {(Icon && label) && <Tooltip label={label} />}
            </button>
        </li>
    );
}

ButtonGroup.propTypes = {
    selectedName: PropTypes.oneOf(['regular', 'wide', 'full', 'split', 'center', 'left', 'small', 'medium', 'large', 'grid', 'list'])
};
