import React from 'react';
import debounce from 'lodash/debounce';

const DEBOUNCE_MS = 200;
const URL_QUERY_REGEX = /^http/;

function convertSearchResultsToListOptions(results) {
    return results.map((result) => {
        const items = result.items.map((item) => {
            return {
                label: item.title,
                value: item.url
            };
        });

        return {...result, items};
    });
}

function urlQueryOptions(query) {
    return [{
        label: 'Link to web page',
        items: [{
            label: query,
            value: query
        }]
    }];
}

export const useSearchLinks = (query, searchLinks) => {
    const [defaultListOptions, setDefaultListOptions] = React.useState([]);
    const [listOptions, setListOptions] = React.useState([]);
    const [isSearching, setIsSearching] = React.useState(false);

    const search = React.useMemo(() => {
        return async function _search(term) {
            if (URL_QUERY_REGEX.test(term)) {
                setListOptions(urlQueryOptions(term));
                return;
            }

            setIsSearching(true);
            const results = await searchLinks(term);
            setListOptions(convertSearchResultsToListOptions(results));
            setIsSearching(false);
        };
    }, [searchLinks]);

    const debouncedSearch = React.useMemo(() => {
        console.log({search});
        return debounce(search, DEBOUNCE_MS);
    }, [search]);

    // Fetch default search results when first rendering
    React.useEffect(() => {
        if (URL_QUERY_REGEX.test(query)) {
            return;
        }

        const fetchDefaultOptions = async () => {
            setIsSearching(true);
            const results = await searchLinks();
            setDefaultListOptions(convertSearchResultsToListOptions(results));
            setIsSearching(false);
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
