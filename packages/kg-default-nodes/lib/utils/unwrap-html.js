function unwrapHtml(html) {
    /* Faster but confused by two adjacent p tags.
    if (/^<p(\s+[^>]*)?>([\s\S]*)<\/p>$/i.test(html.trim())) {
        console.log('INFO: strip extra paragraph tag from product title');
        return html.replace(/^<p(\s+[^>]*)?>([\s\S]*)<\/p>$/i, '$2');
    }
    return html;
    */
    const div = document.createElement('div');
    div.innerHTML = html;
    // if the div has a single child, and that child is a paragraph, we can safely remove the paragraph.
    if (div.childNodes.length === 1 && div.childNodes[0].nodeName === 'P') {
        return div.childNodes[0].innerHTML;
    }
    return html;
}

module.exports = unwrapHtml;
