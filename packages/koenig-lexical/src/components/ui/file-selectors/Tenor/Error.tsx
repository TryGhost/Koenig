import {ERROR_TYPE} from '../../../../utils/services/tenor.js';

interface ErrorProps {
    error: string;
}

export function Error({error}: ErrorProps) {
    if (error === ERROR_TYPE.COMMON) {
        return (
            <p>
                Uh-oh! Trouble reaching the Tenor API, please check your connection
            </p>
        );
    }

    if (error === ERROR_TYPE.INVALID_API_KEY) {
        return (
            <p>
                This version of the Tenor API is no longer supported. Please update your API key by following our
                <a href="https://ghost.org/docs/config/#tenor" rel="noopener noreferrer" target="_blank"> documentation here</a>.
            </p>
        );
    }
    return (
        <p>{error}</p>
    );
}
