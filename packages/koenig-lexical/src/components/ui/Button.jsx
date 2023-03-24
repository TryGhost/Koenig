import PropTypes from 'prop-types';
import React from 'react';

export function Button({color, dataTestId, href, size, width, value, placeholder, type = 'button'}) {
    return (
        // eslint-disable-next-line react/button-has-type
        <button className={`not-kg-prose inline-block rounded font-sans font-medium ${(width === 'regular') || 'w-full' } ${value ? 'opacity-100' : 'opacity-50' } ${(color === 'light') ? 'bg-white text-black' : 'bg-green text-white'} `} data-testid={`${dataTestId}`} placeholder={placeholder} type={type} value={value}>
            {href ? (
                <span className={`block px-5 ${(size === 'small' ? 'h-10 text-md leading-[4rem]' : (size === 'medium' ? 'h-11 text-[1.6rem] leading-[4.4rem]' : 'h-12 text-lg leading-[4.8rem]'))}`} data-testid={`${dataTestId}-span`}>
                    <a data-testid={`${dataTestId}-link`} href={href}>{value || placeholder}</a>
                </span>
            ) : (
                <span className={`block px-5 ${(size === 'small' ? 'h-10 text-md leading-[4rem]' : (size === 'medium' ? 'h-11 text-[1.6rem] leading-[4.4rem]' : 'h-12 text-lg leading-[4.8rem]'))}`} data-testid={`${dataTestId}-span`}>
                    {value || placeholder}
                </span>
            )}
        </button>
    );
}

Button.propTypes = {
    color: PropTypes.oneOf(['light', 'accent']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    width: PropTypes.oneOf(['regular', 'full']),
    value: PropTypes.string,
    placeholder: PropTypes.string
};

Button.defaultProps = {
    color: 'accent',
    size: 'small',
    width: 'regular',
    value: '',
    placeholder: 'Add button text'
};
