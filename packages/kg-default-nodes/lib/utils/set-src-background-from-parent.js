/**
 * Builds an inline script tag that reads `data-src` from the first iframe
 * in the script's parent element, detects the nearest non-transparent ancestor
 * background color, appends it as a `background` query param, and sets `src`
 * to trigger a single load with the correct background.
 *
 * Uses `document.currentScript` to scope to the containing card, so multiple
 * instances on the same page each target their own iframe.
 *
 * @param {Document} document
 * @returns {HTMLScriptElement} A script element
 */
export function buildSrcBackgroundScript(document) {
    function setSrcBackgroundFromParent() {
        const script = document.currentScript;
        if (!script) {
            return;
        }

        const el = script.parentElement.querySelector('iframe[data-src]');
        if (!el) {
            return;
        }

        const baseSrc = el.getAttribute('data-src');

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
            el.src = baseSrc;
            return;
        }

        const m = bg.match(/\d+/g);
        if (m && m.length >= 3) {
            const hex = m.slice(0, 3).map(c => parseInt(c).toString(16).padStart(2, '0')).join('');
            const u = new URL(baseSrc);
            u.searchParams.set('background', hex);
            el.src = u.toString();
        } else {
            el.src = baseSrc;
        }
    }

    const script = document.createElement('script');
    script.innerHTML = `(${setSrcBackgroundFromParent.toString()})()`;
    return script;
}
