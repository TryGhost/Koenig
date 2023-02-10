import {$getNodeByKey} from 'lexical';
import {getImageDimensions} from './getImageDimensions';

export const imageUploadHandler = async (file, nodeKey, editor, upload) => {
    if (!file) {
        return;
    }
    let url = URL.createObjectURL(file);
    if (url) {
        await editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setPreviewSrc(url);
        });
    }
    const {width, height} = await getImageDimensions(url);
    const fileSrc = await upload([file]);
    await editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        node.setImgWidth(width);
        node.setImgHeight(height);
        node.setSrc(fileSrc[0]);
    });
    return;
};
