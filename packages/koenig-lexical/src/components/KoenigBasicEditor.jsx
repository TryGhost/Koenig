import React from 'react';
import KoenigComposableEditor from '../components/KoenigComposableEditor';
import {BASIC_TRANSFORMERS} from '../plugins/MarkdownShortcutPlugin';
import '../styles/index.css';

const KoenigBasicEditor = ({
    registerAPI,
    cursorDidExitAtTop
}) => {
    return (
        <KoenigComposableEditor
            registerAPI={registerAPI}
            cursorDidExitAtTop={cursorDidExitAtTop}
            markdownTransformers={BASIC_TRANSFORMERS}
        />
    );
};

export default KoenigBasicEditor;
