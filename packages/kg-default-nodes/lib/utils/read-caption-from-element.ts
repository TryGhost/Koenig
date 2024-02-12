import {buildCleanBasicHtmlForElement} from './build-clean-basic-html-for-element';

export function readCaptionFromElement(element: HTMLElement, {selector = 'figcaption'} = {}): string | undefined {
    const cleanBasicHtml = buildCleanBasicHtmlForElement(element);

    let caption: string | undefined;

    const figcaptions = Array.from(element.querySelectorAll(selector));
    if (figcaptions.length) {
        figcaptions.forEach((figcaption) => {
            const cleanHtml = cleanBasicHtml(figcaption.innerHTML);
            caption = caption ? `${caption} / ${cleanHtml}` : cleanHtml;
        });
    }

    return caption;
}
