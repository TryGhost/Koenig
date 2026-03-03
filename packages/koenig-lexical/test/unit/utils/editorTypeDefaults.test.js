import {VISIBILITY_SETTINGS} from '../../../src/utils/visibility';
import {describe, expect, it} from 'vitest';
import {getEditorTypeDefaults} from '../../../src/utils/editorTypeDefaults';

describe('getEditorTypeDefaults', () => {
    it('returns email defaults for email editor type', () => {
        const defaults = getEditorTypeDefaults('email');
        expect(defaults).toEqual({
            visibilitySettings: VISIBILITY_SETTINGS.EMAIL_ONLY,
            image: {
                allowedWidths: ['regular']
            },
            isTKEnabled: false
        });
    });

    it('returns empty object for unknown editor type', () => {
        expect(getEditorTypeDefaults('unknown')).toEqual({});
    });

    it('returns empty object for undefined editor type', () => {
        expect(getEditorTypeDefaults(undefined)).toEqual({});
    });

    it('returns empty object for full editor type (no overrides needed)', () => {
        expect(getEditorTypeDefaults('full')).toEqual({});
    });
});
