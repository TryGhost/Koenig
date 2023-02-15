import React from 'react';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import KoenigComposerContext from '../context/KoenigComposerContext';
import KoenigBehaviourPlugin from '../plugins/KoenigBehaviourPlugin';
import MarkdownShortcutPlugin from '../plugins/MarkdownShortcutPlugin';
import FloatingFormatToolbarPlugin from '../plugins/FloatingFormatToolbarPlugin';
import DragDropPastePlugin from '../plugins/DragDropPastePlugin';
import {EditorPlaceholder} from './ui/EditorPlaceholder';
import {ExternalControlPlugin} from '../plugins/ExternalControlPlugin';
import DragDropReorderPlugin from '../plugins/DragDropReorderPlugin';
import '../styles/index.css';

const KoenigEditor = ({
    onChange,
    markdownTransformers,
    registerAPI,
    cursorDidExitAtTop,
    children
}) => {
    const _onChange = React.useCallback((editorState) => {
        const json = editorState.toJSON();
        onChange?.(json);
    }, [onChange]);

    const {editorContainerRef} = React.useContext(KoenigComposerContext);
    // we need an element reference for the container element that
    // any floating elements in plugins will be rendered inside
    const [floatingAnchorElem, setFloatingAnchorElem] = React.useState(null);
    const onRef = (_floatingAnchorElem) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    return (
        <div className="koenig-lexical" ref={editorContainerRef} id="koenig-lexical">
            <RichTextPlugin
                contentEditable={
                    <div ref={onRef} data-kg="editor">
                        <ContentEditable className="kg-prose" />
                    </div>
                }
                placeholder={<EditorPlaceholder />}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={_onChange} />
            <HistoryPlugin /> {/* adds undo/redo */}
            <KoenigBehaviourPlugin containerElem={editorContainerRef} cursorDidExitAtTop={cursorDidExitAtTop} />
            <MarkdownShortcutPlugin transformers={markdownTransformers} />
            {floatingAnchorElem && (<FloatingFormatToolbarPlugin anchorElem={floatingAnchorElem} />)}
            <DragDropPastePlugin />
            <ExternalControlPlugin registerAPI={registerAPI} />
            <DragDropReorderPlugin containerElem={editorContainerRef} />
            {children}
        </div>
    );
};

export default KoenigEditor;
