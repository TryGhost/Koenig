import type {GeneratedDecoratorNodeBase} from '@tryghost/kg-default-nodes';
import {$getNodeByKey, LexicalEditor} from 'lexical';

export const stripFileExtension = (fileName: string) => {
    const fileExtension = fileName.split('.').pop();
    const fileNameWithoutExtension = fileName.replace(`.${fileExtension}`, '');
    return fileNameWithoutExtension;
};

export const fileUploadHandler = async (files: File[], nodeKey: string, editor: LexicalEditor, upload: (files: File[]) => Promise<{url: string}[] | null>) => {
    if (!files) {
        return;
    }
    const result = await upload(files);
    const meta = files;
    const fileName = meta?.[0].name;
    const fileSize = meta?.[0].size;
    const src = result?.[0].url;

    const dataset = {
        fileName: fileName,
        fileSize: fileSize,
        src: src
    };
    await editor.update(() => {
        const node = $getNodeByKey(nodeKey) as GeneratedDecoratorNodeBase | null;
        if (node) {
            node.fileTitle = stripFileExtension(dataset.fileName); // initially sets the title to the file name
            node.fileName = dataset.fileName;
            node.fileSize = dataset.fileSize;
            node.src = dataset.src;
        }
    });

    return;
};
