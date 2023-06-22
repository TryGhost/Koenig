import {$getNodeByKey} from 'lexical';
import {getImageDimensions} from './getImageDimensions';

export const imageUploadHandler = async (files, nodeKey, editor, upload) => {
    if (!files) {
        return;
    }

    // show preview via an object URL whilst upload is in progress
    let previewUrl = URL.createObjectURL(files[0]);
    if (previewUrl) {
        await editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.previewSrc = previewUrl;
        });
    }

    // use the local object URL to grab metadata
    const {width, height} = await getImageDimensions(previewUrl);

    // perform the actual upload
    const result = await upload(files);
    const imageSrc = result?.[0].url;

    // replace preview URL with real URL and set image metadata
    await editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        node.width = width;
        node.height = height;
        node.src = imageSrc;
        node.previewSrc = null;
    });

    return;
};

export const backgroundImageUploadHandler = async (files, upload) => {
    if (!files) {
        return;
    }
    const result = await upload(files);
    const imageSrc = result?.[0].url;
    return {
        imageSrc
    };
};
