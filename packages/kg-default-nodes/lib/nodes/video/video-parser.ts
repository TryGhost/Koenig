import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {readCaptionFromElement} from '../../utils/read-caption-from-element';
import {$createVideoNode, VideoNodeDataset} from './VideoNode';

export function parseVideoNode(): DOMConversionMap | null {
    return {
        figure: (nodeElem: HTMLElement): DOMConversion | null => {
            const isKgVideoCard = nodeElem.classList?.contains('kg-video-card');
            if (nodeElem.tagName === 'FIGURE' && isKgVideoCard) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput | null {
                        const videoNode = domNode.querySelector('.kg-video-container video') as HTMLVideoElement;
                        if (!videoNode) {
                            return null;
                        }
                        const durationNode = domNode.querySelector('.kg-video-duration');
                        const videoSrc = videoNode && videoNode.src;
                        const videoWidth = videoNode && videoNode.width;
                        const videoHeight = videoNode && videoNode.height;
                        const durationText = durationNode && durationNode.innerHTML.trim();
                        const captionText = readCaptionFromElement(domNode);

                        if (!videoSrc) {
                            return null;
                        }

                        const payload: VideoNodeDataset = {
                            src: videoSrc,
                            loop: !!videoNode.loop,
                            cardWidth: getCardWidth(videoNode)
                        };

                        if (durationText) {
                            const [minutes, seconds] = durationText.split(':');
                            try {
                                payload.duration = parseInt(minutes) * 60 + parseInt(seconds);
                            } catch (e) {
                                // ignore duration
                            }
                        }

                        if (domNode.dataset.kgThumbnail) {
                            payload.thumbnailSrc = domNode.dataset.kgThumbnail;
                        }

                        if (domNode.dataset.kgCustomThumbnail) {
                            payload.customThumbnailSrc = domNode.dataset.kgCustomThumbnail;
                        }

                        if (captionText) {
                            payload.caption = captionText;
                        }

                        if (videoWidth) {
                            payload.width = videoWidth;
                        }

                        if (videoHeight) {
                            payload.height = videoHeight;
                        }

                        const node = $createVideoNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}

function getCardWidth(domNode: HTMLElement): string {
    if (domNode.classList.contains('kg-width-full')) {
        return 'full';
    } else if (domNode.classList.contains('kg-width-wide')) {
        return 'wide';
    } else {
        return 'regular';
    }
}
