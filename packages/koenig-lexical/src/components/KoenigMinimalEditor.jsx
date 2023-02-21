import React from 'react';
import KoenigEditor from '../components/KoenigEditor';
import {MINIMAL_TRANSFORMERS} from '../plugins/MarkdownShortcutPlugin';
import RestrictContentPlugin from '../plugins/RestrictContentPlugin';
import '../styles/index.css';

const KoenigBasicEditor = ({
    registerAPI,
    cursorDidExitAtTop
}) => {
    return (
        <KoenigEditor
            registerAPI={registerAPI}
            cursorDidExitAtTop={cursorDidExitAtTop}
            markdownTransformers={MINIMAL_TRANSFORMERS}
        >
            <RestrictContentPlugin paragraphs={1} />
        </KoenigEditor>
    );
};

export default KoenigBasicEditor;
