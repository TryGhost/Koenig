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
            <div className="flex items-start justify-between">
                { (isEditing || header) &&
                    <div className={`mr-2 font-sans text-xl font-bold leading-snug text-black ${header ? 'opacity-100' : 'opacity-40'}`}>
                        {header || headerPlaceholder}
                    </div>
                }
                <div className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center">
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
    isSelected: PropTypes.bool,
    isCollapsed: PropTypes.bool
};