import {addCreateDocumentOption} from '../../utils/add-create-document-option';
import {renderWithVisibility} from '../../utils/visibility';

// TODO - this is a placeholder for the cta card web template
function ctaCardTemplate(dataset) {
    // Add validation for buttonColor
    if (!dataset.buttonColor || !dataset.buttonColor.match(/^[a-zA-Z\d-]+$/)) {
        dataset.buttonColor = 'accent';
    }

    const buttonAccent = dataset.buttonColor === 'accent' ? 'kg-style-accent' : '';
    const buttonStyle = dataset.buttonColor === 'accent' 
        ? `style="color: ${dataset.buttonTextColor};"` 
        : `style="background-color: ${dataset.buttonColor}; color: ${dataset.buttonTextColor};"`;

    return `
        <div class="kg-card kg-cta-card kg-cta-bg-${dataset.backgroundColor} kg-cta-${dataset.layout}" data-layout="${dataset.layout}">
            ${dataset.hasSponsorLabel ? `
                <div class="kg-cta-sponsor-label">
                    Sponsored
                </div>
            ` : ''}
            <div class="kg-cta-content">
                ${dataset.hasImage ? `
                    <div class="kg-cta-image-container">
                        <img src="${dataset.imageUrl}" alt="CTA Image">
                    </div>
                ` : ''}
                <div class="kg-cta-content-inner">
                    <div class="kg-cta-text">
                        ${dataset.textValue}
                    </div>
                    ${dataset.showButton ? `
                        <a href="${dataset.buttonUrl}" class="kg-cta-button ${buttonAccent}"
                        ${buttonStyle}>
                            ${dataset.buttonText}
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// TODO - this is a placeholder for the email template
function emailCTATemplate(dataset) {
    const buttonStyle = dataset.buttonColor !== 'accent' ? `background-color: ${dataset.buttonColor};` : '';
    const backgroundStyle = `background-color: ${dataset.backgroundColor};`;

    return `
        <div class="cta-card-email" style="${backgroundStyle} padding: 16px; text-align: center; border-radius: 8px;">
            ${dataset.hasImage ? `<img src="${dataset.imageUrl}" alt="CTA Image" style="max-width: 100%; border-radius: 4px;">` : ''}
            <div class="cta-text" style="margin-top: 12px; color: ${dataset.textColor};">
                ${dataset.textValue}
            </div>
            ${dataset.showButton ? `
                <a href="${dataset.buttonUrl}" class="cta-button"
                   style="display: inline-block; margin-top: 12px; padding: 10px 16px;
                          ${buttonStyle} color: ${dataset.buttonTextColor}; text-decoration: none;
                          border-radius: 4px;">
                    ${dataset.buttonText}
                </a>
            ` : ''}
            ${dataset.hasSponsorLabel ? `
                <div class="sponsor-label" style="margin-top: 8px; font-size: 12px; color: #888;">
                    Sponsored
                </div>
            ` : ''}
        </div>
    `;
}

export function renderCallToActionNode(node, options = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument();

    const dataset = {
        layout: node.layout,
        textValue: node.textValue,
        showButton: node.showButton,
        buttonText: node.buttonText,
        buttonUrl: node.buttonUrl,
        buttonColor: node.buttonColor,
        buttonTextColor: node.buttonTextColor,
        hasSponsorLabel: node.hasSponsorLabel,
        backgroundColor: node.backgroundColor,
        hasImage: node.hasImage,
        imageUrl: node.imageUrl,
        textColor: node.textColor
    };

    // Add validation for backgroundColor
    if (!dataset.backgroundColor || !dataset.backgroundColor.match(/^[a-zA-Z\d-]+$/)) {
        dataset.backgroundColor = 'white';
    }

    if (options.target === 'email') {
        const emailDoc = options.createDocument();
        const emailDiv = emailDoc.createElement('div');

        emailDiv.innerHTML = emailCTATemplate(dataset, options);

        return renderWithVisibility({element: emailDiv.firstElementChild}, node.visibility, options);
    }

    const htmlString = ctaCardTemplate(dataset);
    const element = document.createElement('div');
    element.innerHTML = htmlString?.trim();

    return renderWithVisibility({element: element.firstElementChild}, node.visibility, options);
}
