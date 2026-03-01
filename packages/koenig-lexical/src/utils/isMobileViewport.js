/**
 * Determines if the current viewport is a mobile device in portrait orientation.
 * Mobile is defined as width < 768px and height > width (portrait mode).
 *
 * @returns {boolean} True if the viewport is mobile portrait, false otherwise
 */
export function isMobileViewport() {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.innerWidth < 768 && window.innerHeight > window.innerWidth;
}
