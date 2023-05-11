import React from 'react';
import {ReactComponent as ArrowIcon} from '../../assets/icons/kg-arrow-down.svg';
import {ReactComponent as CloseIcon} from '../../assets/icons/kg-close.svg';
import {DropdownContainer} from './DropdownContainer';
import {KeyboardSelection} from './KeyboardSelection';

function Item({item, selected, onChange}) {
    let selectionClass = '';

    if (item.name && selected) {
        selectionClass = 'bg-grey-100 hover:bg-grey-100 dark:hover:bg-grey-950';
    }

    // We use the capture phase of the mouse down event, otherwise the list option will be removed when blurring the input
    // before calling the click event
    const handleOptionMouseDown = (event, v) => {
        // Prevent losing focus when clicking an option
        event.preventDefault();
        onChange(v);
    };

    return (
        <li key={item.name} className={selectionClass}>
            <button className="h-full w-full cursor-pointer px-3 py-1 text-left dark:text-white" type="button" onMouseDownCapture={event => handleOptionMouseDown(event, item.name)}>{item.label}</button>
        </li>
    );
}

export function LabelDropdown({value = [], labels, onChange}) {
    const [open, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState('');
    const inputRef = React.useRef(null);

    const handleOpen = (event) => {
        setOpen(!open);

        // For Safari, we need to manually focus the button (doesn't happen by default)
        if (!open) {
            event.target.focus();
        }
    };

    const handleBlur = () => {
        setOpen(false);
    };

    const handleSelect = (name) => {
        if (!name || value?.includes(name)) {
            return;
        }

        onChange(value.concat(name));
        setFilter('');
    };

    const handleDeselect = (event, name) => {
        // Prevent losing focus when clicking an option
        event.preventDefault();

        onChange(value.filter(selection => selection !== name));
    };

    const handleBackspace = (event) => {
        if (event.key === 'Backspace' && !filter) {
            onChange(value.slice(0, -1));
        }
    };

    const getItem = (item, selected) => {
        return (
            <Item key={item.name} item={item} selected={selected} onChange={handleSelect}/>
        );
    };

    const nonSelectedItems = labels.filter(label => !value?.includes(label)).map(label => ({name: label, label}));
    const filteredItems = nonSelectedItems.filter(item => item.label.toLowerCase().includes(filter.toLowerCase()));
    const emptyItem = filter && !value?.includes(filter)
        ? [{name: filter, label: <>Add <strong>&quot;{filter}&quot;...</strong></>}]
        : [{name: undefined, label: 'Type to search'}];

    return (
        <div className="relative font-sans text-sm font-normal">
            <div
                className={`border-grey-300 text-grey-900 dark:border-grey-900 dark:bg-grey-900 dark:placeholder:text-grey-800 relative flex w-full cursor-text flex-wrap gap-1 border py-2 pl-3 pr-5 text-left font-sans font-normal focus-visible:outline-none dark:text-white ${open ? 'rounded-t' : 'rounded'}`}
                type="button"
                onClick={() => inputRef.current.focus()}
            >
                {value.map(label => (
                    <button
                        key={label}
                        className="bg-grey-900 dark:bg-grey-100 dark:text-grey-900 flex cursor-pointer items-center rounded-sm py-1 px-2 leading-none text-white"
                        type="button"
                        onMouseDownCapture={event => handleDeselect(event, label)}
                    >
                        {label}
                        <CloseIcon className="ml-2 h-2 w-2" />
                    </button>
                ))}

                <div className="flex-1">
                    <input
                        ref={inputRef}
                        className="h-full w-full min-w-[5rem] appearance-none bg-transparent px-1 leading-none outline-none"
                        placeholder=""
                        value={filter}
                        onBlur={handleBlur}
                        onChange={event => setFilter(event.target.value)}
                        onFocus={handleOpen}
                        onKeyDown={handleBackspace}
                    />
                </div>

                <ArrowIcon className={`text-grey-600 absolute right-2 top-4 h-2 w-2 ${open && 'rotate-180'}`} />
            </div>
            {open && (
                <DropdownContainer>
                    <KeyboardSelection
                        getItem={getItem}
                        items={filteredItems.length ? filteredItems : emptyItem}
                        onSelect={item => handleSelect(item.name)}
                    />
                </DropdownContainer>
            )}
        </div>
    );
}
