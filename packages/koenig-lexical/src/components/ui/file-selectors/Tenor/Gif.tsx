import {useEffect, useRef} from 'react';

export interface GifData {
    id: string;
    index: number;
    media_formats: {
        tinygif: {
            url: string;
            dims: number[];
            content_description?: string;
        };
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

interface GifProps {
    gif: GifData;
    onClick: (gif: GifData) => void;
    highlightedGif?: {id?: string};
}

export function Gif({gif, onClick, highlightedGif = {}}: GifProps) {
    const gifRef = useRef<HTMLButtonElement>(null);
    const media = gif.media_formats.tinygif;

    useEffect(() => {
        const isFocused = highlightedGif.id === gif.id;
        if (isFocused) {
            gifRef.current?.focus();
        } else {
            gifRef.current?.blur();
        }
    }, [gif.id, highlightedGif.id]);

    const handleClick = () => {
        onClick(gif);
    };

    return (
        <button
            ref={gifRef}
            className="cursor-pointer border-2 border-transparent focus:border-green-600"
            data-tenor-index={gif.index}
            type="button"
            onClick={handleClick}
        >
            <img alt={media.content_description} height={media.dims[1]} src={media.url} width={media.dims[0]} />
        </button>
    );
}
