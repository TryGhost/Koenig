import React from 'react';
import './index.css';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {TRANSFORMERS} from '@lexical/markdown';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import Toolbar from './toolbar/Toolbar';
import DefaultNodes from './nodes/DefaultNodes';

export default function Editor({contentJson}) {
    const editorConfig = {
        // The editor theme
        // Handling of errors during update
        onError(error) {
            throw error;
        },
        // Any custom nodes go here
        nodes: [...DefaultNodes],
        editorState: contentJson,
        readOnly: false
    };

    const [instance, setInstance] = React.useState(null);

    const handleChange = (editorState) => {
        setInstance(editorState);
    };

    return (
        <LexicalComposer initialConfig={{...editorConfig, readOnly: false}}>
            <div className="koenig-react">
                <div className="kg-prose">
                    <Toolbar instance={instance} />
                    <RichTextPlugin
                        contentEditable={<ContentEditable />}
                        placeholder={<div>Enter some rich text...</div>}
                    />
                    <HistoryPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <OnChangePlugin onChange={handleChange} />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                </div>
            </div>
        </LexicalComposer>
    );
}
