import SnippetCardIcon from '../assets/icons/kg-card-type-snippet.svg?react';
import React from 'react';
import DOMPurify from 'dompurify';
import {INSERT_SNIPPET_COMMAND} from '../plugins/KoenigSnippetPlugin';
import {INSERT_PLUGIN_CARD_COMMAND} from '../commands/pluginCardCommands';

const DEFAULT_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>';

export function buildCardMenu(nodes, {query, config, pluginCards: contextCards} = {}) {
    let menu = new Map();

    query = query?.toLowerCase();

    let maxItemIndex = -1;

    function addMenuItem(item) {
        // items hidden based on missing config (e.g. GIF provider API key)
        if (!!item.isHidden && item.isHidden?.({config})) {
            return;
        }

        // items restricted for posts vs. pages (e.g. email CTA card)
        if (item.postType && config?.post?.displayName && item.postType !== config?.post?.displayName) {
            return;
        }

        const matches = typeof item?.matches === 'function'
            ? item?.matches?.(query, item.label)
            : item?.matches?.find?.(m => m.startsWith(query));

        if (query && !matches) {
            return;
        }

        if (typeof item.insertParams === 'function') {
            item.insertParams = item.insertParams({config});
        }

        const section = item.section || 'Primary';

        if (!menu.has(section)) {
            menu.set(section, [item]);
        } else {
            menu.get(section).push(item);
        }

        maxItemIndex = maxItemIndex + 1;
    }

    for (const [nodeType, node] of nodes) {
        if (Array.isArray(node.kgMenu)) {
            node.kgMenu.forEach(item => addMenuItem({nodeType, ...item}));
        } else {
            addMenuItem({nodeType, ...node.kgMenu});
        }
    }

    config?.snippets?.forEach((item) => {
        const snippetMenuItem = buildSnippetMenuItem(item, config);
        addMenuItem(snippetMenuItem);
    });

    // Add plugin cards from config (host app) or context (self-fetched)
    const cards = config?.pluginCards || contextCards || [];
    if (cards.length) {
        cards.forEach((pluginCard) => {
            const pluginCardMenuItem = buildPluginCardMenuItem(pluginCard);
            addMenuItem(pluginCardMenuItem);
        });
    }

    // sort each menu section by priority
    menu = new Map([...menu.entries()].map(([section, items]) => {
        return [section, items.sort((a, b) => {
            if (a.priority === b.priority) {
                return 0;
            } else if (a.priority === undefined) {
                return 1;
            } else if (b.priority === undefined) {
                return -1;
            } else {
                return a.priority - b.priority;
            }
        })];
    }));

    // sort primary section to always display first
    menu = new Map([...menu.entries()].sort((a, b) => {
        if (a[0] === 'Primary') {
            return -1;
        } else {
            return 1;
        }
    }));

    return {menu, maxItemIndex};
}

function buildSnippetMenuItem(data, config) {
    const name = data.name.toLowerCase();
    const snippet = {
        type: 'snippet',
        label: data.name,
        Icon: SnippetCardIcon,
        section: 'Snippets',
        matches: query => name.indexOf(query) > -1 || 'snippets'.indexOf(query) > -1,
        insertCommand: INSERT_SNIPPET_COMMAND,
        insertParams: data,
        ...(config.deleteSnippet && {onRemove: () => config.deleteSnippet(data)})
    };

    return snippet;
}

function buildPluginCardMenuItem(pluginCard) {
    if (!pluginCard || typeof pluginCard.label !== 'string' || typeof pluginCard.name !== 'string') {
        return null;
    }
    const label = pluginCard.label.toLowerCase();
    const cardName = pluginCard.name;

    // Simple Icon component that renders the SVG (sanitized)
    function PluginCardIcon({className, ...rest}) {
        const rawIcon = pluginCard.icon || DEFAULT_ICON;
        const cleanIcon = DOMPurify.sanitize(rawIcon, {
            ALLOWED_TAGS: ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'clipPath', 'mask', 'use'],
            ALLOWED_ATTR: ['d', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'xmlns', 'width', 'height', 'transform', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'clip-path', 'id', 'href', 'opacity', 'style']
        }) || DEFAULT_ICON;

        return React.createElement('span', {
            className: className,
            style: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center'},
            ...rest,
            dangerouslySetInnerHTML: {__html: cleanIcon}
        });
    }

    return {
        type: 'card',
        label: pluginCard.label,
        Icon: PluginCardIcon,
        section: 'Plugins',
        matches: query => label.indexOf(query) > -1 || cardName.indexOf(query) > -1 || 'plugin'.indexOf(query) > -1,
        insertCommand: INSERT_PLUGIN_CARD_COMMAND,
        insertParams: {
            pluginName: pluginCard.plugin,
            cardName: pluginCard.name,
            payload: JSON.stringify(
                pluginCard.fields.reduce((acc, field) => {
                    acc[field.key] = field.default;
                    return acc;
                }, {})
            )
        }
    };
}
