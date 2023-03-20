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
                    placeholderClassName={'pointer-events-none absolute top-0 left-0 m-0 min-w-full cursor-text text-black text-xl font-sans font-bold leading-relaxed tracking-wide opacity-40'}
                    placeholderText={headerPlaceholder}
                    readOnly={!isEditing}
                    setText={setHeader}
                    text={header}
                    textClassName={'mt-2 mb-0 h-auto w-full pb-0 text-black text-xl font-sans font-bold leading-relaxed opacity-100'}
                />
                <div className="ml-auto mt-2 flex h-8 w-8 shrink-0 items-center justify-center">
                    <ArrowDownIcon className={`text-grey-400 dark:text-grey/30 h-4 w-4 stroke-2 ${isContentVisible ? 'rotate-180' : 'rotate-0'}`} />
                </div>
            </div>
            <div className={`mt-2 w-full ${isContentVisible ? 'visible' : 'hidden'}`}>
                <KoenigToggleEditor
                    placeholderClassName={'pointer-events-none absolute top-0 left-0 m-0 min-w-full cursor-textmt-2 w-full font-serif text-xl font-normal leading-normal text-grey-900 dark:text-grey-100 opacity-40'}
                    placeholderText={contentPlaceholder}
                    readOnly={!isEditing}
                    setText={setContent}
                    text={content}
                    textClassName={'mt-2 w-full font-serif text-xl font-normal leading-normal text-grey-900 dark:text-grey-100 opacity-100'}
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