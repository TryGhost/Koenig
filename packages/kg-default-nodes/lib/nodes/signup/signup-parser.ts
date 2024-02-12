import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createSignupNode, SignupNodeDataset} from './SignupNode';

function rgbToHex(rgb: string): string | null {
    if (rgb === 'transparent') {
        return rgb;
    }

    try {
        // Extract the red, green, and blue values from the RGB string
        const match = rgb.match(/\d+/g);
        if (!match) {
            return null;
        }
        const [r, g, b] = match;
        // Convert each component to hexadecimal
        const red = parseInt(r, 10).toString(16).padStart(2, '0');
        const green = parseInt(g, 10).toString(16).padStart(2, '0');
        const blue = parseInt(b, 10).toString(16).padStart(2, '0');
        // Concatenate the hexadecimal values
        const hex = `#${red}${green}${blue}`;
        return hex;
    } catch (e) {
        return null;
    }
}

function getLayout(domNode: HTMLElement): string {
    if (domNode.classList.contains('kg-layout-split')) {
        return 'split';
    } else if (domNode.classList.contains('kg-layout-full')) {
        return 'full';
    } else if (domNode.classList.contains('kg-layout-wide')) {
        return 'wide';
    } else {
        return 'regular';
    }
}

export function signupParser(): DOMConversionMap | null {
    return {
        div: (nodeElem: HTMLElement): DOMConversion | null => {
            const isSignupNode = nodeElem.dataset?.lexicalSignupForm === '';
            if (nodeElem.tagName === 'DIV' && isSignupNode) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput {
                        const layout = getLayout(domNode);
                        const header = domNode.querySelector('h2')?.textContent || '';
                        const subheader = domNode.querySelector('h3')?.textContent || '';
                        const disclaimer = domNode.querySelector('p')?.textContent || '';
                        const backgroundImageElement = domNode.querySelector('.kg-signup-card-image');
                        const backgroundImageSrc = backgroundImageElement?.getAttribute('src') || '';
                        const backgroundColor = domNode.style.backgroundColor || '';
                        const button = domNode.querySelector('.kg-signup-card-button') as HTMLElement;
                        const buttonColor = button.style.backgroundColor || '';
                        const buttonTextElement = domNode.querySelector('.kg-signup-card-button-default') as HTMLElement;
                        const buttonText = buttonTextElement?.textContent || '';
                        const buttonTextColor = buttonTextElement.style.color || '';
                        const successText = domNode.querySelector('.kg-signup-card-success') as HTMLElement;
                        const textColor = successText?.style.color || '';
                        const alignment = domNode.querySelector('.kg-signup-card-text')?.classList.contains('kg-align-center') ? 'center' : 'left';
                        const successMessage = domNode.querySelector('.kg-signup-card-success')?.textContent?.trim() || '';
                        const labelElements = [...domNode.querySelectorAll('input[data-members-label]')] as HTMLInputElement[];
                        const labels = labelElements.map(input => input.value);

                        const isAccentBackground = domNode.classList?.contains('kg-style-accent') ?? false;
                        const isAccentButton = domNode.querySelector('.kg-signup-card-button')?.classList?.contains('kg-style-accent') ?? false;

                        const isSwapped = domNode.classList.contains('kg-swapped');
                        const backgroundSize = domNode.classList.contains('kg-content-wide') ? 'contain' : 'cover';

                        const payload: SignupNodeDataset = {
                            layout,
                            buttonText,
                            header,
                            subheader,
                            disclaimer,
                            backgroundImageSrc,
                            backgroundSize,
                            backgroundColor: isAccentBackground ? 'accent' : (rgbToHex(backgroundColor) || '#ffffff'),
                            buttonColor: isAccentButton ? 'accent' : (rgbToHex(buttonColor) || '#ffffff'),
                            textColor: rgbToHex(textColor) || '#ffffff',
                            buttonTextColor: rgbToHex(buttonTextColor) || '#000000',
                            alignment,
                            successMessage,
                            labels,
                            swapped: isSwapped
                        };

                        const node = $createSignupNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}
