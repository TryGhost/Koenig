import React from 'react';
import {Toggle} from './Toggle';

export function VisibilityDropdown({isChecked, onChange}) {
    return (
        <div className="flex w-[254px] flex-col gap-1 rounded-lg bg-white p-6 shadow-md">
            <div className="text-sm font-bold">Visibility</div>
            <ToggleSetting 
                dataTestId='visibility-toggle-email-only'
                isChecked={isChecked?.emailOnly}
                label="Show in email only"
                onChange={event => onChange('emailOnly')} />
            <hr className="mt-1 border-grey-250 pb-1 dark:border-white/5" />
            <ToggleSetting 
                dataTestId='visibility-toggle-free-members'
                isChecked={isChecked?.freeMembers}
                label="Free members"
                onChange={event => onChange('freeMembers')} />
            <ToggleSetting 
                dataTestId='visibility-toggle-paid-members'
                isChecked={isChecked?.paidMembers}
                label="Paid members"
                onChange={event => onChange('paidMembers')} />
        </div>
    );
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
