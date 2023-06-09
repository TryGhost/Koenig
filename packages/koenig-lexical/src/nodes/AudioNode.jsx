import KoenigCardWrapper from '../components/KoenigCardWrapper';

import {ReactComponent as AudioCardIcon} from '../assets/icons/kg-card-type-audio.svg';
import {AudioNodeComponent} from './AudioNodeComponent';
import {AudioNode as BaseAudioNode} from '@tryghost/kg-default-nodes';
import {createCommand} from 'lexical';

// re-export here so we don't need to import from multiple places throughout the app
export const INSERT_AUDIO_COMMAND = createCommand();

export class AudioNode extends BaseAudioNode {
    static kgMenu = [{
        label: 'Audio',
        desc: 'Upload and play an audio file',
        Icon: AudioCardIcon,
        insertCommand: INSERT_AUDIO_COMMAND,
        matches: ['audio'],
        priority: 14
    }];

    static uploadType = 'audio';

    getIcon() {
        return AudioCardIcon;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()}>
                <AudioNodeComponent
                    duration={this.duration}
                    nodeKey={this.getKey()}
                    src={this.src}
                    thumbnailSrc={this.thumbnailSrc}
                    title={this.title}
                />
            </KoenigCardWrapper>
        );
    }
}

export const $createAudioNode = (dataset) => {
    return new AudioNode(dataset);
};

export function $isAudioNode(node) {
    return node instanceof AudioNode;
}
