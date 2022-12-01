// API Service for Unsplash
// Reference https://github.com/TryGhost/Ghost/blob/main/ghost/admin/app/services/unsplash.js

// TODO - Add API Service for Unsplash
// Max 30 images per request
// Pagination
// Search
// Masonry Layout, 3 columns
// should send notif request to unsplash when user uses an image

// Certain functions, eg headers and token? should be passed in from the consuming app.
// should this be a class with getters

// should this be in the app or as a separate package?

// const API_URL = 'https://api.unsplash.com';
// const API_VERSION = 'v1';
// const DEBOUNCE_MS = 600;
// const API_TOKEN = '8672af113b0a8573edae3aa3713886265d9bb741d707f6c01a486cde8c278980';

// functions to write

// makeRequest
// loadNew
// loadNextPage
// search
// checkStatus
// extractPagination
// triggerDownload

// const defaultHeaders = {
//     Authorization: `Client-ID ${API_TOKEN}`,
//     'Accept-Version': API_VERSION,
//     'Content-Type': 'application/json',
//     'App-Pragma': 'no-cache',
//     'X-Unsplash-Cache': true
// };

// const baseApiRequest = async (url, options) => {
//     const response = await fetch(url, options);
//     return response;
// };

// const checkStatus = (response) => {
//     if (response.status >= 200 && response.status < 300) {
//         return response;
//     }
//     const error = new Error(response.statusText);
//     error.response = response;
//     throw error;
// };

// const loadNew = async () => {
//     const url = `${API_URL}/photos?per_page=30`;
//     const options = {
//         method: 'GET',
//         headers: defaultHeaders
//     };
//     const response = await baseApiRequest(url, options);
//     return response;
// };

// const loadNextPage = async (page) => {
//     const url = `${API_URL}/photos?per_page=30&page=${page}`;
//     const options = {
//         method: 'GET',
//         headers: defaultHeaders
//     };
//     const response = await baseApiRequest(url, options);
//     return response;
// };
// const API_URL = 'https://api.unsplash.com';
// const API_VERSION = 'v1';
// const DEBOUNCE_MS = 600;
// const API_TOKEN = '8672af113b0a8573edae3aa3713886265d9bb741d707f6c01a486cde8c278980';

class UnsplashService {
    constructor(API_URL, API_VERSION, API_TOKEN, HEADERS) {
        this.API_URL = API_URL;
        this.API_VERSION = API_VERSION;
        this.API_TOKEN = API_TOKEN;
        this.HEADERS = HEADERS;
        this.page = 1;
        this.search_term = '';
    }

    photos = [];

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
            .then(response => response.json());
    }

    async loadNew() {
        const url = `${this.API_URL}/photos?per_page=30`;
        const options = {
            method: 'GET',
            headers: this.HEADERS
        };
        const response = await this.makeRequest(url, options);
        this.photos = response;
    }

    async loadNextPage(page) {
        const url = `${this.API_URL}/photos?per_page=30&page=${page}`;
        const options = {
            method: 'GET',
            headers: this.HEADERS
        };
        const response = await this.makeRequest(url, options);
        return response;
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
