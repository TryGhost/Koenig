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

import MasonryLayout from '../masonry';

const masonry = new MasonryLayout(3);

class UnsplashService {
    constructor(API_URL, HEADERS) {
        this.API_URL = API_URL;
        this.HEADERS = HEADERS;
        this.photos = [];
        this._pagination = [];
        this.page = 1;
        this.error = null;
        this.debounce = 600;
        this.search_is_running = false;
        this.search_term = '';
        this._lastRequestUrl = '';
    }

    extractPagination(response) {
        response = response || response.results;
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
                if (link){
                    let linkParts = linkRegex.exec(link);
                    pagination[linkParts[2]] = linkParts[1];
                }
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
            this.error = errorText;

            // throw error to prevent further processing
            let error = new Error(errorText);
            error.response = response;
            throw error;
        });
    }

    async makeRequest(url, options) {
        this._lastRequestUrl = url;

        return await fetch(url, options)
            .then(response => this.checkStatus(response))
            .then(response => this.extractPagination(response))
            .then(response => response.json())
            .catch(error => this.error = error);
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

    async addPhotosFromResponse(response) {
        let photos = response.results || response;
        for (let photo of photos) {
            await this.addPhoto(photo);
        }
    }

    async addPhoto(photo) {
        photo.ratio = photo.width / photo.height;
        this.photos.push(photo);
        masonry.addPhotoToColumns(photo);
    }

    async loadNextPage() {
        if (this.search_is_running) {
            return;
        }
        if (this.photos.length === 0) {
            return;
        }
        if (this._pagination.next) {
            const url = `${this._pagination.next}`;
            const options = {
                method: 'GET',
                headers: this.HEADERS
            };
            const response = await this.makeRequest(url, options);
            this.photos = response;
            return;
        }
    }

    async search(term) {
        this.reset();
        // set debounce to prevent multiple requests
        this.search_is_running = true;
        this.photos = [];
        const url = `${this.API_URL}/search/photos?query=${term}&per_page=30`;
        const options = {
            method: 'GET',
            headers: this.HEADERS
        };
        const response = await this.makeRequest(url, options);
        if (response) {
            this.addPhotosFromResponse(response);
            this.search_is_running = false;
        }
    }

    getPhotos() {
        return this.photos;
    }

    clearPhotos() {
        this.photos = [];
    }

    getColumns() {
        return masonry.getColumns();
    }

    reset() {
        this.clearPhotos();
        masonry.reset();
        this.pagination = [];
    }
}

export default UnsplashService;
