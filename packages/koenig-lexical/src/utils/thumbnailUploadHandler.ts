import type {GeneratedDecoratorNodeBase} from '@tryghost/kg-default-nodes';
import {$getNodeByKey, LexicalEditor} from 'lexical';

export const thumbnailUploadHandler = async (files: File[], nodeKey: string, editor: LexicalEditor, upload: (files: File[], options?: {formData: {url: string}}) => Promise<{url: string}[]>) => {
    if (!files) {
        return;
    }

    let mediaSrc = '';

    editor.getEditorState().read(() => {
        const node = $getNodeByKey(nodeKey) as GeneratedDecoratorNodeBase | null;
        if (node) {
            mediaSrc = node.src as string;
        }
    });

    const uploadResult = await upload(files, {formData: {url: mediaSrc}});

    await editor.update(() => {
        const node = $getNodeByKey(nodeKey) as GeneratedDecoratorNodeBase | null;
        if (node) {
            node.thumbnailSrc = uploadResult[0].url;
        }
    });

    return;
};
