import {addFigCaptionToPayload} from '../helpers';

// Helpers

function _createPayloadForIframe(iframe) {
    // If we don't have a src Or it's not an absolute URL, we can't handle this
    // This regex handles http://, https:// or //
    if (!iframe.src || !iframe.src.match(/^(https?:)?\/\//i)) {
        return;
    }

    // if it's a schemaless URL, convert to https
    if (iframe.src.match(/^\/\//)) {
        iframe.src = `https:${iframe.src}`;
    }

    let payload = {
        url: iframe.src
    };

    payload.html = iframe.outerHTML;

    return payload;
}

// Plugins

export function fromMixtape(options) {
    return function mixtapeEmbed(node, builder, {addSection, nodeFinished}) {
        if (node.nodeType !== 1 || node.tagName !== 'DIV' || !node.className.match(/graf--mixtapeEmbed/)) {
            return;
        }

        // Grab the relevant elements - Anchor wraps most of the data
        let anchorElement = node.querySelector('.markup--mixtapeEmbed-anchor');
        let titleElement = anchorElement.querySelector('.markup--mixtapeEmbed-strong');
        let descElement = anchorElement.querySelector('.markup--mixtapeEmbed-em');
        // Image is a top level field inside it's own a tag
        let imgElement = node.querySelector('.mixtapeImage');

        // Grab individual values from the elements
        let url = anchorElement.href;
        let title = '';
        let description = '';

        if (titleElement && titleElement.innerHTML) {
            title = options.cleanBasicHtml(titleElement.innerHTML);
            // Cleanup anchor so we can see what's left now that we've processed title
            anchorElement.removeChild(titleElement);
        }

        if (descElement && descElement.innerHTML) {
            description = options.cleanBasicHtml(descElement.innerHTML);
            // Cleanup anchor so we can see what's left now that we've processed description
            anchorElement.removeChild(descElement);
        }

        // // Format our preferred structure.
        let metadata = {
            url,
            title,
            description
        };

        // Publisher is the remaining text in the anchor, once title & desc are removed
        let publisher = options.cleanBasicHtml(anchorElement.innerHTML);
        if (publisher) {
            metadata.publisher = publisher;
        }

        // Image is optional,
        // The element usually still exists with an additional has.mixtapeImage--empty class and has no background image
        if (imgElement && imgElement.style['background-image']) {
            metadata.thumbnail = imgElement.style['background-image'].match(/url\(([^)]*?)\)/)[1];
        }

        let payload = {url, metadata};
        let cardSection = builder.createCardSection('bookmark', payload);
        addSection(cardSection);
        nodeFinished();
    };
}

export function fromFigureIframe(options) {
    return function figureIframeToEmbed(node, builder, {addSection, nodeFinished}) {
        if (node.nodeType !== 1 || node.tagName !== 'FIGURE') {
            return;
        }

        let iframe = node.querySelector('iframe');

        if (!iframe) {
            return;
        }

        let payload = _createPayloadForIframe(iframe);

        if (!payload) {
            return;
        }

        addFigCaptionToPayload(node, payload, {options});

        let cardSection = builder.createCardSection('embed', payload);
        addSection(cardSection);
        nodeFinished();
    };
}

export function fromIframe() {
    return function iframeToEmbedCard(node, builder, {addSection, nodeFinished}) {
        if (node.nodeType !== 1 || node.tagName !== 'IFRAME') {
            return;
        }

        let payload = _createPayloadForIframe(node);

        if (!payload) {
            return;
        }

        let cardSection = builder.createCardSection('embed', payload);
        addSection(cardSection);
        nodeFinished();
    };
}

export function fromFigureBlockquote(options) {
    return function figureBlockquoteToEmbedCard(node, builder, {addSection, nodeFinished}) {
        if (node.nodeType !== 1 || node.tagName !== 'FIGURE') {
            return;
        }

        let blockquote = node.querySelector('blockquote');
        let link = node.querySelector('a');

        if (!blockquote || !link) {
            return;
        }

        let url = link.href;

        // If we don't have a url, or it's not an absolute URL, we can't handle this
        if (!url || !url.match(/^https?:\/\//i)) {
            return;
        }

        let payload = {
            url: url
        };

        addFigCaptionToPayload(node, payload, {options});

        payload.html = node.innerHTML;

        let cardSection = builder.createCardSection('embed', payload);
        addSection(cardSection);
        nodeFinished();
    };
}

export function fromNFTEmbed() {
    return function fromNFTEmbedToEmbedCard(node, builder, {addSection, nodeFinished}) {
        if (node.nodeType !== 1 || node.tagName !== 'FIGURE') {
            return;
        }

        let nftCard = node.querySelector('a.kg-nft-card');

        if (!nftCard) {
            return;
        }

        let payload = {
            html: nftCard.outerHTML
        };

        let cardSection = builder.createCardSection('embed', payload);
        addSection(cardSection);
        nodeFinished();
    };
}
