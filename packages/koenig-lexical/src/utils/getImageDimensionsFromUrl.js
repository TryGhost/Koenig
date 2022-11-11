// gets image dimensions from a given Url

export async function getImageDimensionsFromUrl(url) {
    return await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.decode().then(() => {
            let width = img.width;
            let height = img.height;
            resolve({width, height});
        });
    });
}
