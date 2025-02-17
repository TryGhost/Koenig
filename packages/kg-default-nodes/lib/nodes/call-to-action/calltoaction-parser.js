import {rgbToHex} from '../../utils/rgb-to-hex';

export function parseCallToActionNode(CallToActionNode) {
    return {
        div: (nodeElem) => {
            const isCallToActionCard = nodeElem.classList?.contains('kg-cta-card');
            if (isCallToActionCard) {
                return {
                    conversion(domNode) {
                        const layout = domNode.classList?.contains('kg-cta-minimal') ? 'minimal' : 'immersive';
                        const textValue = domNode.querySelector('.kg-cta-text').innerHTML.trim() || '';
                        const showButton = !!domNode.querySelector('.kg-cta-button');
                        const buttonText = domNode.querySelector('.kg-cta-button')?.innerHTML.trim() || '';
                        const buttonUrl = domNode.querySelector('.kg-cta-button')?.getAttribute('href') || '';
                        const buttonColor = domNode.querySelector('.kg-cta-button')?.style.backgroundColor || '';
                        const buttonTextColor = domNode.querySelector('.kg-cta-button')?.style.color || '';
                        const backgroundColor = domNode.classList?.value?.match(/kg-cta-bg-(\w+)/)[1];
                        const hasSponsorLabel = domNode.querySelector('.kg-cta-sponsor-label') ? true : false;
                        const sponsorLabel = '';
                        const imageElement = domNode.querySelector('.kg-cta-image');
                        const hasImage = !!imageElement;
                        const imageUrl = imageElement?.getAttribute('src') || '';
                        const imageWidth = imageElement?.getAttribute('data-image-width') || '';
                        const imageHeight = imageElement?.getAttribute('data-image-height') || '';
                        const linkElement = domNode.querySelector('a[data-cta-link]');
                        const href = linkElement ? linkElement.getAttribute('href') : '';
                        const payload = {
                            layout,
                            textValue,
                            showButton,
                            buttonText,
                            buttonUrl,
                            buttonColor: rgbToHex(buttonColor) || '#ffffff',
                            buttonTextColor: rgbToHex(buttonTextColor) || '#000000',
                            backgroundColor,
                            hasSponsorLabel,
                            sponsorLabel,
                            hasImage,
                            imageUrl,
                            imageWidth,
                            imageHeight,
                            href
                        };

                        const node = new CallToActionNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}
