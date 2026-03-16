import KoenigCardWrapper from '../components/KoenigCardWrapper';

import AudioCardIcon from '../assets/icons/kg-card-type-audio.svg?react';
import {AudioNodeComponent} from './AudioNodeComponent';
import {AudioNode as BaseAudioNode} from '@tryghost/kg-default-nodes';
import {createCommand} from 'lexical';

export const INSERT_AUDIO_COMMAND = createCommand();

export class AudioNode extends BaseAudioNode {
    __triggerFileDialog = false;
    __initialFile: File | null = null;

    static kgMenu = [{
        label: 'Audio',
        desc: 'Upload and play an audio file',
        Icon: AudioCardIcon,
        insertCommand: INSERT_AUDIO_COMMAND,
        insertParams: {
            triggerFileDialog: true
        },
        matches: ['audio'],
        priority: 14,
        shortcut: '/audio'
    }];

    static uploadType = 'audio';

    constructor(dataset: Record<string, unknown> = {}, key?: string) {
        super(dataset, key);

        const {triggerFileDialog, initialFile} = dataset;

        // don't trigger the file dialog when rendering if we've already been given a url
        this.__triggerFileDialog = (!dataset.src && triggerFileDialog) as boolean || false;
        this.__initialFile = (initialFile as File) || null;
    }

    getIcon() {
        return AudioCardIcon;
    }

    set triggerFileDialog(shouldTrigger: boolean) {
        const writable = this.getWritable();
        writable.__triggerFileDialog = shouldTrigger;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()}>
                <AudioNodeComponent
                    duration={this.duration as number}
                    initialFile={this.__initialFile}
                    nodeKey={this.getKey()}
                    src={this.src as string}
                    thumbnailSrc={this.thumbnailSrc}
                    title={this.title as string}
                    triggerFileDialog={this.__triggerFileDialog}
                />
            </KoenigCardWrapper>
        );
    }
}

export const $createAudioNode = (dataset: Record<string, unknown>) => {
    return new AudioNode(dataset);
};

export function $isAudioNode(node: unknown): node is AudioNode {
    return node instanceof AudioNode;
}
