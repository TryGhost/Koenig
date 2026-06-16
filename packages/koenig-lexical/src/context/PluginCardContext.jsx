import React from 'react';

const PluginCardContext = React.createContext({pluginCards: []});

let _pluginCardsCache = [];
let _pluginCardsLoaded = false;
let _pluginCardsPromise = null;

function fetchPluginCards() {
    if (!_pluginCardsPromise) {
        _pluginCardsPromise = fetch('/ghost/api/admin/plugins/cards/', {credentials: 'include'})
            .then(r => r.json())
            .then(data => {
                _pluginCardsCache = data.plugins?.flat() || [];
                _pluginCardsLoaded = true;
                return _pluginCardsCache;
            })
            .catch(() => {
                _pluginCardsLoaded = true;
                _pluginCardsPromise = null;
                return [];
            });
    }
    return _pluginCardsPromise.then(() => _pluginCardsCache);
}

export function PluginCardProvider({children}) {
    const [pluginCards, setPluginCards] = React.useState(_pluginCardsCache);

    React.useEffect(() => {
        fetchPluginCards().then(setPluginCards);
    }, []);

    return (
        <PluginCardContext.Provider value={{pluginCards}}>
            {children}
        </PluginCardContext.Provider>
    );
}

export function usePluginCards() {
    return React.useContext(PluginCardContext);
}

// Also expose synchronously-cached cards (for menu builds before fetch completes)
export function getCachedPluginCards() {
    return _pluginCardsCache;
}
