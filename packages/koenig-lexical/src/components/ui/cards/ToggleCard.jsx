import PropTypes from 'prop-types';
import React from 'react';
import {ReactComponent as ArrowDownIcon} from '../../../assets/icons/kg-toggle-arrow.svg';

export function ToggleCard({
    content,
    contentPlaceholder,
    header,
    headerPlaceholder,
    setContent,
    setHeader,
    isEditing,
    isSelected
}) {
    return (
        <div className="border-grey/40 rounded border py-4 px-6">
            <div className="w-100 flex justify-between">
                <div className={`font-sans text-xl font-bold leading-relaxed text-black ${header ? 'opacity-100' : 'opacity-40'}`}>
                    <span onChange={setHeader}>{header || headerPlaceholder}</span>
                </div>
                <div className="my-2 ml-auto">
                    <ArrowDownIcon className="text-grey-400 h-4 w-4 stroke-2" />
                </div>
            </div>
            { (isEditing || content) &&
            <div className={`text-grey-900 mt-2 w-full font-serif text-xl font-normal leading-relaxed ${content ? 'opacity-100' : 'opacity-40'} `}>
                {content || contentPlaceholder}
            </div>
            }
        </div>
    );
}

ToggleCard.propTypes = {
    content: PropTypes.string,
    contentPlaceholder: PropTypes.string,
    header: PropTypes.string,
    headerPlaceholder: PropTypes.string,
    setContent: PropTypes.func,
    setHeader: PropTypes.func,
    isEditing: PropTypes.bool,
    isSelected: PropTypes.bool
};

ToggleCard.defaultProps = {
    content: '',
    contentPlaceholder: 'Collapsible content',
    header: '',
    headerPlaceholder: 'Toggle header'
};