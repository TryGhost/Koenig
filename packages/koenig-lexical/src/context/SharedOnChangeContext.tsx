import React from 'react';
import type {EditorState, LexicalEditor} from 'lexical';

interface SharedOnChangeContextType {
    onChange: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void;
}

const Context = React.createContext<SharedOnChangeContextType>({} as SharedOnChangeContextType);

export const SharedOnChangeContext = ({onChange, children}: {onChange: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void; children: React.ReactNode}) => {
    const onChangeContext = React.useMemo(
        () => ({onChange}),
        [onChange]
    );

    return <Context.Provider value={onChangeContext}>{children}</Context.Provider>;
};

export const useSharedOnChangeContext = () => React.useContext(Context);
