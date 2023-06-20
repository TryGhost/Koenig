import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';

export function Button({color, dataTestId, href, size, width, rounded, value, placeholder, type = 'button', disabled = false, target, ...other}) {
    const Tag = href ? 'a' : 'button';
    const props = {
        type: href ? null : type,
        href: href || null,
        rel: target === '_blank' ? 'noopener noreferrer' : null,
        target: target || null,
        ...other
    };

    return (
        <Tag
            className={clsx(
                'not-kg-prose cursor-pointe inline-block shrink-0 text-center font-sans font-medium',
                width === 'regular' || 'w-full',
                rounded && 'rounded',
                value ? 'opacity-100' : 'opacity-50',
                color === 'white' && 'bg-white text-black',
                color === 'grey' && 'bg-grey-200 text-black',
                color === 'black' && 'bg-black text-white',
                color === 'accent' && 'bg-accent text-white',
                !['white', 'grey', 'black', 'accent'].includes(color) && 'bg-green text-white')}
            data-testid={`${dataTestId}`}
            disabled={disabled}
            {...props}
        >
            <span
                className={clsx(
                    'block',
                    size === 'small' && 'h-10 px-5 text-md leading-[4rem] md:h-10',
                    size === 'medium' && 'h-11 px-5 text-[1.6rem] leading-[4.4rem]',
                    size === 'large' && 'h-12 px-6 text-lg leading-[4.8rem]'
                )}
                data-testid={`${dataTestId}-span`}
            >
                {value || placeholder}
            </span>
        </Tag>
    );
}

Button.propTypes = {
    color: PropTypes.oneOf(['white', 'grey', 'black', 'accent']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    width: PropTypes.oneOf(['regular', 'full']),
    rounded: PropTypes.bool,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    href: PropTypes.string,
    target: PropTypes.string,
    disabled: PropTypes.bool
};

Button.defaultProps = {
    color: 'accent',
    size: 'small',
    width: 'regular',
    rounded: true,
    value: '',
    placeholder: 'Add button text',
    disabled: false
};
