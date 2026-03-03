import {VISIBILITY_SETTINGS} from './visibility';

/**
 * Currenntly only email is supported.
 * @typedef {'email'} EditorType
 */

/**
 * @typedef {Object} ImageConfig
 * @property {('regular' | 'wide' | 'full')[]} [allowedWidths]
 */

/**
 * @typedef {Object} EditorTypeDefaults
 * @property {string} [visibilitySettings] - Controls which visibility panels (web/email) are shown
 * @property {ImageConfig} [image] - Image card configuration
 */

/** @type {Partial<Record<EditorType, EditorTypeDefaults>>} */
const EDITOR_TYPE_DEFAULTS = {
    email: {
        visibilitySettings: VISIBILITY_SETTINGS.EMAIL_ONLY,
        image: {
            allowedWidths: ['regular']
        }
    }
};

/**
 * Returns default cardConfig values for the given editor type.
 * These are applied in KoenigComposer and can be overridden by explicit cardConfig values.
 *
 * @param {EditorType} editorType
 * @returns {EditorTypeDefaults}
 */
export function getEditorTypeDefaults(editorType) {
    return EDITOR_TYPE_DEFAULTS[editorType] || {};
}
