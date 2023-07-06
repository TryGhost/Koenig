import PropTypes from 'prop-types';
import React from 'react';

export function Slider({dataTestId, max, min, value, onChange}) {
    return (
        <input data-testid={dataTestId} max={max} min={min} type="range" value={value} onChange={onChange} />
    );
}

Slider.propTypes = {
    max: PropTypes.number,
    min: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func
};