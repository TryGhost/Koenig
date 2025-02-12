import {addCreateDocumentOption} from '../../utils/add-create-document-option';
import {renderWithVisibility} from '../../utils/visibility';

// TODO - this is a placeholder for the cta card web template
function ctaCardTemplate(dataset) {
    // Add validation for buttonColor
    if (!dataset.buttonColor || !dataset.buttonColor.match(/^[a-zA-Z\d-]+|#([a-fA-F\d]{3}|[a-fA-F\d]{6})$/)) {
        dataset.buttonColor = 'accent';
    }
    console.log(dataset);
    const buttonAccent = dataset.buttonColor === 'accent' ? 'kg-style-accent' : '';
    const buttonStyle = dataset.buttonColor === 'accent'
        ? `style="color: ${dataset.buttonTextColor};"`
        : `style="background-color: ${dataset.buttonColor}; color: ${dataset.buttonTextColor};"`;
    return `
        <div class="kg-card kg-cta-card kg-cta-bg-${dataset.backgroundColor} kg-cta-${dataset.layout}" data-layout="${dataset.layout}">
            ${dataset.hasSponsorLabel ? `
                <div class="kg-cta-sponsor-label">
                    ${dataset.sponsorLabel}
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
    const buttonStyle = dataset.buttonColor === 'accent' 
        ? `color: ${dataset.buttonTextColor};` 
        : `background-color: ${dataset.buttonColor}; color: ${dataset.buttonTextColor};`;
    const backgroundStyle = `background-color: ${dataset.backgroundColor};`;

    const renderContent = () => {
        if (dataset.layout === 'minimal') {
            return `
                <tr>
                    <td class="kg-cta-content">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="kg-cta-content-wrapper">
                            <tr>
                                ${dataset.hasImage ? `
                                    <td class="kg-cta-image-container" width="64">
                                        <img src="${dataset.imageUrl}" alt="CTA Image" class="kg-cta-image" width="64">
                                    </td>
                                ` : ''}
                                <td class="kg-cta-content-inner">
                                    <div class="kg-cta-text">
                                        ${dataset.textValue}
                                    </div>
                                    ${dataset.showButton ? `
                                        <a href="${dataset.buttonUrl}" 
                                           class="kg-cta-button ${dataset.buttonColor === 'accent' ? 'kg-style-accent' : ''}"
                                           style="${buttonStyle}">
                                            ${dataset.buttonText}
                                        </a>
                                    ` : ''}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        }

        return `
            <tr>
                <td class="kg-cta-content">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="kg-cta-content-wrapper">
                        ${dataset.hasImage ? `
                            <tr>
                                <td class="kg-cta-image-container">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td>
                                                <img src="${dataset.imageUrl}" alt="CTA Image" class="kg-cta-image">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        ` : ''}
                        <tr>
                            <td class="kg-cta-text">
                                ${dataset.textValue}
                            </td>
                        </tr>
                        ${dataset.showButton ? `
                            <tr>
                                <td>
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td>
                                                <a href="${dataset.buttonUrl}" 
                                                   class="kg-cta-button ${dataset.buttonColor === 'accent' ? 'kg-style-accent' : ''}"
                                                   style="${buttonStyle}">
                                                    ${dataset.buttonText}
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        ` : ''}
                    </table>
                </td>
            </tr>
        `;
    };

    return `
        <table class="kg-card kg-cta-card kg-cta-bg-${dataset.backgroundColor} kg-cta-${dataset.layout}" border="0" cellpadding="0" cellspacing="0" width="100%" style="${backgroundStyle}">
            ${dataset.hasSponsorLabel ? `
                <tr>
                    <td class="kg-cta-sponsor-label">
                        <p>Sponsored</p>
                    </td>
                </tr>
            ` : ''}
            ${renderContent()}
        </table>
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
        sponsorLabel: node.sponsorLabel,
        hasImage: node.hasImage,
        imageUrl: node.imageUrl
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
