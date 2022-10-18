import React, {useEffect} from 'react';

function CaptionEditor({
    payload,
    placeholder, 
    toggleAltText, 
    selected,
    handleCapInput
}) {
    const {altText, setAltText} = toggleAltText;

    const tgAltText = (e) => {
        e.stopPropagation();
        setAltText(!altText);
    };

    useEffect(() => {
        if (!selected) {
            setAltText(false);
        }
    }, [selected, setAltText]);

    if (selected || payload?.__caption) {
        return (
            <>
                <input
                    onChange={handleCapInput}
                    className="not-kg-prose w-full px-9 text-center font-sans text-sm font-normal leading-8 tracking-wide text-grey-900"
                    placeholder={placeholder}
                    value={altText ? payload?.__altText : payload?.__caption}
                />
                <button
                    name="alt-toggle-button"
                    className={`absolute bottom-0 right-0 m-2 cursor-pointer rounded border px-1 font-sans text-[1.3rem] font-normal leading-7 tracking-wide transition-all duration-100 ${altText ? 'border-green bg-green text-white' : 'border-grey text-grey' } `}
                    onClick={e => tgAltText(e)}>
                                Alt
                </button>
            </>
        );
    }
}

export default CaptionEditor;
