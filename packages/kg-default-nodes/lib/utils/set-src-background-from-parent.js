/**
 * Builds an inline script tag that detects the nearest non-transparent ancestor
 * background color and sets it as a `background` query param on the first
 * iframe within the script's parent element.
 *
 * Uses `document.currentScript` to scope to the containing card, so multiple
 * instances on the same page each target their own iframe.
 *
 * @returns {string} An HTML script tag string
 */
export function buildSrcBackgroundScript() {
    function setSrcBackgroundFromParent() {
        const script = document.currentScript;
        if (!script) {
            return;
        }

        const el = script.parentElement.querySelector('iframe');
        if (!el) {
            return;
        }

        function isTransparent(bg) {
            if (!bg || bg === 'transparent') {
                return true;
            }
            const m = bg.match(/[\d.]+/g);
            return m && m.length >= 4 && parseFloat(m[3]) === 0;
        }

        let node = el.parentElement;
        let bg;
        while (node) {
            bg = window.getComputedStyle(node).backgroundColor;
            if (!isTransparent(bg)) {
                break;
            }
            node = node.parentElement;
        }

        if (!node || isTransparent(bg)) {
            return;
        }

        const m = bg.match(/\d+/g);
        if (m && m.length >= 3) {
            const hex = m.slice(0, 3).map(c => parseInt(c).toString(16).padStart(2, '0')).join('');
            const u = new URL(el.src);
            u.searchParams.set('background', hex);
            el.src = u.toString();
        }
    }

    return `<script>(${setSrcBackgroundFromParent.toString()})()</script>`;
}
