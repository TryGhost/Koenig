import KoenigNestedEditor from '../../KoenigNestedEditor';
import PropTypes from 'prop-types';
import React from 'react';
import {ReactComponent as HelpIcon} from '../../../assets/icons/help.svg';

export function EmailCard({htmlEditor, isEditing}) {
    return (
        <div className="w-full">
            <KoenigNestedEditor
                autoFocus={true}
                initialEditor={htmlEditor}
                nodes='basic'
                textClassName='kg-email-html'
            />

            {isEditing && 
                <div className="mt-0 flex items-center justify-center bg-grey-100 p-2 font-sans text-sm font-normal leading-8 text-grey-600">
                    Only visible when delivered by email, this card will not be published on your site.
                    <a href="https://ghost.org/help/email-newsletters/#email-cards" rel="noopener noreferrer" target="_blank">
                        <HelpIcon className="ml-1 mt-[1px] stroke-[1.2px] text-grey-600" />
                    </a>
                </div>
            }
        </div>
    );
}

EmailCard.propTypes = {
    htmlEditor: PropTypes.object,
    isEditing: PropTypes.bool
};

EmailCard.defaultProps = {
    isEditing: false
};
