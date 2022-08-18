import React from 'react';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import AutofocusPlugin from '../plugins/autofocus';
import '../index.css';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
    console.error(error); // eslint-disable-line
}

const KoenigEditor = ({onChange, autoFocus}) => {
    const initialConfig = {
        namespace: 'KoenigEditor',
        onError
    };

    const _onChange = React.useCallback((editorState) => {
        const json = editorState.toJSON();
        console.log(json); // eslint-disable-line
        onChange?.(json);
    }, [onChange]);

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <PlainTextPlugin
                contentEditable={<ContentEditable />}
                placeholder={<div className="pointer-events-none absolute top-0 left-0 min-w-full cursor-text">Enter some text...</div>}
            />
            <OnChangePlugin onChange={_onChange} />
            <HistoryPlugin />
            {autoFocus && <AutofocusPlugin />}
        </LexicalComposer>
    );
};

export default KoenigEditor;
