import {addCreateDocumentOption} from '../../utils/add-create-document-option';

// TODO this is a placeholder, we need to figure out what the signup card should look like and
// which elements should be customizable inside the editor
// ref https://ghost.org/docs/themes/members#signup-forms

function cardTemplate(nodeData) {
    const cardClasses = getCardClasses(nodeData).join(' ');

    return `
    <div class="${cardClasses}" data-lexical-signup-form style="display:none;">
        <div class="kg-signup-card-container" style="background-color: ${nodeData.backgroundColor}; background-image: url(${nodeData.backgroundImageSrc});">
            <h2 class="kg-signup-card-heading" style="color: ${nodeData.textColor};">${nodeData.header}</h2>
            <h3 class="kg-signup-card-subheading" style="color: ${nodeData.textColor};">${nodeData.subheader}</h3>
            <form class="kg-signup-card-form" data-members-form="">
                <input class="kg-signup-card-input" style="border-color: ${nodeData.buttonColor};" id="email" data-members-email="" type="email" required="true" placeholder="yourname@example.com" />
                <button class="kg-signup-card-button" style="background-color: ${nodeData.buttonColor}; color: ${nodeData.buttonTextColor};" type="submit">${nodeData.buttonText || 'Subscribe'}</button>
            </form>
            <p class="kg-signup-card-disclaimer" style="color: ${nodeData.textColor};">${nodeData.disclaimer}</p>
        </div>
    </div>
    `;
}

export function renderSignupCardToDOM(dataset, options = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument();

    const node = {
        alignment: dataset.__alignment,
        buttonText: dataset.__buttonText,
        header: dataset.__header,
        subheader: dataset.__subheader,
        disclaimer: dataset.__disclaimer,
        backgroundImageSrc: dataset.__backgroundImageSrc,
        backgroundColor: dataset.__backgroundColor,
        buttonColor: dataset.__buttonColor,
        labels: dataset.__labels,
        layout: dataset.__layout,
        textColor: dataset.__textColor,
        buttonTextColor: dataset.__buttonTextColor
    };

    const htmlString = options.target === 'email'
        ? ''
        : cardTemplate(node);

    const element = document.createElement('div');
    element.innerHTML = htmlString?.trim();
    return element.firstElementChild;
}

export function getCardClasses(nodeData) {
    let cardClasses = ['kg-card kg-signup-card'];

    if (nodeData.layout && nodeData.layout !== 'split') {
        cardClasses.push(`kg-width-${nodeData.layout}`);
    }

    if (nodeData.layout === 'split') {
        cardClasses.push('kg-layout-split kg-width-full');
    }

    return cardClasses;
}
