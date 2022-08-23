import React from 'react';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import AutofocusPlugin from '../plugins/AutofocusPlugin';
import MarkdownShortcutPlugin from '../plugins/MarkdownShortcutPlugin';
import FloatingFormatToolbarPlugin from '../plugins/FloatingFormatToolbar';
import ImagePlugin from '../plugins/ImagePlugin';
import '../styles/index.css';

const KoenigEditor = ({
    onChange,
    autoFocus,
    markdownTransformers
}) => {
    const _onChange = React.useCallback((editorState) => {
        const json = editorState.toJSON();
        // console.log(json); // eslint-disable-line
        onChange?.(json);
    }, [onChange]);

    const [floatingAnchorElem, setFloatingAnchorElem] = React.useState(null);
    const onRef = (_floatingAnchorElem) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    return (
        <div className="koenig-react">
            <RichTextPlugin
                contentEditable={
                    <div ref={onRef}>
                        <ContentEditable className="kg-prose" />
                    </div>
                }
                placeholder={<div className="pointer-events-none absolute top-0 left-0 min-w-full cursor-text">Enter some text...</div>}
            />
            <OnChangePlugin onChange={_onChange} />
            <HistoryPlugin />
            <MarkdownShortcutPlugin transformers={markdownTransformers} />
            <ListPlugin /> {/* adds indent/outdent/remove etc support */}
            {autoFocus && <AutofocusPlugin />}
            {floatingAnchorElem && (<FloatingFormatToolbarPlugin anchorElem={floatingAnchorElem} />)}
            <ImagePlugin />
        </div>
    );
};

export default KoenigEditor;
