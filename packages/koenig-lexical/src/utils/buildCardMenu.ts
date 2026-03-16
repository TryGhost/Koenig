import type React from 'react';
import SnippetCardIcon from '../assets/icons/kg-card-type-snippet.svg?react';
import {INSERT_SNIPPET_COMMAND} from '../plugins/KoenigSnippetPlugin';

export interface CardMenuItem {
    nodeType?: string;
    type?: string;
    label: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    desc?: string;
    shortcut?: string;
    section?: string;
    matches?: ((query: string, label?: string) => boolean) | string[];
    isHidden?: (context: {config: unknown}) => boolean;
    postType?: string;
    insertParams?: unknown;
    insertCommand?: unknown;
    queryParams?: unknown;
    priority?: number;
    onRemove?: () => void;
    [key: string]: unknown;
}

interface CardMenuConfig {
    post?: {displayName?: string};
    snippets?: Array<{name: string; [key: string]: unknown}>;
    deleteSnippet?: (data: unknown) => void;
    [key: string]: unknown;
}

export function buildCardMenu(nodes: Array<[string, unknown]>, {query, config}: {query?: string; config?: CardMenuConfig} = {}) {
    let menu = new Map<string, CardMenuItem[]>();

    query = query?.toLowerCase();

    let maxItemIndex = -1;

    function addMenuItem(item: CardMenuItem) {
        // items hidden based on missing config (e.g. Tenor API key for gif card)
        if (!!item.isHidden && item.isHidden?.({config})) {
            return;
        }

        // items restricted for posts vs. pages (e.g. email CTA card)
        if (item.postType && config?.post?.displayName && item.postType !== config?.post?.displayName) {
            return;
        }

        const matches = typeof item?.matches === 'function'
            ? item?.matches?.(query!, item.label)
            : (item?.matches as string[] | undefined)?.find?.((m: string) => m.startsWith(query!));

        if (query && !matches) {
            return;
        }

        if (typeof item.insertParams === 'function') {
            item.insertParams = (item.insertParams as (ctx: {config: unknown}) => unknown)({config});
        }

        const section = item.section || 'Primary';

        if (!menu.has(section)) {
            menu.set(section, [item]);
        } else {
            menu.get(section)!.push(item);
        }

        maxItemIndex = maxItemIndex + 1;
    }

    for (const [nodeType, node] of nodes) {
        const nodeWithMenu = node as {kgMenu: CardMenuItem | CardMenuItem[]};
        if (Array.isArray(nodeWithMenu.kgMenu)) {
            nodeWithMenu.kgMenu.forEach((item: CardMenuItem) => addMenuItem({nodeType, ...item}));
        } else {
            addMenuItem({nodeType, ...nodeWithMenu.kgMenu});
        }
    }

    config?.snippets?.forEach((item) => {
        const snippetMenuItem = buildSnippetMenuItem(item, config);
        addMenuItem(snippetMenuItem);
    });

    // sort each menu section by priority
    menu = new Map([...menu.entries()].map(([section, items]) => {
        return [section, items.sort((a: CardMenuItem, b: CardMenuItem) => {
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
    menu = new Map([...menu.entries()].sort((a, _b) => {
        if (a[0] === 'Primary') {
            return -1;
        } else {
            return 1;
        }
    }));

    return {menu, maxItemIndex};
}

function buildSnippetMenuItem(data: {name: string; [key: string]: unknown}, config: CardMenuConfig): CardMenuItem {
    const name = data.name.toLowerCase();
    const snippet: CardMenuItem = {
        type: 'snippet',
        label: data.name,
        Icon: SnippetCardIcon,
        section: 'Snippets',
        matches: (query: string) => name.indexOf(query) > -1 || 'snippets'.indexOf(query) > -1,
        insertCommand: INSERT_SNIPPET_COMMAND,
        insertParams: data,
        ...(config.deleteSnippet && {onRemove: () => config.deleteSnippet!(data)})
    };

    return snippet;
}
