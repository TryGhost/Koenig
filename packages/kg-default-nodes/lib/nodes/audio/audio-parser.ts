import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createAudioNode, AudioNodeDataset} from './AudioNode';

export function parseAudioNode(): DOMConversionMap | null {
    return {
        div: (nodeElem: HTMLElement): DOMConversion | null => {
            const isKgAudioCard = nodeElem.classList?.contains('kg-audio-card');
            if (nodeElem.tagName === 'DIV' && isKgAudioCard) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput {
                        const titleNode = domNode?.querySelector('.kg-audio-title');
                        const audioNode = domNode?.querySelector('.kg-audio-player-container audio') as HTMLAudioElement | null;
                        const durationNode = domNode?.querySelector('.kg-audio-duration');
                        const thumbnailNode = domNode?.querySelector('.kg-audio-thumbnail') as HTMLImageElement | null;
                        const title = titleNode && titleNode.innerHTML.trim();
                        const audioSrc = audioNode && audioNode.src;
                        const thumbnailSrc = thumbnailNode && thumbnailNode.src;
                        const durationText = durationNode && durationNode.innerHTML.trim();
                        
                        const payload: AudioNodeDataset = {
                            src: audioSrc || undefined,
                            title: title || undefined
                        };

                        if (thumbnailSrc) {
                            payload.thumbnailSrc = thumbnailSrc;
                        }

                        if (durationText) {
                            const [minutes, seconds = '0'] = durationText.split(':');
                            try {
                                payload.duration = parseInt(minutes) * 60 + parseInt(seconds);
                            } catch (e) {
                                // ignore duration
                            }
                        }

                        const node = $createAudioNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}
