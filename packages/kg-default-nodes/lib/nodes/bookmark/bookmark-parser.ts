import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createBookmarkNode, BookmarkNodeDataset} from './BookmarkNode';

export function parseBookmarkNode(): DOMConversionMap | null {
    return {
        figure: (nodeElem: HTMLElement): DOMConversion | null => {
            const isKgBookmarkCard = nodeElem.classList?.contains('kg-bookmark-card');
            if (nodeElem.tagName === 'FIGURE' && isKgBookmarkCard) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput {
                        const url = domNode?.querySelector('.kg-bookmark-container')?.getAttribute('href');
                        const iconNode = domNode?.querySelector('.kg-bookmark-icon') as HTMLImageElement | null;
                        const icon = iconNode?.src;
                        const title = domNode?.querySelector('.kg-bookmark-title')?.textContent;
                        const description = domNode?.querySelector('.kg-bookmark-description')?.textContent;
                        const author = domNode?.querySelector('.kg-bookmark-publisher')?.textContent; // NOTE: This is NOT in error. The classes are reversed for theme backwards-compatibility.
                        const publisher = domNode?.querySelector('.kg-bookmark-author')?.textContent; // NOTE: This is NOT in error. The classes are reversed for theme backwards-compatibility.
                        const thumbnailNode = domNode?.querySelector('.kg-bookmark-thumbnail img') as HTMLImageElement | null;
                        const thumbnail = thumbnailNode?.src;
                        const caption = domNode?.querySelector('figure.kg-bookmark-card figcaption')?.textContent;
                        const payload = {
                            url,
                            metadata: {
                                icon,
                                title,
                                description,
                                author,
                                publisher,
                                thumbnail
                            },
                            caption
                        } as BookmarkNodeDataset;
                        const node = $createBookmarkNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        },
        div: (nodeElem: HTMLElement): DOMConversion | null => {
            if (nodeElem.nodeType === 1 && nodeElem.tagName === 'DIV' && nodeElem.className.match(/graf--mixtapeEmbed/)) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput {
                        // Grab the relevant elements - Anchor wraps most of the data
                        const anchorElement = domNode.querySelector('.markup--mixtapeEmbed-anchor') as HTMLAnchorElement;
                        const titleElement = anchorElement.querySelector('.markup--mixtapeEmbed-strong');
                        const descElement = anchorElement.querySelector('.markup--mixtapeEmbed-em');
                        // Image is a top level field inside it's own a tag
                        const imgElement = domNode.querySelector('.mixtapeImage') as HTMLAnchorElement;

                        domNode.querySelector('br')?.remove();

                        // Grab individual values from the elements
                        const url = anchorElement.getAttribute('href');
                        let title;
                        let description;
                        let thumbnail;

                        if (titleElement && titleElement.innerHTML) {
                            title = titleElement.innerHTML.trim();
                            // Cleanup anchor so we can see what's left now that we've processed title
                            anchorElement.removeChild(titleElement);
                        }

                        if (descElement && descElement.innerHTML) {
                            description = descElement.innerHTML.trim();
                            // Cleanup anchor so we can see what's left now that we've processed description
                            anchorElement.removeChild(descElement);
                        }

                        // Publisher is the remaining text in the anchor, once title & desc are removed
                        const publisher = anchorElement.innerHTML.trim();

                        // Image is optional,
                        // The element usually still exists with an additional has.mixtapeImage--empty class and has no background image
                        if (imgElement) {
                            const imgElementStyle = imgElement.style.getPropertyValue('background-image');
                            thumbnail = imgElementStyle?.match(/url\(([^)]*?)\)/)?.[1];
                        }

                        const payload = {url,
                            metadata: {
                                title,
                                description,
                                publisher,
                                thumbnail
                            }} as BookmarkNodeDataset;
                        const node = $createBookmarkNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}
