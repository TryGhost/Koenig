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
    isSelected
}) {
    return (
        <div className="border-grey/40 rounded border py-4 px-6">
            <div className="w-100 flex justify-between">
                {/* <div className={`font-sans text-xl font-bold leading-relaxed text-black ${header ? 'opacity-100' : 'opacity-40'}`}> */}
                <KoenigToggleEditor
                    placeholderClassName={'pointer-events-none absolute top-0 left-0 m-0 min-w-full cursor-text text-black text-xl font-sans font-bold leading-relaxed tracking-wide opacity-40'}
                    placeholderText={headerPlaceholder}
                    readOnly={!isEditing}
                    setText={setHeader}
                    text={header}
                    textClassName={'mt-2 mb-0 h-auto w-full pb-0 text-black text-xl font-sans font-bold leading-relaxed opacity-100'}
                />
                {/* </div> */}
                <div className="my-2 ml-auto">
                    <ArrowDownIcon className="text-grey-400 h-4 w-4 stroke-2" />
                </div>
            </div>
            <div className="w-100 mt-2">
                <KoenigToggleEditor
                    placeholderClassName={'text-grey-900 pointer-events-none absolute top-0 left-0 m-0 min-w-full cursor-text font-serif text-xl font-normal leading-relaxed tracking-wide opacity-40'}
                    placeholderText={contentPlaceholder}
                    readOnly={!isEditing}
                    setText={setContent}
                    text={content}
                    textClassName={'text-grey-900 mt-2 mb-0 h-auto w-full pb-0 font-serif text-xl font-normal leading-relaxed opacity-100'}
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