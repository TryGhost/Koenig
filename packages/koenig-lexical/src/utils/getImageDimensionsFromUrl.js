export async function getImageDimensionsFromUrl(url) {
    const img = new Image();
    img.src = url;
    return new Promise((resolve, reject) => {
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height
            });
        };
        img.onerror = () => {
            reject(new Error('Could not load image'));
        };
    });
}
