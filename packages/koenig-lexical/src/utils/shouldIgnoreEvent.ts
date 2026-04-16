// util to avoid processing events in Koenig when they originate from an editor
// element inside a card
export const shouldIgnoreEvent = (event: KeyboardEvent | ClipboardEvent): boolean => {
    if (!event) {
        return false;
    }

    const target = event.target;
    const metaKey = 'metaKey' in event ? event.metaKey : false;
    const key = 'key' in event ? event.key : undefined;
    const isEscape = key === 'Escape';
    const isMetaEnter = metaKey && key === 'Enter';

    // we want to allow some keys presses to pass through as we
    // always override them to toggle card editing mode
    if (isEscape || isMetaEnter) {
        return false;
    }

    const el = target as HTMLElement & {cmView?: unknown; cmIgnore?: unknown};
    const isFromCardEditor = el.matches('input, textarea') || el.cmView || el.cmIgnore || !!el.closest('.cm-editor');

    return !!isFromCardEditor;
};
