import {addCreateDocumentOption} from '../../utils/add-create-document-option';
import {renderEmptyContainer} from '../../utils/render-empty-container';
import * as cheerio from 'cheerio';

function rewriteVideoEmbeds(html, postUrl) {
    try {
        // quick check that there's a video tag in the html
        const videoTagRegex = /<video.*?>/g;
        if (!videoTagRegex.test(html)) {
            return html;
        }
        const $ = cheerio.load(html);
        // check the html for one or more video tags
        const videoTags = $('video');
        if (videoTags.length === 0 || !postUrl) {
            return html;
        }
        // loop over video tags, looking for any with the poster attribute
        videoTags.each((index, videoTag) => {
            const $videoTag = $(videoTag);
            const poster = $videoTag.attr('poster');
            // if a poster attribute is found, replace the video with a linked image
            if (poster) {
                const title = $videoTag.attr('title') || 'Click to play video';
                $videoTag.replaceWith(`<a href="${postUrl}"><img src="${poster}" title="${title}" alt="${title}" /></a>`);
            } 
        });
        return $.html();
    } catch (err) {
        return html;
    }
}
   
export function renderHtmlNode(node, options = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument();

    let html = node.html;

    if (!html) {
        return renderEmptyContainer(document);
    }
    if (options.target === 'email') {
        html = rewriteVideoEmbeds(html, options.postUrl);
    }
    const wrappedHtml = `\n<!--kg-card-begin: html-->\n${html}\n<!--kg-card-end: html-->\n`;

    const textarea = document.createElement('textarea');
    textarea.value = wrappedHtml;

    if (!options.feature?.contentVisibility) {
        // `type: 'value'` will render the value of the textarea element
        return {element: textarea, type: 'value'};
    }

    const segment = node.visibility.segment || '';

    const showOnEmail = node.visibility.showOnEmail;
    const showOnWeb = node.visibility.showOnWeb;

    if (segment) {
        textarea.setAttribute('data-gh-segment', segment);
    }

    const isEmailOnly = !showOnWeb && showOnEmail;
    const isWebOnly = showOnWeb && !showOnEmail;
    const showOnWebAndEmail = showOnEmail && showOnWeb;
    const showNowhere = !showOnEmail && !showOnWeb;

    if (showNowhere) {
        return renderEmptyContainer(document);
    }

    if (isWebOnly && options.target !== 'email') {
        return {element: textarea, type: 'value'};
    }

    if (isWebOnly && options.target === 'email') {
        return renderEmptyContainer(document);
    }

    if (isEmailOnly && options.target !== 'email') {
        return renderEmptyContainer(document);
    }

    if (isEmailOnly && options.target === 'email') {
        const container = document.createElement('div');
        container.innerHTML = wrappedHtml;
        if (segment) {
            container.setAttribute('data-gh-segment', segment);
        }
        return {element: container, type: 'html'};
    }

    if (isWebOnly && options.target === 'email') {
        return renderEmptyContainer(document);
    }

    if (showOnWebAndEmail) {
        if (options.target === 'email') {
            const container = document.createElement('div');
            container.innerHTML = wrappedHtml;
            if (segment) {
                container.setAttribute('data-gh-segment', segment);
            }
            return {element: container, type: 'html'};
        }

        return {element: textarea, type: 'value'};
    }
}
