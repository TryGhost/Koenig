// eslint-disable-next-line ghost/filenames/match-exported-class
import {generateDecoratorNode} from '../../generate-decorator-node';
import {renderCallToActionNode} from './calltoaction-renderer';

export class CallToActionNode extends generateDecoratorNode({
    nodeType: 'call-to-action',
    hasVisibility: true,
    properties: [
        {name: 'layout', default: 'minimal'},
        {name: 'textValue', default: '', wordCount: true},
        {name: 'showButton', default: false},
        {name: 'buttonText', default: ''},
        {name: 'buttonUrl', default: ''},
        {name: 'buttonColor', default: ''},
        {name: 'buttonTextColor', default: ''},
        {name: 'hasSponsorLabel', default: true},
        {name: 'sponsorLabel', default: '<p><span style="white-space: pre-wrap;">SPONSORED</span></p>'},
        {name: 'backgroundColor', default: 'grey'},
        {name: 'hasImage', default: false},
        {name: 'imageUrl', default: ''},
        {name: 'imageWidth', default: null},
        {name: 'imageHeight', default: null},
        {name: 'href', default: '', urlType: 'url'}
    ]
}) {
    /* overrides */
    exportDOM(options = {}) {
        return renderCallToActionNode(this, options);
    }
}

export const $createCallToActionNode = (dataset) => {
    return new CallToActionNode(dataset);
};

export const $isCallToActionNode = (node) => {
    return node instanceof CallToActionNode;
};
