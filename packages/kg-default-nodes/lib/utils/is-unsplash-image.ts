export const isUnsplashImage = function (url: string): boolean {
    return /images\.unsplash\.com/.test(url);
};
