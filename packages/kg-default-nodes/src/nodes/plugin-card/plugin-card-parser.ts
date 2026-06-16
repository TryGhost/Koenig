import type {PluginCardNode} from './PluginCardNode.js';

export function parsePluginCardNode(NodeType: typeof PluginCardNode) {
    return {
        '#comment': (nodeElem: Comment) => {
            // Match <!--kg-card-begin: plugin-card-->
            if (nodeElem.nodeType === 8 && nodeElem.nodeValue?.trim().match(/^kg-card-begin:\s?plugin-card$/)) {
                return {
                    conversion(domNode: Comment) {
                        const html: string[] = [];
                        let nextNode = domNode.nextSibling;
                        let hasEndComment = false;

                        // First pass: check for end comment
                        let checkNode = domNode.nextSibling;
                        while (checkNode) {
                            if (checkNode.nodeType === 8 && checkNode.nodeValue?.trim().match(/^kg-card-end:\s?plugin-card$/)) {
                                hasEndComment = true;
                                break;
                            }
                            checkNode = checkNode.nextSibling;
                        }

                        nextNode = domNode.nextSibling;

                        if (hasEndComment) {
                            // Collect HTML between markers
                            while (nextNode && !(nextNode.nodeType === 8 && nextNode.nodeValue?.trim().match(/^kg-card-end:\s?plugin-card$/))) {
                                const currentNode = nextNode;
                                nextNode = currentNode.nextSibling;
                                if (currentNode.nodeType === 1) {
                                    html.push((currentNode as Element).outerHTML);
                                } else if (currentNode.nodeType === 3 && currentNode.textContent) {
                                    html.push(currentNode.textContent);
                                }
                                currentNode.remove();
                            }
                            // Remove end comment
                            if (nextNode) {
                                nextNode.remove();
                            }
                        }

                        const fullHtml = html.join('\n').trim();

                        // Extract plugin metadata from data attributes
                        let pluginName = '';
                        let cardName = '';
                        let payload = '{}';

                        // Parse the HTML to find data attributes
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = fullHtml;
                        const firstChild = tempDiv.firstElementChild;
                        if (firstChild) {
                            pluginName = firstChild.getAttribute('data-ghost-plugin') || '';
                            cardName = firstChild.getAttribute('data-card-name') || '';
                            payload = firstChild.getAttribute('data-ghost-payload') || '{}';
                        }

                        const nodePayload = {
                            html: fullHtml,
                            pluginName,
                            cardName,
                            payload
                        };

                        const node = new NodeType(nodePayload);
                        return { node };
                    },
                    priority: 0
                };
            }
            return null;
        }
    };
}
