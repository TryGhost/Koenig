import React from 'react';
import KoenigComposableEditor from '../components/KoenigComposableEditor';
import {MINIMAL_TRANSFORMERS} from '../plugins/MarkdownShortcutPlugin';
import RestrictContentPlugin from '../plugins/RestrictContentPlugin';
import '../styles/index.css';

const KoenigBasicEditor = ({
    registerAPI,
    cursorDidExitAtTop
}) => {
    return (
        <KoenigComposableEditor
            registerAPI={registerAPI}
            cursorDidExitAtTop={cursorDidExitAtTop}
            markdownTransformers={MINIMAL_TRANSFORMERS}
        >
            <RestrictContentPlugin paragraphs={1} />
        </KoenigComposableEditor>
    );
};

export default KoenigBasicEditor;
