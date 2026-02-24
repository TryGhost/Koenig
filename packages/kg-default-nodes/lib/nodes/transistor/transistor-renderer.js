import {addCreateDocumentOption} from '../../utils/add-create-document-option';
import {buildSrcBackgroundScript} from '../../utils/set-src-background-from-parent';
import {renderWithVisibility} from '../../utils/visibility';

export function renderTransistorNode(node, options) {
    addCreateDocumentOption(options);
    const document = options.createDocument();

    // {uuid} placeholder will be replaced server-side with the member's UUID
    const baseUrl = 'https://partner.transistor.fm/ghost/embed/{uuid}';
    const params = new URLSearchParams();

    if (options.siteUuid) {
        params.set('ctx', options.siteUuid);
    }

    const queryString = params.toString();
    const embedUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const iframe = document.createElement('iframe');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '180');
    iframe.setAttribute('frameborder', 'no');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('seamless', '');
    iframe.setAttribute('src', embedUrl);
    const figure = document.createElement('figure');
    figure.setAttribute('class', 'kg-card kg-transistor-card');
    figure.appendChild(iframe);

    // Inject script to detect parent background color and pass it to the embed
    figure.insertAdjacentHTML('beforeend', buildSrcBackgroundScript());

    return renderWithVisibility({element: figure, type: 'inner'}, node.visibility, options);
}
