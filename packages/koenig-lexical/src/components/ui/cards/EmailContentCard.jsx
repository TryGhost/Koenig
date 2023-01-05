import React from 'react';
import PropTypes from 'prop-types';
import {ReactComponent as HelpIcon} from '../../../assets/icons/help.svg';

export function EmailContentCard({value, placeholder, isSelected}) {
    return (
        <>
            <input className="w-full p-3 font-serif text-xl text-grey-900" value={value} placeholder={placeholder} />
            {isSelected && 
                <div className="flex w-full items-center justify-center bg-grey-100 p-2 font-sans text-sm font-normal leading-8 text-grey-600">
                    Only visible when delivered by email, this card will not be published on your site.
                    <a href="https://ghost.org/help/email-newsletters/#email-cards" target="_blank" rel="noopener noreferrer">
                        <HelpIcon className="ml-1 mt-[1px] stroke-[1.2px]" />
                    </a>
                </div>
            }
        </>
    );
}

EmailContentCard.propTypes = {
    isSelected: PropTypes.bool,
    value: PropTypes.string,
    placeholder: PropTypes.string
};