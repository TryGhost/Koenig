import React from 'react';
import {ReactComponent as ArrowIcon} from '../../assets/icons/kg-arrow-down.svg';
import {ReactComponent as CloseIcon} from '../../assets/icons/kg-close.svg';
import {DropdownContainer} from './DropdownContainer';
import {KeyboardSelection} from './KeyboardSelection';
import {partition} from 'lodash-es';

function Item({item, selected, onChange}) {
    let selectionClass = '';

    if (item.name && selected) {
        selectionClass = 'bg-grey-100 hover:bg-grey-100 dark:hover:bg-grey-950';
    }

    // We use the capture phase of the mouse down event, otherwise the list option will be removed when blurring the input
    // before calling the click event
    const handleOptionMouseDown = (event) => {
        // Prevent losing focus when clicking an option
        event.preventDefault();
        onChange(item);
    };

    return (
        <li key={item.name} className={selectionClass}>
            <button
                className="h-full w-full cursor-pointer px-3 py-1 text-left dark:text-white"
                data-testid="label-dropdown-item"
                type="button"
                onMouseDownCapture={handleOptionMouseDown}
            >
                {item.label}
            </button>
        </li>
    );
}

export function LabelDropdown({value = [], menu, onChange, dataTestId}) {
    const [open, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState('');
    const [newLabels, setNewLabels] = React.useState([]);
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

    const handleSelect = (item) => {
        if (!item.name || value?.includes(item.id)) {
            return;
        }

        // TODO: How to handle new labels?
        if (!item.id) {
            item.id = `new-label-${item.name}`;
            setNewLabels(newLabels.concat({id: item.id, name: item.name}));
        }

        onChange(value.concat(item.id));
        setFilter('');
    };

    const handleDeselect = (event, item) => {
        // Prevent losing focus when clicking an option
        event.preventDefault();

        onChange(value.filter(selection => selection !== item.id));
        setNewLabels(newLabels.filter(label => label.id !== item.id));
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

    const allLabels = menu.concat(newLabels).map(label => ({...label, label: label.name}));
    const [selectedLabels, nonSelectedLabels] = partition(allLabels, label => value?.includes(label.id));
    const filteredItems = nonSelectedLabels.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
    const emptyItem = filter && !selectedLabels?.some(label => label.name === filter)
        ? [{id: undefined, name: filter, label: <>Add <strong>&quot;{filter}&quot;...</strong></>}]
        : [{id: undefined, name: undefined, label: 'Type to search'}];

    return (
        <div className="relative font-sans text-sm font-normal" data-testid={dataTestId}>
            <div
                className={`border-grey-300 text-grey-900 dark:border-grey-900 dark:bg-grey-900 dark:placeholder:text-grey-800 relative flex w-full cursor-text flex-wrap gap-1 border py-2 pl-3 pr-5 text-left font-sans font-normal focus-visible:outline-none dark:text-white ${open ? 'rounded-t' : 'rounded'}`}
                type="button"
                onClick={() => inputRef.current.focus()}
            >
                {selectedLabels.map(label => (
                    <button
                        key={label.id}
                        className="bg-grey-900 dark:bg-grey-100 dark:text-grey-900 flex cursor-pointer items-center rounded-sm py-1 px-2 leading-none text-white"
                        data-testid="label-dropdown-selected"
                        type="button"
                        onMouseDownCapture={event => handleDeselect(event, label)}
                    >
                        {label.label}
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
                        onSelect={handleSelect}
                    />
                </DropdownContainer>
            )}
        </div>
    );
}
