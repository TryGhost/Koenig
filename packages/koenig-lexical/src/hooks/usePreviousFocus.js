import {useState} from 'react';

export const usePreviousFocus = (onClick, name) => {
    const [previousRange, setPreviousRange] = useState(null);

    const handleMousedown = () => {
        const selection = document.getSelection();
        setPreviousRange(selection.rangeCount === 0 ? null : selection.getRangeAt(0));
    };

    const handleClick = (e) => {
        e.preventDefault();
        onClick(name);

        if (previousRange) {
            const selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(previousRange);
            setPreviousRange(null);
        }
    };

    return {handleMousedown, handleClick};
};
