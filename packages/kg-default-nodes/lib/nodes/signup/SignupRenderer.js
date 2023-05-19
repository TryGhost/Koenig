import {addCreateDocumentOption} from '../../utils/add-create-document-option';

// TODO this is a placeholder, we need to figure out what the signup card should look like and
// which elements should be customizable inside the editor
// ref https://ghost.org/docs/themes/members#signup-forms

function cardTemplate({nodeData, node}) {
    const cardClasses = getCardClasses(node).join(' ');

    return `
    <div class="${cardClasses}" data-lexical-signup-form style="display:none;">
        <div class="kg-signup-card-container" style="background-color: ${nodeData.backgroundColor};">
            <h1 style="color: ${nodeData.textColor};">${nodeData.header}</h1>
            <h2 style="color: ${nodeData.textColor};">${nodeData.subheader}</h2>
            <form data-members-form="" style="background-image: url(${nodeData.backgroundImageSrc});">
                <input style="border-color: ${nodeData.buttonColor};" id="email" data-members-email="" type="email" required="true" />
                <button type="submit" style="background-color: ${nodeData.buttonColor}; color: ${nodeData.buttonTextColor};">${nodeData.buttonText || 'Subscribe'}</button>
            </form>
            <p style="color: ${nodeData.textColor};">${nodeData.disclaimer}</p>
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

export function getCardClasses(node) {
    let cardClasses = ['kg-card kg-signup-card'];

    if (node.getCardWidth()) {
        cardClasses.push(`kg-width-${node.getCardWidth()}`);
    }

    return cardClasses;
}