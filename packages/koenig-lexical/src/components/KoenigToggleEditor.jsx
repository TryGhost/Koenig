import React from 'react';
import {BASIC_NODES, BASIC_TRANSFORMERS, HtmlOutputPlugin, KoenigComposableEditor, KoenigComposer, RestrictContentPlugin} from '../index.js';

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
            nodes={BASIC_NODES}
        >
            <KoenigComposableEditor
                className={textClassName}
                markdownTransformers={BASIC_TRANSFORMERS}
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
