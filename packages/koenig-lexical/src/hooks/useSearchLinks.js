import EarthIcon from '../assets/icons/kg-earth.svg?react';
import React from 'react';
import debounce from 'lodash/debounce';

const DEBOUNCE_MS = 100;
const URL_QUERY_REGEX = /^http/;

function urlQueryOptions(query) {
    return [{
        label: 'Link to web page',
        items: [{
            label: query,
            value: query,
            Icon: EarthIcon,
            highlight: false
        }]
    }];
}

function noResultOptions(query) {
    return [{
        label: 'Link to web page',
        items: [{
            label: `Enter URL to create link`,
            value: null,
            Icon: EarthIcon,
            highlight: false
        }]
    }];
}

function convertSearchResultsToListOptions(results, {showNoResults = true} = {}) {
    if (!results || !results.length) {
        return showNoResults ? noResultOptions() : [];
    }

    return results.map((result) => {
        const items = result.items.map((item) => {
            return {
                label: item.title,
                value: item.url,
                Icon: item.Icon,
                metaText: item.metaText,
                MetaIcon: item.MetaIcon
            };
        });

        return {...result, items};
    });
}

export const useSearchLinks = (query, searchLinks, options = {}) => {
    const _options = React.useMemo(() => ({showNoResults: true, showUrlResult: true, ...options}), [options]);

    const [defaultListOptions, setDefaultListOptions] = React.useState([]);
    const [listOptions, setListOptions] = React.useState([]);
    const [isSearching, setIsSearching] = React.useState(false);

    const search = React.useMemo(() => {
        return async function _search(term) {
            if (URL_QUERY_REGEX.test(term)) {
                _options.showUrlResult ? setListOptions(urlQueryOptions(term)) : setListOptions([]);
                return;
            }

            setIsSearching(true);
            const results = await searchLinks(term);
            setListOptions(convertSearchResultsToListOptions(results, _options));
            setIsSearching(false);
        };
    }, [searchLinks, _options]);

    const debouncedSearch = React.useMemo(() => {
        return debounce(search, DEBOUNCE_MS);
    }, [search]);

    // Fetch default search results when first rendering
    React.useEffect(() => {
        const fetchDefaultOptions = async () => {
            // if we have a query we don't want to show the searching state but
            // we still want to load the default options in the background so
            // they're available when the query is cleared
            !query && setIsSearching(true);
            const results = await searchLinks(null);
            setDefaultListOptions(convertSearchResultsToListOptions(results, _options));
            !query && setIsSearching(false);
        };

        fetchDefaultOptions().catch(console.error); // eslint-disable-line no-console
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        // perform a non-debounced search if the query is a URL so the
        // "Link to web page" option updates more responsively
        if (URL_QUERY_REGEX.test(query)) {
            search(query);
        } else {
            debouncedSearch(query);
        }
    }, [query, search, debouncedSearch]);

    const displayedListOptions = query ? listOptions : defaultListOptions;

    return {
        isSearching,
        listOptions: displayedListOptions
    };
};
