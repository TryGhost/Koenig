import React from 'react';

const Group = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            {children}
        </>
    );
};

export interface GroupData {
    label: string;
    items: Array<{value?: string | null; [key: string]: unknown}>;
}

interface KeyboardSelectionWithGroupsProps {
    groups: GroupData[];
    getItem: (item: unknown, selected: boolean, onMouseOver: () => void, scrollIntoView: boolean) => React.ReactNode;
    getGroup: (group: GroupData, opts: {showSpinner?: boolean}) => React.ReactNode;
    onSelect: (item: unknown) => void;
    defaultSelected?: unknown;
    isLoading?: boolean;
}

export function KeyboardSelectionWithGroups({groups, getItem, getGroup, onSelect, defaultSelected, isLoading}: KeyboardSelectionWithGroupsProps) {
    const items = groups.flatMap(group => group.items);
    const defaultIndex = Math.max(0, items.findIndex(item => item === defaultSelected));
    const [selectedIndex, setSelectedIndex] = React.useState(defaultIndex);
    const [scrollSelectedIntoView, setScrollSelectedIntoView] = React.useState(false);

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
            setScrollSelectedIntoView(true);
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            setSelectedIndex((i) => {
                return Math.max(i - 1, 0);
            });
            setScrollSelectedIntoView(true);
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
            {groups.map((group, groupIndex) => (
                <Group key={group.label}>
                    {getGroup(group, {showSpinner: groupIndex === 0 && isLoading})}
                    {(group.items || []).map((item, index) => {
                        const itemsBefore = groups.slice(0, groupIndex).reduce((sum, prevGroup) => sum + prevGroup.items.length, 0);
                        const absoluteIndex = itemsBefore + index;
                        const isSelected = absoluteIndex === selectedIndex && !!item.value;
                        const onMouseOver = () => {
                            if (item.value) {
                                setSelectedIndex(absoluteIndex);
                            }
                            setScrollSelectedIntoView(false);
                        };
                        return getItem(item, isSelected, onMouseOver, scrollSelectedIntoView);
                    })}
                </Group>
            ))}
        </>
    );
}
