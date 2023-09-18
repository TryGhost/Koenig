import React from 'react';
import {ReactComponent as ArrowIcon} from '../../assets/icons/kg-arrow-down.svg';
import {DropdownContainer} from './DropdownContainer';
import {KeyboardSelection} from './KeyboardSelection';

function Item({item, selected, onChange}) {
    let selectionClass = '';

    if (selected) {
        selectionClass = 'bg-grey-100 dark:bg-grey-950';
    }

    // We use the capture phase of the mouse down event, otherwise the list option will be removed when blurring the input
    // before calling the click event
    const handleOptionMouseDown = (event, v) => {
        // Prevent losing focus when clicking an option
        event.preventDefault();
        onChange(v);
    };

    return (
        <li key={item.name} className={`${selectionClass} !mb-1 hover:bg-grey-100 dark:hover:bg-grey-950`}>
            <button className="h-full w-full cursor-pointer px-3 py-1 text-left dark:text-white" type="button" onMouseDownCapture={event => handleOptionMouseDown(event, item.name)}>{item.label}</button>
        </li>
    );
}

export function Dropdown({value, menu, onChange, dataTestId}) {
    const [open, setOpen] = React.useState(false);

    const handleOpen = (event) => {
        setOpen(!open);

        // For Safari, we need to manually focus the button (doesn't happen by default)
        if (!open) {
            event.target.focus();
        }
    };

    const preventLoseFocus = (event) => {
        // Prevent losing focus when clicking the dropdown
        // needed on Safari
        event.preventDefault();
    };

    const handleBlur = () => {
        setOpen(false);
    };

    const handleSelect = (name) => {
        setOpen(false);
        onChange(name);
    };

    const getItem = (item, selected) => {
        return (
            <Item key={item.name} item={item} selected={selected} onChange={handleSelect}/>
        );
    };

    const selectedItem = menu.find(menuItem => menuItem.name === value);
    const trigger = selectedItem?.label ?? '';

    return (
        <div className="relative z-0 font-sans text-sm font-normal" data-testid={dataTestId}>
            <button 
                className={`relative w-full cursor-pointer border border-grey-300 px-3 py-2 text-left font-sans font-normal text-grey-900 focus-visible:outline-none dark:border-grey-900 dark:bg-grey-900 dark:text-white dark:placeholder:text-grey-800 ${open ? 'rounded-t' : 'rounded'}`}
                data-testid={`${dataTestId}-value`}
                type="button"
                onBlur={handleBlur}
                onClick={handleOpen}
                onMouseDownCapture={preventLoseFocus}
            >
                {trigger}
                <ArrowIcon className={`absolute right-2 top-4 h-2 w-2 text-grey-600 ${open && 'rotate-180'}`} />
            </button>
            {open && (
                <DropdownContainer>
                    <KeyboardSelection
                        defaultSelected={selectedItem}
                        getItem={getItem}
                        items={menu}
                        onSelect={item => handleSelect(item.name)}
                    />
                </DropdownContainer>
            )}
        </div>

    );
}
