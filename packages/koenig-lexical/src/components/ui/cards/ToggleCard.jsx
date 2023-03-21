import KoenigToggleEditor from '../../KoenigToggleEditor';
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
    isSelected,
    isContentVisible,
    toggleContent
}) {
    return (
        <div className="border-grey/40 dark:border-grey/30 rounded border py-4 px-6">
            <div className="flex items-start justify-between" onClick={toggleContent}>
                <KoenigToggleEditor
                    placeholderClassName={'kg-toggle-header-placeholder'}
                    placeholderText={headerPlaceholder}
                    readOnly={!isEditing}
                    setText={setHeader}
                    text={header}
                    textClassName={'kg-toggle-header-text'}
                />
                <div className="ml-auto mt-[-1px] flex h-8 w-8 shrink-0 items-center justify-center">
                    <ArrowDownIcon className={`text-grey-400 dark:text-grey/30 h-4 w-4 stroke-2 ${isContentVisible ? 'rotate-180' : 'rotate-0'}`} />
                </div>
            </div>
            <div className={`mt-2 w-full ${isContentVisible ? 'visible' : 'hidden'}`}>
                <KoenigToggleEditor
                    placeholderClassName={'kg-toggle-content-placeholder'}
                    placeholderText={contentPlaceholder}
                    readOnly={!isEditing}
                    setText={setContent}
                    text={content}
                    textClassName={'kg-toggle-content-text'}
                />
            </div>
        </div>
    );
}

ToggleCard.propTypes = {
    content: PropTypes.string,
    contentPlaceholder: PropTypes.string,
    header: PropTypes.string,
    headerPlaceholder: PropTypes.string,
    isEditing: PropTypes.bool,
    isSelected: PropTypes.bool,
    isContentVisible: PropTypes.bool,
    setContent: PropTypes.func,
    setHeader: PropTypes.func,
    toggleContent: PropTypes.func
};

ToggleCard.defaultProps = {
    content: '',
    contentPlaceholder: 'Collapsible content',
    header: '',
    headerPlaceholder: 'Toggle header',
    isEditing: false,
    isSelected: false,
    isContentVisible: false
};