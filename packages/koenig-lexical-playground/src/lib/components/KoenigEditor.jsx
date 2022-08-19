import React from 'react';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {TRANSFORMERS as defaultMarkdownTransformers} from '@lexical/markdown';
import AutofocusPlugin from '../plugins/autofocus';
import '../index.css';

const KoenigEditor = ({
    onChange,
    autoFocus,
    markdownTransformers = defaultMarkdownTransformers
}) => {
    const _onChange = React.useCallback((editorState) => {
        const json = editorState.toJSON();
        // console.log(json); // eslint-disable-line
        onChange?.(json);
    }, [onChange]);

    return (
        <>
            <RichTextPlugin
                contentEditable={<ContentEditable />}
                placeholder={<div className="pointer-events-none absolute top-0 left-0 min-w-full cursor-text">Enter some text...</div>}
            />
            <OnChangePlugin onChange={_onChange} />
            <HistoryPlugin />
            <MarkdownShortcutPlugin transformers={markdownTransformers} />
            {autoFocus && <AutofocusPlugin />}
        </>
    );
};

export default KoenigEditor;
