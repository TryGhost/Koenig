interface KoenigTestEditor {
    blur(): void;
    setEditorState(state: unknown): void;
    getEditorState(): {toJSON(): unknown};
    parseEditorState(state: unknown): unknown;
    update(fn: () => void): void;
    dispatchCommand(command: unknown, payload: unknown): void;
}

interface KoenigTestWindow {
    lexicalEditor: KoenigTestEditor;
    originalEditorState: unknown;
    navigate: (path: string) => void;
}

declare interface Window {
    lexicalEditor: KoenigTestEditor;
    originalEditorState: unknown;
    navigate: (path: string) => void;
}
