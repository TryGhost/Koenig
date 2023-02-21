import React from 'react';
import KoenigEditor from '../components/KoenigEditor';
import {BASIC_TRANSFORMERS} from '../plugins/MarkdownShortcutPlugin';
import '../styles/index.css';

const KoenigBasicEditor = ({
    registerAPI,
    cursorDidExitAtTop
}) => {
    return (
        <KoenigEditor
            registerAPI={registerAPI}
            cursorDidExitAtTop={cursorDidExitAtTop}
            markdownTransformers={BASIC_TRANSFORMERS}
        />
    );
};

export default KoenigBasicEditor;
