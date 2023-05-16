import {useCallback, useEffect, useRef} from 'react';

export default function useFocusHistory({length = 2, enabled = true} = {}) {
    const focusHistory = useRef([]);

    const handleFocus = useCallback((event) => {
        focusHistory.current = [event.target].concat(focusHistory.current).slice(0, length);
    }, [length]);

    useEffect(() => {
        if (enabled) {
            document.addEventListener('focusin', handleFocus);

            return () => {
                document.removeEventListener('focusin', handleFocus);
            };
        } else {
            focusHistory.current = [];
        }
    }, [enabled, handleFocus]);

    return {
        focusHistory,
        restorePreviousFocus: () => {
            focusHistory.current[1]?.focus();
        }
    };
}
