import {$getNodeByKey} from 'lexical';
import {getAudioMetadata} from './getAudioMetadata';
import prettifyFileName from './prettifyFileName';

export const audioUploadHandler = async (file, nodeKey, editor, upload) => {
    if (!file) {
        return;
    }
    let url = URL.createObjectURL(file);
    let filename = file.name;
    let title = prettifyFileName(filename);
    
    const {duration, mimeType} = await getAudioMetadata(url);
    const fileSrc = await upload([file]);
    await editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        node.setDuration(duration);
        node.setSrc(fileSrc[0]);
        node.setMimeType(mimeType);
        node.setTitle(title);
    });
    return;
};
