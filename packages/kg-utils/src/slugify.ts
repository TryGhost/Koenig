import semver from 'semver';

interface SlugifyOptions {
    ghostVersion?: string;
    type?: string;
}

export default function slugify(inputString: unknown = '', {ghostVersion = '4.0', type = 'mobiledoc'}: SlugifyOptions = {}): string {
    const version = semver.coerce(ghostVersion);

    if (typeof inputString !== 'string' || (inputString || '').trim() === '') {
        return '';
    }

    if (version && semver.satisfies(version, '<4.x')) {
        if (type === 'markdown') {
            return inputString.replace(/[^\w]/g, '').toLowerCase();
        } else {
            return inputString.replace(/[<>&"?]/g, '')
                .trim()
                .replace(/[^\w]/g, '-')
                .replace(/-{2,}/g, '-')
                .toLowerCase();
        }
    } else {
        return encodeURIComponent(inputString.trim()
            .toLowerCase()
            .replace(/[\][!"#$%&'()*+,./:;<=>?@\\^_{|}~]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-|-{2,}|-$/g, '')
        );
    }
}
