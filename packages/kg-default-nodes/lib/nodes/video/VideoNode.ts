/* eslint-disable ghost/filenames/match-exported-class */
import {DOMConversionMap, LexicalNode} from 'lexical';
import {KoenigDecoratorNodeProperties, generateDecoratorNode} from '../../generate-decorator-node';
import {parseVideoNode} from './video-parser';
import {renderVideoNode} from './video-renderer';

export type VideoNodeDataset = {
    src?: string;
    caption?: string;
    fileName?: string;
    mimeType?: string;
    width?: number;
    height?: number;
    duration?: number;
    thumbnailSrc?: string;
    customThumbnailSrc?: string;
    thumbnailWidth?: number;
    thumbnailHeight?: number;
    cardWidth?: string;
    loop?: boolean;
};

type VideoNodeProps = {
    nodeType: 'video';
    properties: KoenigDecoratorNodeProperties;
};

const videoNodeProps: VideoNodeProps = {
    nodeType: 'video',
    properties: [
        {name: 'src', default: '', urlType: 'url'},
        {name: 'caption', default: '', urlType: 'html', wordCount: true},
        {name: 'fileName', default: ''},
        {name: 'mimeType', default: ''},
        {name: 'width', default: null},
        {name: 'height', default: null},
        {name: 'duration', default: 0},
        {name: 'thumbnailSrc', default: '', urlType: 'url'},
        {name: 'customThumbnailSrc', default: '', urlType: 'url'},
        {name: 'thumbnailWidth', default: null},
        {name: 'thumbnailHeight', default: null},
        {name: 'cardWidth', default: 'regular'},
        {name: 'loop', default: false}
    ]
};

export class VideoNode extends generateDecoratorNode(videoNodeProps) {
    /* override */
    exportJSON() {
        // checks if src is a data string
        const {src, caption, fileName, mimeType, width, height, duration, thumbnailSrc, customThumbnailSrc, thumbnailWidth, thumbnailHeight, cardWidth, loop} = this;
        const isBlob = src.startsWith('data:');

        const dataset = {
            type: 'video',
            version: 1,
            src: isBlob ? '<base64String>' : src,
            caption,
            fileName,
            mimeType,
            width,
            height,
            duration,
            thumbnailSrc,
            customThumbnailSrc,
            thumbnailWidth,
            thumbnailHeight,
            cardWidth,
            loop
        };
        return dataset;
    }

    static importDOM(): DOMConversionMap | null {
        return parseVideoNode();
    }

    exportDOM(options = {}) {
        return renderVideoNode(this, options);
    }

    get formattedDuration() {
        const minutes = Math.floor(this.duration / 60);
        const seconds = Math.floor(this.duration - (minutes * 60));
        const paddedSeconds = String(seconds).padStart(2, '0');
        const formattedDuration = `${minutes}:${paddedSeconds}`;
        return formattedDuration;
    }
}

export const $createVideoNode = (dataset: VideoNodeDataset) => {
    return new VideoNode(dataset);
};

export function $isVideoNode(node: LexicalNode) {
    return node instanceof VideoNode;
}
