import '../styles/index.css';
import KoenigComposableEditor from './KoenigComposableEditor';
import {AllDefaultPlugins} from '../plugins/AllDefaultPlugins';
import {SharedHistoryContext} from '../context/SharedHistoryContext';
import {SharedOnChangeContext} from '../context/SharedOnChangeContext';

interface KoenigEditorProps {
    onChange?: (...args: unknown[]) => void;
    children?: React.ReactNode;
    [key: string]: unknown;
}

const KoenigEditor = ({
    onChange,
    children,
    ...props
}: KoenigEditorProps) => {
    return (
        <SharedHistoryContext>
            <SharedOnChangeContext onChange={onChange as unknown as (editorState: import('lexical').EditorState, editor: import('lexical').LexicalEditor, tags: Set<string>) => void}>
                <KoenigComposableEditor {...props}>
                    <AllDefaultPlugins />
                    {children}
                </KoenigComposableEditor>
            </SharedOnChangeContext>
        </SharedHistoryContext>
    );
};

export default KoenigEditor;
