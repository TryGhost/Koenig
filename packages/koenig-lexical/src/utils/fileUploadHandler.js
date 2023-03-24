import {$getNodeByKey} from 'lexical';
// import {getImageDimensions} from './getImageDimensions';

export const fileUploadHandler = async (files, nodeKey, editor, upload) => {
    if (!files) {
        return;
    }

    // perform the actual upload
    const result = files; // replace with real upload function
    const fileName = result?.[0].name;
    const fileSize = result?.[0].size;
    const src = result?.[0].url || `/uploads/${fileName}`;

    // convert fizeSize to human readable format
    // const size = fileSize / 1024;
    // const sizeUnit = size > 1024 ? 'MB' : 'KB';
    // const fileSizeHumanReadable = size > 1024 ? (size / 1024).toFixed(2) : size.toFixed(2);

    // replace preview URL with real URL and set image metadata
    await editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        node.setFileName(fileName);
        node.setFileSize(fileSize);
        node.setSrc(src);
    });

    return;
};
