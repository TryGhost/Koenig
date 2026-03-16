import debounce from 'lodash/debounce';
import {useRef, useState} from 'react';

const API_URL = 'https://tenor.googleapis.com';
const API_VERSION = 'v2';
const DEBOUNCE_MS = 600;

export const ERROR_TYPE = {
    COMMON: 'common',
    INVALID_API_KEY: 'invalid_key'
};

interface TenorGif {
    media_formats: {tinygif: {dims: [number, number]}};
    ratio: number;
    columnIndex: number;
    columnRowIndex: number;
    index: number;
    [key: string]: unknown;
}

interface TenorConfig {
    googleApiKey: string;
    contentFilter?: string;
}

interface MakeRequestOptions {
    params: Record<string, string>;
    ignoreErrors?: boolean;
}

export function useTenor({config}: {config: TenorConfig}) {
    const [columns, setColumns] = useState<TenorGif[][]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [isLazyLoading, setLazyLoading] = useState(false);
    const [gifs, setGifs] = useState<TenorGif[]>([]);

    // useRef const for internal calculations
    const nextPos = useRef<string | null>(null);
    const loadedType = useRef('');
    const columnHeights = useRef<number[]>([]);
    const searchTerm = useRef('');
    const columnCount = useRef(4);
    // There are a lot of calculations for columns/gifs, and there is no need to update the state every time.
    // Use this const for computations; once everything is ready, update columns/gifs state for external usage.
    const internalStateColumns = useRef<TenorGif[][]>([]);
    const internalStateGifs = useRef<TenorGif[]>([]);

    function search(term: string) {
        searchTerm.current = term;
        reset();

        if (term) {
            return searchTask(term);
        } else {
            return loadTrendingGifs();
        }
    }

    const updateSearch = debounce((term = '') => search(term), DEBOUNCE_MS);

    async function searchTask(term: string) {
        loadedType.current = 'search';

        await makeRequest(loadedType.current, {params: {
            q: term,
            media_filter: 'minimal'
        }});
    }

    async function loadTrendingGifs() {
        loadedType.current = 'featured';

        await makeRequest(loadedType.current, {params: {
            q: 'excited',
            media_filter: 'minimal'
        }});
    }

    function reset() {
        internalStateGifs.current = [];
        nextPos.current = null;
        resetColumns();
    }

    function resetColumns() {
        const newColumns: TenorGif[][] = [];
        const newColumnHeights: number[] = [];

        // pre-fill column arrays based on columnCount
        for (let i = 0; i < columnCount.current; i += 1) {
            newColumns[i] = [];
            newColumnHeights[i] = 0;
        }

        internalStateColumns.current = newColumns;
        columnHeights.current = newColumnHeights;

        if (internalStateGifs.current.length) {
            adjustToNewColumnCount();
        }
    }

    function adjustToNewColumnCount() {
        internalStateGifs.current.forEach((gif) => {
            addGifToColumns(gif);
        });
    }

    function addGifToColumns(gif: TenorGif) {
        const min = Math.min(...columnHeights.current);
        const columnIndex = columnHeights.current.indexOf(min);

        // use a fixed width when calculating height to compensate for different overall sizes
        columnHeights.current[columnIndex] += 300 * gif.ratio;
        internalStateColumns.current[columnIndex].push(gif);

        // store the column indexes on the gif for use in keyboard nav
        gif.columnIndex = columnIndex;
        gif.columnRowIndex = internalStateColumns.current[columnIndex].length - 1;
    }

    function addGif(gif: TenorGif, gifIndex: number) {
        // re-calculate ratio for later use
        const [width, height] = gif.media_formats.tinygif.dims;
        gif.ratio = height / width;

        // add to general gifs list
        internalStateGifs.current.push(gif);

        // store index for use in templates and keyboard nav
        gif.index = gifIndex;

        // add to least populated column
        addGifToColumns(gif);
    }

    async function makeRequest(path: string, options: MakeRequestOptions) {
        const versionedPath = `${API_VERSION}/${path}`.replace(/\/+/, '/');
        const url = new URL(versionedPath, API_URL);

        const params = new URLSearchParams(options.params);
        params.set('key', config.googleApiKey);
        params.set('client_key', 'ghost-editor');
        params.set('contentfilter', getContentFilter());

        url.search = params.toString();

        setError(null);
        setLoading(true);

        return fetch(url)
            .then(response => checkStatus(response))
            .then(response => response.json())
            .then(response => extractPagination(response))
            .then(response => addGifsFromResponse(response))
            .then(() => {
                setColumns(internalStateColumns.current);
                setGifs(internalStateGifs.current);
            })
            .catch((e) => {
                // if the error text isn't already set then we've get a connection error from `fetch`
                if (!options.ignoreErrors && !error) {
                    setError(ERROR_TYPE.COMMON);
                }

                if (error && error.startsWith('API key not valid')) {
                    setError(ERROR_TYPE.INVALID_API_KEY);
                }
                console.error(e);
            })
            .finally(() => {
                setLoading(false);
                setLazyLoading(false);
            });
    }

    async function checkStatus(response: Response): Promise<Response> {
        // successful request
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        let responseText: string | undefined;

        const contentType = response.headers.get('content-type');
        if (contentType?.startsWith('application/json')) {
            responseText = await response.json().then((json: {error: {message?: string} | string}) => {
                const err = json.error;
                return typeof err === 'string' ? err : err.message || String(err);
            });
        } else if (contentType === 'text/xml') {
            responseText = await response.text();
        }

        setError(responseText || null);

        const responseError = new Error(responseText) as Error & {response: Response};
        responseError.response = response;
        throw responseError;
    }

    async function extractPagination(response: {next?: string; results: TenorGif[]}) {
        nextPos.current = response.next || null;
        return response;
    }

    async function addGifsFromResponse(response: {results: TenorGif[]}) {
        const newGifs = response.results;
        newGifs.forEach((gif, index) => addGif(gif, index));

        return response;
    }

    function loadNextPage() {
        // protect against scroll trigger firing when the gifs are reset
        if (isLoading) {
            return;
        }

        if (!internalStateGifs.current.length) {
            return loadTrendingGifs();
        }

        if (nextPos.current !== null) {
            const params: Record<string, string> = {
                pos: nextPos.current,
                media_filter: 'minimal'
            };

            if (loadedType.current === 'search') {
                params.q = searchTerm.current;
            }

            setLazyLoading(true);

            return makeRequest(loadedType.current, {params});
        }
    }

    function getContentFilter() {
        return config.contentFilter || 'off';
    }

    function changeColumnCount(count: number) {
        columnCount.current = count;
        resetColumns();
        setColumns(internalStateColumns.current);
    }

    return {
        updateSearch,
        isLoading,
        isLazyLoading,
        error,
        loadNextPage,
        columns,
        changeColumnCount,
        gifs
    };
}
