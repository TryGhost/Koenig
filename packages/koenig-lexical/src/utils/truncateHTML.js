/**
 * Truncates HTML text to a specified number of words while preserving HTML tags
 * @param {string} html - The HTML string to truncate
 * @param {number} limit - The maximum number of words to keep
 * @returns {string} Truncated HTML string
 */
export function truncateHTML(html, limit) {
    if (!html) {
        return '';
    }

    // Create a temporary div to parse HTML
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';

    // Split into words and check if truncation is needed
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) {
        return html;
    }

    // Truncate to word limit
    const truncated = words.slice(0, limit).join(' ') + '...';
    
    return truncated;
} 