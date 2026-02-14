import clsx from 'clsx';
import {html} from '../tagged-template-fns.mjs';

/**
 * @param {Object} options
 * @param {string} [options.alignment]
 * @param {string} [options.color='accent']
 * @param {string} [options.text='']
 * @param {string} [options.textColor='#ffffff']
 * @param {string} [options.url='']
 * @returns {string}
 */
export function renderEmailButton({
    alignment = '',
    color = 'accent',
    text = '',
    textColor = '#ffffff',
    url = ''
} = {}) {
    const buttonClasses = clsx(
        'btn',
        color === 'accent' && 'btn-accent'
    );
    const buttonStyle = color !== 'accent' ? ` style="background-color: ${color};"` : '';
    const textStyle = (textColor && (color !== 'accent' || textColor !== '#ffffff')) ? ` style="color: ${textColor};"` : '';

    return html`
        <table class="${buttonClasses}" border="0" cellspacing="0" cellpadding="0" align="${alignment}">
            <tbody>
                <tr>
                    <td align="center"${buttonStyle}>
                        <a href="${url}"${textStyle}>${text}</a>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}
