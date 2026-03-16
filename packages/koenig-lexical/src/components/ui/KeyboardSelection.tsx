import React from 'react';

interface KeyboardSelectionProps {
    items: unknown[];
    getItem: (item: unknown, selected: boolean) => React.ReactNode;
    onSelect: (item: unknown) => void;
    defaultSelected?: unknown;
}

export function KeyboardSelection({items, getItem, onSelect, defaultSelected}: KeyboardSelectionProps) {
    const defaultIndex = Math.max(0, items.findIndex(item => item === defaultSelected));
    const [selectedIndex, setSelectedIndex] = React.useState(defaultIndex);

    React.useEffect(() => {
        if (selectedIndex >= items.length) {
            setSelectedIndex(defaultIndex);
        }
    }, [items, selectedIndex, defaultIndex]);

    React.useEffect(() => {
        setSelectedIndex(defaultIndex);
    }, [defaultIndex]);

    const handleKeydown = React.useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            event.stopPropagation();
            setSelectedIndex((i) => {
                return Math.min(i + 1, items.length - 1);
            });
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            setSelectedIndex((i) => {
                return Math.max(i - 1, 0);
            });
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            onSelect(items[selectedIndex]);
        }
    }, [items, selectedIndex, onSelect]);

    React.useEffect(() => {
        window.addEventListener('keydown', handleKeydown, {capture: true});
        return () => {
            window.removeEventListener('keydown', handleKeydown, {capture: true});
        };
    }, [handleKeydown]);

    return (
        <>
            {items.map((item, index) => {
                return getItem(item, index === selectedIndex);
            })}
        </>
    );
}
