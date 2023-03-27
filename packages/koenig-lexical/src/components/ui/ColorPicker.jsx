import React from 'react';

export function ColorPicker({buttons = [], selectedName, onClick}) {
    return (
        <div className="flex">
            <ul className="flex w-full items-center justify-between rounded font-sans text-md font-normal text-white">
                {buttons.map(({label, name, colorClass}) => (
                    <ColorButton
                        key={`${name}-${label}`}
                        colorClass={colorClass}
                        label={label}
                        name={name}
                        selectedName={selectedName}
                        onClick={onClick}
                    />
                ))}
            </ul>
        </div>
    );
}

export function ColorButton({onClick, label, name, colorClass, selectedName}) {
    const isActive = name === selectedName;
    return (
        <li>
            <button
                aria-label={label}
                className={`flex h-[3rem] w-[3rem] cursor-pointer items-center justify-center rounded-full border-2 ${isActive ? 'border-green' : 'border-transparent'}`}
                data-test-id={`color-picker-${name}`}
                type="button"
                onClick={() => onClick(name)}
            >
                <span
                    className={`${colorClass} h-6 w-6 rounded-full border-2 border-black/5`}
                ></span>
            </button>
        </li>
    );
}
