import React from 'react';
import {Toggle} from './Toggle';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useVisibilityToggle} from '../../utils/visibilityToggle.js';

export function VisibilityDropdown({nodeKey, visibility}) {
    const [editor] = useLexicalComposerContext();
    const [emailVisibility, toggleEmail, toggleMembers, freeMemberVisibility, paidMemberVisibility] = useVisibilityToggle(editor, nodeKey, visibility);
    return (
        <div className="flex w-[254px] flex-col gap-1 rounded-lg bg-white p-6 shadow-md">
            <div className="text-sm font-bold">Visibility</div>
            <ToggleSetting 
                dataTestId='visibility-toggle-email-only'
                isChecked={emailVisibility}
                label="Show in email only"
                onChange={e => toggleEmail(e)} />
            <hr className="mt-1 border-grey-250 pb-1 dark:border-white/5" />
            <ToggleSetting 
                dataTestId='visibility-toggle-free-members'
                isChecked={freeMemberVisibility}
                label="Free members"
                onChange={e => toggleMembers(e, 'free')}
            />
            <ToggleSetting 
                dataTestId='visibility-toggle-paid-members'
                isChecked={paidMemberVisibility}
                label="Paid members"
                onChange={e => toggleMembers(e, 'paid')}
            />
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
