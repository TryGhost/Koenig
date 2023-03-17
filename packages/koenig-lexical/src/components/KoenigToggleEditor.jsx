import React from 'react';
import {HtmlOutputPlugin, KoenigComposableEditor, KoenigComposer, MINIMAL_NODES, MINIMAL_TRANSFORMERS, RestrictContentPlugin} from '../index.js';

const Placeholder = ({text = 'Type here', className = ''}) => {
    return (
        <div className={className}>
            {text}
        </div>
    );
};

const KoenigToggleEditor = ({paragraphs = 1, text, setText, placeholderText, textClassName, placeholderClassName, readOnly}) => {
    return (
        <KoenigComposer
            nodes={MINIMAL_NODES}
        >
            <KoenigComposableEditor
                className={textClassName}
                isDragEnabled={false}
                markdownTransformers={MINIMAL_TRANSFORMERS}
                placeholder={<Placeholder className={placeholderClassName} text={placeholderText} />}
                readOnly={readOnly}
            >
                <RestrictContentPlugin paragraphs={paragraphs} />
                <HtmlOutputPlugin html={text} setHtml={setText} />
            </KoenigComposableEditor>
        </KoenigComposer>
    );
};

export default KoenigToggleEditor;
