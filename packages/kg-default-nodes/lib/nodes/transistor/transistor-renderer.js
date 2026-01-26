export function renderTransistorNode(node, options) {
    const document = options.dom;
    const accentColor = node.accentColor;
    const backgroundColor = node.backgroundColor;

    // Build the embed URL with optional color parameters
    // {uuid} placeholder will be replaced server-side with the member's UUID
    let embedUrl = 'https://partner.transistor.fm/ghost/embed/{uuid}';
    const params = [];

    if (accentColor) {
        // Remove # prefix if present for URL parameter
        params.push(`color=${accentColor.replace('#', '')}`);
    }
    if (backgroundColor) {
        // Remove # prefix if present for URL parameter
        params.push(`background=${backgroundColor.replace('#', '')}`);
    }

    if (params.length > 0) {
        embedUrl += '?' + params.join('&');
    }

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

    return {
        element: figure,
        type: 'inner'
    };
}
