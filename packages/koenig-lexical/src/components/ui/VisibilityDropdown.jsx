import React from 'react';
import {Dropdown} from './Dropdown';
import {Toggle} from './Toggle';
import {useVisibilityToggle} from '../../hooks/useVisibilityToggle.js';

export function VisibilityDropdown({editor, nodeKey, visibility, isActive}) {
    const [emailVisibility, toggleEmail] = useVisibilityToggle(editor, nodeKey, visibility);

    const dropdownOptions = [{
        label: 'All subscribers',
        name: 'status:all'
    }, {
        label: 'Free subscribers',
        name: 'status:free'
    }, {
        label: 'Paid subscribers',
        name: 'status:-free'
    }];

    if (!isActive) {
        return <></>;
    }

    if (isActive) {
        return (
            <div className="not-kg-prose absolute left-1/2 top-0 z-[1001] flex w-[254px] -translate-x-1/2 flex-col gap-1 rounded-lg bg-white p-6 shadow-md">
                <div className="text-sm font-bold">Visibility</div>
                <ToggleSetting
                    dataTestId='visibility-toggle-email-only'
                    isChecked={emailVisibility}
                    label="Show on web"
                    onChange={e => toggleEmail(e)} />
                <hr className="mt-1 border-grey-250 pb-1 dark:border-white/5" />
                <ToggleSetting
                    dataTestId='visibility-toggle-email-only'
                    isChecked={emailVisibility}
                    label="Show in email"
                    onChange={e => toggleEmail(e)} />
                {
                    emailVisibility && (
                        <>
                            <Dropdown
                                menu={dropdownOptions}
                                value='All subscribers'
                            />
                        </>
                    )
                }
            </div>
        );
    }
}

function ToggleSetting({label, isChecked, onChange, dataTestId}) {
    return (
        <div className="flex min-h-[3rem] w-full items-center justify-between text-sm">
            <label className="text-grey-900 dark:text-grey-300">{label}</label>
            <div className="flex shrink-0 pl-2">
                <Toggle dataTestId={dataTestId} isChecked={isChecked} onChange={onChange} />
            </div>
        </div>
    );
}