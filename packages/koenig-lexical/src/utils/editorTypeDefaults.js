import {VISIBILITY_SETTINGS} from './visibility';

const EDITOR_TYPE_DEFAULTS = {
    email: {
        visibilitySettings: VISIBILITY_SETTINGS.EMAIL_ONLY,
        image: {
            allowedWidths: ['regular']
        },
        isTKEnabled: false
    }
};

export function getEditorTypeDefaults(editorType) {
    return EDITOR_TYPE_DEFAULTS[editorType] || {};
}
