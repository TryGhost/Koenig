import type {GeneratedDecoratorNodeBase} from '@tryghost/kg-default-nodes';
import {$getNodeByKey, LexicalEditor} from 'lexical';
import {getImageDimensions} from './getImageDimensions';

export const imageUploadHandler = async (files: File[] | FileList, nodeKey: string, editor: LexicalEditor, upload: (files: File[] | FileList) => Promise<{url: string}[] | null>) => {
    if (!files) {
        return;
    }

    // show preview via an object URL whilst upload is in progress
    const previewUrl = URL.createObjectURL(files[0]);
    if (previewUrl) {
        await editor.update(() => {
            const node = $getNodeByKey(nodeKey) as GeneratedDecoratorNodeBase | null;
            if (node) {
                node.previewSrc = previewUrl;
            }
        });
    }

    // use the local object URL to grab metadata
    const {width, height} = await getImageDimensions(previewUrl);

    // perform the actual upload
    const result = await upload(files);
    const imageSrc = result?.[0].url;

    // replace preview URL with real URL and set image metadata
    await editor.update(() => {
        const node = $getNodeByKey(nodeKey) as GeneratedDecoratorNodeBase | null;
        if (node) {
            node.width = width;
            node.height = height;
            node.src = imageSrc;
            node.previewSrc = null;
        }
    });

    return;
};

export const backgroundImageUploadHandler = async (files: File[], upload: (files: File[]) => Promise<{url: string}[] | null>) => {
    if (!files) {
        return;
    }
    const result = await upload(files);
    const imageSrc = result?.[0].url;

    const {width, height} = await getImageDimensions(imageSrc!);

    return {
        imageSrc,
        width,
        height
    };
};
