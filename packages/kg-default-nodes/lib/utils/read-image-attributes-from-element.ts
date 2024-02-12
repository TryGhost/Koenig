export type ImageAttributes = {
    src?: string;
    width?: number;
    height?: number;
    alt?: string;
    title?: string;
    href?: string;
    fileName?: string; // used by GalleryNode
    row?: number; // used by GalleryNode
};

export function readImageAttributesFromElement(element: HTMLImageElement): ImageAttributes {
    const attrs: ImageAttributes = {};

    if (element.src) {
        attrs.src = element.src;
    }

    if (element.width) {
        attrs.width = element.width;
    } else if (element.dataset && element.dataset.width) {
        attrs.width = parseInt(element.dataset.width, 10);
    }

    if (element.height) {
        attrs.height = element.height;
    } else if (element.dataset && element.dataset.height) {
        attrs.height = parseInt(element.dataset.height, 10);
    }

    if ((!element.width && !element.height)) {
        const dimensions = element.getAttribute('data-image-dimensions');
        if (dimensions) {
            const [, width, height] = (/^(\d*)x(\d*)$/gi).exec(dimensions) || [];
            attrs.width = parseInt(width, 10);
            attrs.height = parseInt(height, 10);
        }
    }

    if (element.alt) {
        attrs.alt = element.alt;
    }

    if (element.title) {
        attrs.title = element.title;
    }

    const parentNode = element.parentNode as HTMLAnchorElement | null;
    if (parentNode?.tagName === 'A') {
        const href = parentNode?.href;

        if (href !== attrs.src) {
            attrs.href = href;
        }
    }

    return attrs;
}
