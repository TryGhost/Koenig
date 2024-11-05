import CloseIcon from '../../assets/icons/kg-close.svg?react';
import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';

export function LinkInput({href, update, cancel}) {
    const [_href, setHref] = React.useState(href);

    // add refs for input and container
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    // update the href when the prop changes
    React.useEffect(() => {
        setHref(href);
    }, [href]);

    // when link is open, focus the input
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    // when link is open, watch the window for mousedown events so that we can
    // close it when we detect a click outside
    const closeOnClickOutside = React.useCallback((event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            cancel();
        }
    }, [cancel]);

    React.useEffect(() => {
        window.addEventListener('mousedown', closeOnClickOutside);
        return () => {
            window.removeEventListener('mousedown', closeOnClickOutside);
        };
    }, [closeOnClickOutside]);

    // when link is open, watch the window for escape keydown events so that we can exit
    const onEscape = React.useCallback((event) => {
        if (event.key === 'Escape') {
            cancel();
        }
    }, [cancel]);

    React.useEffect(() => {
        window.addEventListener('keydown', onEscape);
        return () => {
            window.removeEventListener('keydown', onEscape);
        };
    }, [onEscape]);

    return (
        <div ref={containerRef} className="relative m-0 flex items-center justify-evenly gap-1 rounded-lg bg-white p-1 font-sans text-md font-normal text-black shadow-md dark:bg-grey-950">
            <input
                ref={inputRef}
                className="mb-[1px] h-8 w-full pl-3 pr-9 leading-loose text-grey-900 selection:bg-grey/40 dark:bg-grey-950 dark:text-grey-300 dark:selection:bg-grey-800/40 dark:selection:text-grey-100"
                data-testid="link-input"
                placeholder="Enter url"
                value={_href}
                onInput={(e) => {
                    setHref(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        // prevent Enter from triggering in the editor and removing text
                        e.preventDefault();
                        update(_href);
                        return;
                    }
                }}
            />

            {
                !!_href && (
                    <button aria-label="Close" className="absolute right-3 cursor-pointer" type="button" onClick={(e) => {
                        e.stopPropagation();
                        setHref('');
                        inputRef.current.focus();
                    }}>
                        <CloseIcon className="size-4 stroke-2 text-grey" />
                    </button>
                )
            }
        </div>
    );
}

LinkInput.propTypes = {
    href: PropTypes.string
};
