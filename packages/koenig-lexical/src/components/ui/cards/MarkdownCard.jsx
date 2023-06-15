import '@tryghost/kg-simplemde/dist/simplemde.min.css';
import MarkdownEditor from './MarkdownCard/MarkdownEditor';
import MarkdownRenderer from '@tryghost/kg-markdown-html-renderer';
import PropTypes from 'prop-types';
import React from 'react';
import {sanitizeHtml} from '../../../utils/sanitize-html';

export function MarkdownCard({markdown = '', updateMarkdown, isEditing, imageUploader, unsplashConf}) {
    return (
        <>
            {isEditing
                ? (
                    <div className="markdown-editor">
                        <MarkdownEditor
                            imageUploader={imageUploader}
                            markdown={markdown}
                            unsplashConf={unsplashConf}
                            updateMarkdown={updateMarkdown}
                        />
                    </div>
                )
                : <MarkdownDisplay markdown={markdown} />
            }
        </>
    );
}

function MarkdownDisplay({markdown}) {
    const markdownHtml = MarkdownRenderer.render(markdown);
    const sanitizedHtml = sanitizeHtml(markdownHtml, {replaceJS: true});

    return (
        <div className="relative">
            <div dangerouslySetInnerHTML={{__html: sanitizedHtml}} className="whitespace-normal"></div>
            {/* Read-only overlay - prevents links etc being clickable and causing unexpected quits */}
            <div className="absolute inset-0 z-50 mt-0"></div>
        </div>
    );
}

MarkdownCard.propTypes = {
    markdown: PropTypes.string,
    updateMarkdown: PropTypes.func,
    isEditing: PropTypes.bool,
    imageUploader: PropTypes.func,
    unsplashConf: PropTypes.object
};

MarkdownDisplay.propTypes = {
    markdown: PropTypes.string
};
