import React, {useEffect, useRef, useState} from 'react';
import SearchIcon from '../../assets/icons/kg-search.svg?react';
import {Error} from './file-selectors/Tenor/Error';
import {Gif, type GifData} from './file-selectors/Tenor/Gif';
import {Loader} from './file-selectors/Tenor/Loader';

// number of columns based on selector container width
const TWO_COLUMN_WIDTH = 540;
const THREE_COLUMN_WIDTH = 940;

interface TenorGif extends GifData {
    columnIndex: number;
    columnRowIndex: number;
    media_formats: {gif: {url: string; dims: number[]}; tinygif: {url: string; dims: number[]; content_description?: string}; [key: string]: unknown};
}

export interface TenorSelectorProps {
    onGifInsert: (data: {src: string; width: number; height: number}) => void;
    onClickOutside: () => void;
    updateSearch: (term?: string) => void;
    columns: TenorGif[][];
    isLoading?: boolean;
    isLazyLoading?: boolean;
    error?: unknown;
    changeColumnCount: (count: number) => void;
    loadNextPage: () => void;
    gifs: TenorGif[];
}

const TenorSelector = ({onGifInsert, onClickOutside, updateSearch, columns, isLoading, isLazyLoading, error, changeColumnCount, loadNextPage, gifs}: TenorSelectorProps) => {
    const selectorRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [highlightedGif, setHighlightedGif] = useState<TenorGif | undefined>(undefined);

    useEffect(() => {
        updateSearch();

        // We only do this for init
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!selectorRef.current) {
            return;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            const [containerEntry] = entries;
            const contentBoxSize = Array.isArray(containerEntry.contentBoxSize) ? containerEntry.contentBoxSize[0] : containerEntry.contentBoxSize;

            const width = contentBoxSize.inlineSize;

            let columnsCount = 4;

            if (width <= TWO_COLUMN_WIDTH) {
                columnsCount = 2;
            } else if (width <= THREE_COLUMN_WIDTH) {
                columnsCount = 3;
            }

            changeColumnCount(columnsCount);
        });
        resizeObserver.observe(selectorRef.current);

        return () => {
            resizeObserver?.disconnect();
        };

        // We only do this for init
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        document.addEventListener('keydown', handleGifHighlight);

        return () => {
            document.removeEventListener('keydown', handleGifHighlight);
        };
    }, [handleGifHighlight]);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
                onClickOutside();
            }
        };
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClickOutside]);

    function handleGifSelect(selectedGif: TenorGif) {
        const gif = selectedGif.media_formats.gif;
        const data = {
            src: gif.url,
            width: gif.dims[0],
            height: gif.dims[1]
        };
        onGifInsert(data);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSearch(e.target.value);
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.target as HTMLDivElement;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1000) {
            loadNextPage();
        }
    };

    function focusSearch() {
        searchRef.current?.focus();
    }

    function highlightFirst() {
        setHighlightedGif(gifs[0]);
    }

    function highlightNext() {
        if (highlightedGif === gifs[gifs.length - 1]) {
            // reached the end, do nothing
            return;
        }

        setHighlightedGif(gifs[highlightedGif!.index + 1]);
    }

    function highlightPrev() {
        if (highlightedGif!.index === 0) {
            // reached the beginning, focus the search bar
            focusSearch();
        }

        setHighlightedGif(gifs[highlightedGif!.index - 1]);
    }

    function moveHighlightDown() {
        const nextGif = columns[highlightedGif!.columnIndex][highlightedGif!.columnRowIndex + 1];

        if (nextGif) {
            setHighlightedGif(nextGif);
        }
    }

    function moveHighlightUp() {
        const nextGif = columns[highlightedGif!.columnIndex][highlightedGif!.columnRowIndex - 1];

        if (nextGif) {
            setHighlightedGif(nextGif);
        } else {
            // already at top, focus the search bar
            focusSearch();
        }
    }

    function moveToNextHorizontalGif(direction: 'left' | 'right') {
        const highlightedElem = document.querySelector(`[data-tenor-index="${highlightedGif!.index}"]`);
        if (!highlightedElem) {
            return;
        }
        const highlightedElemRect = highlightedElem.getBoundingClientRect();

        let x;
        if (direction === 'left') {
            x = highlightedElemRect.left - (highlightedElemRect.width / 2);
        } else {
            x = highlightedElemRect.right + (highlightedElemRect.width / 2);
        }

        let y = highlightedElemRect.top + (highlightedElemRect.height / 3);

        let foundGifElem;
        let jumps = 0;

        // we might hit spacing between gifs, keep moving up 5 px until we get a match
        while (!foundGifElem) {
            const possibleMatch = document.elementFromPoint(x, y)?.closest('[data-tenor-index]') as HTMLElement | null;

            if (possibleMatch?.dataset?.tenorIndex !== undefined) {
                foundGifElem = possibleMatch;
                break;
            }

            jumps += 1;
            y -= 5;

            if (jumps > 10) {
                // give up to avoid infinite loop
                break;
            }
        }

        if (foundGifElem) {
            setHighlightedGif(gifs[Number(foundGifElem.dataset.tenorIndex)]);
        }
    }

    function moveHighlightRight() {
        if (highlightedGif!.columnIndex === columns.length - 1) {
            // we don't wrap and we're on the last column, do nothing
            return;
        }

        moveToNextHorizontalGif('right');
    }

    function moveHighlightLeft() {
        if (highlightedGif!.index === 0) {
            // on the first Gif, focus the search bar
            return focusSearch();
        }

        if (highlightedGif!.columnIndex === 0) {
            // we don't wrap and we're on the first column, do nothing
            return;
        }

        moveToNextHorizontalGif('left');
    }

    function handleGifHighlight(event: KeyboardEvent) {
        switch (event.key) {
        case 'Tab':
            return handleTab(event);
        case 'ArrowLeft':
            return handleLeft(event);
        case 'ArrowRight':
            return handleRight(event);
        case 'ArrowUp':
            return handleUp(event);
        case 'ArrowDown':
            return handleDown(event);
        case 'Enter':
            return handleEnter(event);
        default:
            return null;
        }
    }

    function handleTab(event: KeyboardEvent) {
        // event.stopPropagation();
        // event.preventDefault();

        const target = event.target as HTMLElement | null;

        if (event.shiftKey) {
            if (highlightedGif) {
                event.preventDefault();
                return highlightPrev();
            }
        } else {
            if (target?.tagName === 'INPUT') {
                event.preventDefault();
                (target as HTMLInputElement).blur();
                return highlightFirst();
            }

            if (highlightedGif) {
                event?.preventDefault();
                return highlightNext();
            }
        }
    }

    function handleLeft(event: KeyboardEvent) {
        if (highlightedGif) {
            event.preventDefault();
            moveHighlightLeft();
        }
    }

    function handleRight(event: KeyboardEvent) {
        if (highlightedGif) {
            event.preventDefault();
            moveHighlightRight();
        }
    }

    function handleUp(event: KeyboardEvent) {
        if (highlightedGif) {
            event.preventDefault();
            moveHighlightUp();
        }
    }

    function handleDown(event: KeyboardEvent) {
        const target = event.target as HTMLElement | null;
        if (target?.tagName === 'INPUT') {
            event.preventDefault();
            (target as HTMLInputElement).blur();
            return highlightFirst();
        }

        if (highlightedGif) {
            event.preventDefault();
            moveHighlightDown();
        }
    }

    function handleEnter(event: KeyboardEvent) {
        event.preventDefault();

        const target = event.target as HTMLElement | null;
        if (target?.tagName === 'INPUT') {
            (target as HTMLInputElement).blur();
            return highlightFirst();
        }

        if (highlightedGif) {
            return handleGifSelect(highlightedGif);
        }
    }

    const isSearchInProgress = isLoading && !isLazyLoading;

    return (
        <div
            ref={selectorRef}
            className="flex h-[540px] flex-col rounded border border-grey-200 bg-grey-50 dark:border-none dark:bg-grey-900"
            data-testid="tenor-selector"
            // prevent click handle in the editor while selector is active
            onClick={e => e.stopPropagation()}
        >
            <header className="p-6">
                <div className="relative w-full">
                    <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-2 text-grey-500 dark:text-grey-800" />
                    <input
                        ref={searchRef}
                        className="h-10 w-full rounded-full border border-grey-300 pl-10 pr-8 font-sans text-md font-normal text-black focus:border-green focus:shadow-insetgreen dark:border-grey-800 dark:bg-grey-950 dark:text-white dark:placeholder:text-grey-800 dark:focus:border-green"
                        placeholder="Search Tenor for GIFs"
                        autoFocus
                        onChange={handleSearch}
                    />
                </div>
            </header>

            <div className="relative h-full overflow-hidden">
                <div className="h-full overflow-auto px-6" onScroll={handleScroll}>
                    {
                        !error && !isSearchInProgress && (
                            <div className="flex gap-4">
                                {columns.map((column, i) => (
                                    <section key={i} className="flex grow basis-0 flex-col justify-start gap-4">
                                        {column.map(gif => (
                                            <Gif key={gif.id} gif={gif} highlightedGif={highlightedGif} onClick={handleGifSelect as (gif: GifData) => void} />
                                        ))}
                                    </section>
                                ))}
                            </div>
                        )
                    }

                    {!!isLoading && !error && <Loader isLazyLoading={isLazyLoading} />}

                    {!!error && <div data-testid="tenor-selector-error"><Error error={error as string} /></div>}
                </div>
            </div>
        </div>
    );
};

export default TenorSelector;
