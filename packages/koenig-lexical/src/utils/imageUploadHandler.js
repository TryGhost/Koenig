import {$getNodeByKey} from 'lexical';
import {getImageDimensions} from './getImageDimensions';

export const imageUploadHandler = async (files, nodeKey, editor, imageUploader) => {
    if (!files) {
        return;
    }
    let url = URL.createObjectURL(files[0]);
    if (url) {
        await editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setPreviewSrc(url);
        });
    }
    const {width, height} = await getImageDimensions(url);
    const fileSrc = await imageUploader.imageUploader(files);
    await editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        node.setImgWidth(width);
        node.setImgHeight(height);
        node.setSrc(fileSrc.src);
    });
    return;
};
