import React from 'react';
import clsx from 'clsx';
import useInputSelection from '../../hooks/useInputSelection';
import {Button} from './Button';

export function SubscribeForm({dataTestId, placeholder, value, buttonSize, buttonText, buttonStyle, onChange, onFocus, onBlur, disabled}) {
    const {setRef, saveSelectionRange} = useInputSelection({value});

    const onChangeWrapper = (e) => {
        // Fixes cursor jumping to the end of the input when typing
        saveSelectionRange(e);

        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className={clsx(
            'relative flex rounded border border-grey-500/30 bg-white',
            buttonSize === 'large' ? 'p-[3px]' : 'p-[2px]',
        )}>
            <input
                ref={setRef}
                className={clsx(
                    'relative w-full bg-white py-2 px-4 font-sans font-normal text-grey-900 focus-visible:outline-none',
                    buttonSize === 'small' && 'h-10 text-md leading-[4rem]',
                    buttonSize === 'medium' && 'h-11 text-[1.6rem] leading-[4.4rem]',
                    buttonSize === 'large' && 'h-12 text-lg leading-[4.8rem]',
                )}
                placeholder={placeholder}
                tabIndex={disabled ? '-1' : ''}
                value={value}
                readOnly
                onBlur={onBlur}
                onChange={onChangeWrapper}
                onFocus={onFocus}
            />
            <Button dataTestId={dataTestId} disabled={disabled} placeholder='' size={buttonSize} style={buttonStyle} value={buttonText}/>
        </div>
    );
}
