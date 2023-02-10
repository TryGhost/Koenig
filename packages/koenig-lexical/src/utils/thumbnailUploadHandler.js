import {$getNodeByKey} from 'lexical';

export const thumbnailUploadHandler = async (file, nodeKey, editor, upload) => {
    if (!file) {
        return;
    }
    const fileSrc = await upload([file]);
    await editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        node.setThumbnailSrc(fileSrc[0]);
    });
    return;
};