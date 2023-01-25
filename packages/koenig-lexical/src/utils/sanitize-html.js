import html_sanitize from 'html_sanitize';
import cajaSanitizers from '../utils/caja-sanitizers';

export function sanitizeHtml(html, options = {}) {
    options = {
        ...{replaceJS: true},
        ...options
    };

    // replace script and iFrame
    if (options.replaceJS) {
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            '<pre class="js-embed-placeholder">Embedded JavaScript</pre>');
        html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            '<pre class="iframe-embed-placeholder">Embedded iFrame</pre>');
    }

    // sanitize html
    return html_sanitize(html, cajaSanitizers.url, cajaSanitizers.id);
}
