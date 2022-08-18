import './index.css';
import {$getRoot, $getSelection} from 'lexical';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {ListItemNode, ListNode} from '@lexical/list';
import {CodeHighlightNode, CodeNode} from '@lexical/code';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {TRANSFORMERS} from '@lexical/markdown';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';

export default function Editor() {
    const editorConfig = {
        // The editor theme
        // Handling of errors during update
        onError(error) {
            throw error;
        },
        // Any custom nodes go here
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            AutoLinkNode,
            LinkNode
        ]
    };
    const onChange = (editorState) => {
        editorState.read(() => {
            const root = $getRoot();
            const selection = $getSelection();
      
            console.log(root, selection); // eslint-disable-line no-console
        });
    };

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="koenig-react">

                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable />}
                        placeholder={<div>Enter some rich text...</div>}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <OnChangePlugin onChange={onChange} />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                </div>
            </div>
        </LexicalComposer>
    );
}
