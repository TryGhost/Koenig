import PropTypes from 'prop-types';
import React from 'react';

export function Toggle({isChecked, onChange, dataTestId}) {
    return (
        <label className="relative inline-block h-5 w-[34px] outline-none" data-testid={dataTestId} id={dataTestId}>
            <input
                checked={isChecked}
                className="peer absolute hidden"
                type="checkbox"
                onChange={onChange}
            />
            <div className="absolute inset-0 cursor-pointer rounded-full bg-grey-300 transition-all before:absolute before:bottom-[2px] before:left-[2px] before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-200 peer-checked:bg-black peer-checked:before:translate-x-[14px] dark:bg-grey-900 dark:peer-checked:bg-green"></div>
        </label>
    );
}

Toggle.propTypes = {
    isChecked: PropTypes.bool,
    onChange: PropTypes.func
};
