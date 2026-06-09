export function EditorPlaceholder({className, text}) {
    return (
        <div
            className={`kg-editor-placeholder pointer-events-none absolute left-0 top-0 min-w-full cursor-text text-grey-500 dark:text-grey-800 ${className}`}
        >{typeof text === 'string' ? text : 'Begin writing your post...'}</div>
    );
}
