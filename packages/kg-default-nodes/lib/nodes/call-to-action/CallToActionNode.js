// eslint-disable-next-line ghost/filenames/match-exported-class
import {generateDecoratorNode} from '../../generate-decorator-node';
import {renderCallToActionNode} from './calltoaction-renderer';

export class CallToActionNode extends generateDecoratorNode({
    nodeType: 'call-to-action',
    hasVisibility: true,
    properties: [
        {name: 'layout', default: 'minimal'},
        {name: 'textValue', default: '', wordCount: true},
        {name: 'showButton', default: true},
        {name: 'buttonText', default: 'Learn more'},
        {name: 'buttonUrl', default: ''},
        {name: 'buttonColor', default: '#000000'}, // Where colour is customisable, we should use hex values
        {name: 'buttonTextColor', default: '#ffffff'},
        {name: 'hasSponsorLabel', default: true},
        {name: 'sponsorLabel', default: '<p><span style="white-space: pre-wrap;">SPONSORED</span></p>'},
        {name: 'backgroundColor', default: 'grey'}, // Since this is one of a few fixed options, we stick to colour names.
        {name: 'imageUrl', default: ''},
        {name: 'imageWidth', default: null},
        {name: 'imageHeight', default: null}
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
