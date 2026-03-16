const semver = require('semver');

/**
 * Helper function to create a slug from a string
 * @param {string} inputString - The string to slugify
 * @param {RegExp} symbolRegex - Regex for symbols to remove
 * @returns {string}
 */
function createSlug(inputString, symbolRegex) {
    return encodeURIComponent(
        inputString.trim()
            .toLowerCase()
            .replace(symbolRegex, '')
            .replace(/\s+/g, '-')
            .replace(/^-|-{2,}|-$/g, '')
    );
}

module.exports = function (inputString = '', {ghostVersion = '6.0', type = 'mobiledoc'} = {}) {
    const version = semver.coerce(ghostVersion);

    if (typeof inputString !== 'string' || (inputString || '').trim() === '') {
        return '';
    }

    if (semver.satisfies(version, '<4.x')) {
        if (type === 'markdown') {
            // backwards compatible slugs used in Ghost 0.x to 3.x markdown
            return inputString.replace(/[^\w]/g, '').toLowerCase();
        } else {
            // backwards compatible slugs used in Ghost 2.x to 3.x mobiledoc
            return inputString.replace(/[<>&"?]/g, '')
                .trim()
                .replace(/[^\w]/g, '-')
                .replace(/-{2,}/g, '-')
                .toLowerCase();
        }
    }

    // new slugs introduced in 4.0
    // allows all chars except symbols but will urlEncode everything
    // produces %-encoded chars in src but browsers show real chars in status bar and url bar
    if (semver.satisfies(version, '<6.x')) {
        return createSlug(inputString, /[\][!"#$%&'()*+,./:;<=>?@\\^_{|}~]/g);
    } else {
        // For ghost versions 6.x and above, remove additional symbols
        return createSlug(inputString, /[\][!"#$%&'()*+,./:;<=>?@\\^_{|}~‘’“”`¡¿–—•]/g);
    }
};
