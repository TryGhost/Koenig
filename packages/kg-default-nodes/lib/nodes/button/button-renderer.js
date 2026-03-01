import {addCreateDocumentOption} from '../../utils/add-create-document-option';
import {renderEmptyContainer} from '../../utils/render-empty-container';
import {renderEmailButton} from '../../utils/render-helpers/email-button';
import {html} from '../../utils/tagged-template-fns.mjs';

export function renderButtonNode(node, options = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument();

    if (!node.buttonUrl || node.buttonUrl.trim() === '') {
        return renderEmptyContainer(document);
    }

    if (options.target === 'email') {
        return emailTemplate(node, options, document);
    } else {
        return frontendTemplate(node, document);
    }
}

function frontendTemplate(node, document) {
    const cardClasses = getCardClasses(node);
    const buttonClasses = getButtonClasses(node);
    const buttonStyle = getButtonStyle(node);

    const cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', cardClasses);

    const button = document.createElement('a');
    button.setAttribute('href', node.buttonUrl);
    button.setAttribute('class', buttonClasses);
    if (buttonStyle) {
        button.setAttribute('style', buttonStyle);
    }
    button.textContent = node.buttonText || 'Button Title';

    cardDiv.appendChild(button);
    return {element: cardDiv};
}

function emailTemplate(node, options, document) {
    const {buttonUrl, buttonText, buttonColor = 'accent', buttonTextColor = '#ffffff'} = node;
    const buttonClasses = buttonColor === 'accent' ? 'btn btn-accent' : 'btn';
    const buttonStyle = buttonColor !== 'accent' ? `style="background-color: ${buttonColor};"` : '';
    const textStyle = (buttonTextColor && (buttonColor !== 'accent' || buttonTextColor !== '#ffffff')) ? `style="color: ${buttonTextColor};"` : '';

    let cardHtml;
    if (options.feature?.emailCustomization) {
        cardHtml = html`
        <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    <table class="${buttonClasses}" border="0" cellspacing="0" cellpadding="0" align="${node.alignment}">
                        <tr>
                            <td align="center" ${buttonStyle}>
                                <a href="${buttonUrl}" ${textStyle}>${buttonText}</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`;

        const element = document.createElement('p');
        element.innerHTML = cardHtml;
        return {element};
    } else if (options.feature?.emailCustomizationAlpha) {
        const buttonHtml = renderEmailButton({
            alignment: node.alignment,
            color: buttonColor,
            url: buttonUrl,
            text: buttonText,
            textColor: buttonTextColor
        });

        cardHtml = html`
        <table border="0" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td>
                        ${buttonHtml}
                    </td>
                </tr>
            </tbody>
        </table>
        `;

        const element = document.createElement('div');
        element.innerHTML = cardHtml;
        return {element, type: 'inner'};
    } else {
        const wrapperStyle = buttonColor !== 'accent' ? `style="background-color: ${buttonColor};"` : '';
        const wrapperClass = buttonColor === 'accent' ? 'btn btn-accent' : 'btn';
        cardHtml = html`
        <div class="${wrapperClass}" ${wrapperStyle}>
            <table border="0" cellspacing="0" cellpadding="0" align="${node.alignment}">
                <tr>
                    <td align="center">
                        <a href="${buttonUrl}" ${textStyle}>${buttonText}</a>
                    </td>
                </tr>
            </table>
        </div>
        `;

        const element = document.createElement('p');
        element.innerHTML = cardHtml;
        return {element};
    }
}

function getCardClasses(node) {
    let cardClasses = ['kg-card kg-button-card'];

    if (node.alignment) {
        cardClasses.push(`kg-align-${node.alignment}`);
    }

    return cardClasses.join(' ');
}

function getButtonClasses(node) {
    const buttonClasses = ['kg-btn'];

    if (node.buttonColor === 'accent' || !node.buttonColor) {
        buttonClasses.push('kg-btn-accent');
    }

    return buttonClasses.join(' ');
}

function getButtonStyle(node) {
    const styles = [];

    if (node.buttonColor && node.buttonColor !== 'accent') {
        styles.push(`background-color: ${node.buttonColor}`);
    }

    if (node.buttonTextColor && (node.buttonColor !== 'accent' || node.buttonTextColor !== '#ffffff')) {
        styles.push(`color: ${node.buttonTextColor}`);
    }

    return styles.join('; ');
}
