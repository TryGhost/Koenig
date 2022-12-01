// API Service for Unsplash
// Reference https://github.com/TryGhost/Ghost/blob/main/ghost/admin/app/services/unsplash.js

// functions to write

// makeRequest
// loadNew
// loadNextPage
// search
// checkStatus
// extractPagination
// triggerDownload

class UnsplashService {
    constructor(API_URL, HEADERS) {
        this.API_URL = API_URL;
        this.HEADERS = HEADERS;
    }

    photos = [];
    _pagination = [];
    page = 1;

    async extractPagination(response) {
        let pagination = {};
        let linkRegex = new RegExp('<(.*)>; rel="(.*)"');

        let links = [];
        for (let entry of response.headers.entries()) {
            if (entry[0] === 'link') {
                links.push(entry[1]);
            }
        }

        if (links) {
            links.toString().split(',').forEach((link) => {
                let [, url, rel] = linkRegex.exec(link);

                pagination[rel] = url;
            });
        }

        this._pagination = pagination;

        return response;
    }

    async checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return (response);
        }

        let errorText = '';
        let responseTextPromise;

        if (response.headers.map['content-type'] === 'application/json') {
            responseTextPromise = response.json().then(json => json.errors[0]);
        } else if (response.headers.map['content-type'] === 'text/xml') {
            responseTextPromise = response.text();
        }

        return responseTextPromise.then((responseText) => {
            if (response.status === 403 && response.headers.map['x-ratelimit-remaining'] === '0') {
                // we've hit the ratelimit on the API
                errorText = 'Unsplash API rate limit reached, please try again later.';
            }

            errorText = errorText || responseText || `Error ${response.status}: Uh-oh! Trouble reaching the Unsplash API`;

            // set error text for display in UI
            this.set('error', errorText);

            // throw error to prevent further processing
            let error = new Error(errorText);
            error.response = response;
            throw error;
        });
    }

    async makeRequest(url, options) {
        return await fetch(url, options)
            .then(response => this.checkStatus(response))
            .then(response => this.extractPagination(response))
            .then(response => response.json());
    }

    async loadNew() {
        const url = `${this.API_URL}/photos?per_page=30`;
        const options = {
            method: 'GET',
            headers: this.HEADERS
        };
        const response = await this.makeRequest(url, options);
        await this.addPhotosFromResponse(response);
    }

    async addPhoto(photo) {
        // precalc ratio
        photo.ratio = photo.width / photo.height;
        this.photos.push(photo);
    }

    async addPhotosFromResponse(response) {
        for (let photo of response) {
            await this.addPhoto(photo);
        }
    }

    async loadNextPage() {
        const url = `${this._pagination.next}`;
        const options = {
            method: 'GET',
            headers: this.HEADERS
        };
        const response = await this.makeRequest(url, options);
        this.photos = response;
        return;
    }

    async search(term) {
        const url = `${this.API_URL}/search/photos?per_page=30&query=${term}`;
        const options = {
            method: 'GET',
            headers: this.HEADERS
        };
        const response = await this.makeRequest(url, options);
        return response;
    }

    getPhotos() {
        return this.photos;
    }
}

export default UnsplashService;
