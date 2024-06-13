import React from 'react';
import escapeRegExp from 'lodash/escapeRegExp';
import {Delayed} from './Delayed';
import {DropdownContainerCopy} from './DropdownContainerCopy';
import {Input} from './Input';
import {KeyboardSelectionWithGroups} from './KeyboardSelectionWithGroups';
import {Spinner} from './Spinner';

export function InputListLoadingItem({dataTestId}) {
    return (
        <Delayed>
            <li className={`mb-0 px-4 py-2 text-left`} data-testid={`${dataTestId}-loading`}>
                <span className="block text-sm font-medium leading-tight text-grey-900 dark:text-white">Searching...</span>
            </li>
        </Delayed>
    );
}

const HighlightedString = ({highlightString, string, truncateStart}) => {
    if (!highlightString) {
        return string;
    }

    const matchRegex = new RegExp(escapeRegExp(highlightString), 'gi');
    const indexes = [];

    // populate indexes with all the matches, having a start and end index
    let match;
    while ((match = matchRegex.exec(string)) !== null) {
        indexes.push({start: match.index, end: match.index + highlightString.length});
    }

    const parts = [];

    // if the match is later than 50 characters, truncate the start so it's more
    // likely the match will be visible when the string is truncated
    const startIndex = truncateStart && indexes[0]?.start >= 50 ? indexes[0].start - 20 : 0;
    if (startIndex > 0) {
        parts.push('...');
        parts.push(string.slice(startIndex, indexes[0]?.start));
    } else {
        parts.push(string.slice(0, indexes[0]?.start));
    }

    // add all parts of the string
    indexes.forEach((index, i) => {
        parts.push(string.slice(index.start, index.end));
        if (i < indexes.length - 1) {
            parts.push(string.slice(index.end, indexes[i + 1].start));
        } else {
            parts.push(string.slice(index.end));
        }
    });

    return (
        <>
            {parts.map((part, index) => {
                if (part.toLowerCase() === highlightString.toLowerCase()) {
                    // eslint-disable-next-line react/no-array-index-key
                    return <span key={index} className="font-bold">{part}</span>;
                }

                return part;
            })}
        </>
    );
};

export function InputListItem({dataTestId, item, selected, onClick, onMouseOver, highlightString, scrollIntoView}) {
    const itemRef = React.useRef(null);

    React.useEffect(() => {
        if (selected && scrollIntoView) {
            itemRef.current.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
        }
    }, [selected, scrollIntoView]);

    let selectionClass = '';

    if (selected) {
        selectionClass = 'bg-grey-100 dark:bg-grey-900';
    }

    if (!item.value) {
        selectionClass = 'pointer-events-none';
    }

    // We use the capture phase of the mouse down event, otherwise the list option will be removed when blurring the input
    // before calling the click event
    const handleMouseDown = (event) => {
        // Prevent losing focus when clicking an option
        event.preventDefault();
        onClick(item);
    };

    const HighlightedLabel = () => {
        if (!highlightString || item.highlight === false) {
            return item.label;
        }

        return <HighlightedString highlightString={highlightString} string={item.label} />;
    };

    const HighlightedExcerpt = () => {
        if (!item.excerpt) {
            return null;
        }

        let shouldHighlight = true;

        if (!highlightString || item.highlight === false) {
            shouldHighlight = false;
        }

        return (
            <span className="line-clamp-1 text-sm font-normal text-grey-600 dark:text-grey-500">
                {shouldHighlight ? <HighlightedString highlightString={highlightString} string={item.excerpt} truncateStart={true} /> : item.excerpt}
            </span>
        );
    };

    const Icon = item.Icon;

    return (
        <li ref={itemRef} aria-selected={selected} className={`${selectionClass} my-[.2rem] flex cursor-pointer flex-col gap-[.2rem] rounded-md px-4 py-2 text-left text-black dark:text-white`} data-testid={`${dataTestId}-listOption`} role="option" onMouseDownCapture={handleMouseDown} onMouseOver={onMouseOver}>
            <div className="flex items-center justify-between gap-4">
                <span className="line-clamp-1 flex items-center gap-[.6rem]">
                    {Icon && <Icon className="size-[1.4rem] stroke-[1.5px]" />}
                    <span className="block truncate text-sm font-medium leading-snug" data-testid={`${dataTestId}-listOption-label`}><HighlightedLabel /></span>
                </span>
                {selected && (item.metaText || item.MetaIcon) && (
                    <span className="flex shrink-0 items-center gap-1 text-[1.1rem] font-semibold uppercase leading-snug tracking-wide text-grey-600 dark:text-grey-500" data-testid={`${dataTestId}-listOption-meta`}>
                        <span title={item.metaIconTitle}>{item.MetaIcon && <item.MetaIcon className="size-3" />}</span>
                        {item.metaText && <span>{item.metaText}</span>}
                    </span>
                )}
            </div>
            <HighlightedExcerpt />
        </li>
    );
}

export function InputListGroup({dataTestId, group, showSpinner}) {
    return (
        <li className="mb-0 mt-2 flex items-center justify-between border-t border-grey-200 px-4 pb-2 pt-3 text-[1.1rem] font-semibold uppercase tracking-wide text-grey-600 first-of-type:mt-0 first-of-type:border-t-0 dark:border-grey-900" data-testid={`${dataTestId}-listGroup`}>
            <div className="flex items-center gap-1.5">
                {group.label}
                {showSpinner && <span className="ml-px" data-testid="input-list-spinner"><Spinner size="mini" /></span>}
            </div>
        </li>
    );
}

/**
 * Little warning here: this has an onChange handler that doesn't have an event as parameter, but just the value.
 *
 * @param {object} options
 * @param {{value: string, label: string}[]} [options.listOptions]
 * @param {string} [options.list]
 * @returns
 */
export function InputListCopy({autoFocus, className, inputClassName, dataTestId, listOptions, isLoading, isSearching, value, placeholder, onChange, onSelect}) {
    const [inputFocused, setInputFocused] = React.useState(false);

    const onFocus = () => {
        setInputFocused(true);
    };

    const onBlur = () => {
        setInputFocused(false);
    };

    const getItem = (item, selected, onMouseOver, scrollIntoView) => {
        return (
            <InputListItem
                key={item.value}
                dataTestId={dataTestId}
                highlightString={value}
                item={item}
                scrollIntoView={scrollIntoView}
                selected={selected}
                onClick={onSelectEvent}
                onMouseOver={onMouseOver}
            />
        );
    };

    const getGroup = (group, {showSpinner} = {}) => {
        return (
            <InputListGroup key={group.label} dataTestId={dataTestId} group={group} showSpinner={showSpinner} />
        );
    };

    const onChangeEvent = (event) => {
        onChange(event.target.value);
    };

    const onSelectEvent = (item) => {
        (onSelect || onChange)(item.value);
    };

    const showSuggestions = (isLoading || (listOptions && !!listOptions.length)) && inputFocused;

    return (
        <>
            <div className={`relative z-0 ${className || ''}`}>
                <Input
                    autoFocus={autoFocus}
                    className={inputClassName}
                    dataTestId={dataTestId}
                    placeholder={placeholder}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChangeEvent}
                    onFocus={onFocus}
                />
                {showSuggestions &&
                    <DropdownContainerCopy dataTestId={dataTestId}>
                        {isLoading && !listOptions?.length && <InputListLoadingItem dataTestId={dataTestId}/>}
                        <KeyboardSelectionWithGroups
                            getGroup={getGroup}
                            getItem={getItem}
                            groups={listOptions}
                            isLoading={isLoading}
                            onSelect={onSelectEvent}
                        />
                    </DropdownContainerCopy>
                }
            </div>
        </>
    );
}
