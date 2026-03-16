import type {LexicalEditor} from 'lexical';
import generateEditorState from '../generateEditorState';

export default function populateEditor({editor, initialHtml}: {editor: LexicalEditor; initialHtml?: string}) {
    generateEditorState({editor, initialHtml});
}
