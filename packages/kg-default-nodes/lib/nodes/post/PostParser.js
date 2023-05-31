export function parsePostNode(PostNode) {
    return {
        div: () => ({
            conversion(domNode) {
                const isPostCard = domNode.classList?.contains('kg-post-card');
                if (domNode.tagName === 'DIV' && isPostCard) {
                    const content = domNode.textContent;

                    const payload = {
                        content: content
                    };

                    const node = new PostNode(payload);
                    return {node};
                }

                return null;
            },
            priority: 1
        })
    };
}