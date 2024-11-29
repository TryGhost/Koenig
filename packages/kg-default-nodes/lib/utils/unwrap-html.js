
export function unwrapHtml(html) {
    if (/^<p(\s+[^>]*)?>([\s\S]*)<\/p>$/i.test(html.trim())) {
        console.log('INFO: strip extra paragraph tag from product title');
        return html.replace(/^<p(\s+[^>]*)?>([\s\S]*)<\/p>$/i, '$2');
    }
    return html;
}

