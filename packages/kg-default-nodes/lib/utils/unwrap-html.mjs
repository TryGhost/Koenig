// Utility function to remove a wrapping p tag (if present) from content.
// Used to protect header elements from accidentally rendering inside a p tag (invalid).

export default function unwrapHtml(html, dom) {
    const div = dom.createElement('div');
    div.innerHTML = html;
    if (div.childNodes.length === 1 && div.childNodes[0].nodeName === 'P') {
        return div.childNodes[0].innerHTML;
    }
    return html;
}
