function wrapHtml(html) {
    // wrap the product title in a paragraph if needed. This stops lexical from mangling content when multiple spans are inserted.
    // Also tried doing this by creating an element and checking if it's a paragraph, but this is 4-6x faster

    if (!/^<p(\s+[^>]*)?>.*<\/p>$/i.test(html.trim())) {
        return `<p>${html}</p>`;
    }
    return html;
}

export {wrapHtml};