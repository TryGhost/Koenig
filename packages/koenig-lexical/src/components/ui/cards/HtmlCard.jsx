import '@tryghost/kg-simplemde/dist/simplemde.min.css';
import HtmlEditor from './HtmlCard/HtmlEditor';
import PropTypes from 'prop-types';
import React from 'react';
import {sanitizeHtml} from '../../../utils/sanitize-html';

export function HtmlCard({html, updateHtml, isEditing, darkMode}) {
    return (
        <>
            {isEditing
                ? (
                    <HtmlEditor
                        darkMode={darkMode}
                        html={html}
                        updateHtml={updateHtml}
                    />
                )
                : <div><HtmlDisplay html={html} /><div className="absolute inset-0 z-50 mt-0"></div></div>
            }
        </>
    );
}

function HtmlDisplay({html}) {
    const sanitizedHtml = sanitizeHtml(html, {replaceJS: true});

    return <div dangerouslySetInnerHTML={{__html: sanitizedHtml}} className="min-h-[3.5vh] whitespace-normal"></div>;
}

HtmlDisplay.propTypes = {
    html: PropTypes.string
};

HtmlCard.propTypes = {
    html: PropTypes.string,
    updateHtml: PropTypes.func,
    isEditing: PropTypes.bool,
    darkMode: PropTypes.bool
};
