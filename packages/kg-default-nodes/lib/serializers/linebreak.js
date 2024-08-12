export default {
    import: {
        br: (node) => {
            const isGoogleDocs = !!node.closest('[id^="docs-internal-guid-"]');

            // Remove empty paragraphs when copy/pasting from Google docs:
            // - Between two paragraphs (P and P)
            // - Between a list and a paragraph (UL/OL and P), and vice versa
            // - Between a heading and a paragraph (H1-H6 and P), and vice versa
            if (isGoogleDocs) {
                if ((
                    node.previousElementSibling?.nodeName === 'P' &&
                    node.nextElementSibling?.nodeName === 'P'
                ) || (
                    ['UL', 'OL', 'DL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.previousElementSibling?.nodeName) &&
                    node.nextElementSibling?.nodeName === 'P'
                ) || (
                    node.previousElementSibling?.nodeName === 'P' &&
                    ['UL', 'OL', 'DL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.nextElementSibling?.nodeName)
                )) {
                    return {
                        conversion: () => null,
                        priority: 1
                    };
                }
            }

            // allow lower priority converter to handle (i.e. default LineBreakNode.importDOM)
            return null;
        }
    }
};
