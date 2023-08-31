import React from 'react';
import {ReactComponent as PlusIcon} from '../../../assets/icons/plus.svg';
import {ReactComponent as ReplaceIcon} from '../../../assets/icons/kg-sync.svg';

export const Dropdown = ({
    snippets,
    onCreateSnippet,
    onUpdateSnippet,
    value,
    isCreateButtonActive,
    onKeyDown,
    activeMenuItem
}) => {
    return (
        <ul
            className="absolute mt-[-1px] w-full max-w-[240px] rounded-b border border-grey-200 bg-white shadow dark:border-grey-900 dark:bg-grey-950"
            tabIndex={0}
            onKeyDown={onKeyDown}
        >

            <li className="mb-0 block">
                <button
                    className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm font-medium text-green hover:bg-grey-100 dark:hover:bg-black ${isCreateButtonActive ? 'bg-grey-100 dark:bg-black' : ''}`}
                    type="button"
                    onClick={onCreateSnippet}
                >
                    <span>Create &quot;{value}&ldquo;</span>
                    <PlusIcon className="h-3 w-3 stroke-green stroke-[3px]" />
                </button>
            </li>

            {!!snippets.length && (
                <DropdownSection
                    activeMenuItem={activeMenuItem}
                    list={snippets}
                    onClick={onUpdateSnippet}
                />
            )}
        </ul>
    );
};

const DropdownSection = ({list = [], onClick, activeMenuItem}) => {
    return (
        <li role="separator">
            <span className="tracking-loose block border-t border-grey-200 px-3 pb-2 pt-3 text-xs font-medium uppercase text-grey dark:border-grey-900 dark:text-grey-800">Replace existing</span>
            <ul role="menu">
                {
                    list.map((item, index) => (
                        <DropdownItem
                            key={item.name}
                            active={activeMenuItem}
                            index={index}
                            name={item.name}
                            onClick={onClick}
                        />
                    ))
                }
            </ul>
        </li>
    );
};

const DropdownItem = ({onClick, name, active, index}) => {
    return (
        <li className="mb-1">
            <button
                // ref={buttonRef}
                className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm hover:bg-grey-100 ${index === active ? 'bg-grey-100 dark:bg-black' : ''} dark:hover:bg-black`}
                type="button"
                onClick={() => onClick(name)}
            >
                <span>{name}</span>
                <div className="h-5 w-5 fill-grey-900">
                    <ReplaceIcon className="h-4 w-4 fill-grey-900 dark:fill-grey-600" />
                </div>
            </button>
        </li>
    );
};
