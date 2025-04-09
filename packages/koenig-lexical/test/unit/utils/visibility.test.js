import {beforeEach, expect} from 'vitest';
import {
    getVisibilityLabel,
    getVisibilityOptions,
    parseVisibilityToToggles
} from '../../../src/utils/visibility';

describe('parseVisibilityToToggles', function () {
    it('should return correct truthy toggles based on the visibility object', function () {
        const visibility = {
            web: {
                nonMember: true,
                memberSegment: 'status:free,status:-free'
            },
            email: {
                memberSegment: 'status:free,status:-free'
            }
        };

        const result = parseVisibilityToToggles(visibility);

        expect(result).toEqual({
            web: {
                nonMembers: true,
                freeMembers: true,
                paidMembers: true
            },
            email: {
                freeMembers: true,
                paidMembers: true
            }
        });
    });

    it('should return correct falsy toggles based on the visibility object', function () {
        const visibility = {
            web: {
                nonMember: false,
                memberSegment: ''
            },
            email: {
                memberSegment: ''
            }
        };

        const result = parseVisibilityToToggles(visibility);

        expect(result).toEqual({
            web: {
                nonMembers: false,
                freeMembers: false,
                paidMembers: false
            },
            email: {
                freeMembers: false,
                paidMembers: false
            }
        });
    });

    it('handles partial member segments', function () {
        const visibility = {
            web: {
                nonMember: false,
                memberSegment: 'status:free'
            },
            email: {
                memberSegment: 'status:-free'
            }
        };

        const result = parseVisibilityToToggles(visibility);

        expect(result).toEqual({
            web: {
                nonMembers: false,
                freeMembers: true,
                paidMembers: false
            },
            email: {
                freeMembers: false,
                paidMembers: true
            }
        });
    });
});

describe('getVisibilityOptions', function () {
    it('has correct default options', function () {
        const options = getVisibilityOptions();

        expect(options).toEqual([
            {
                label: 'Web',
                key: 'web',
                toggles: [
                    {key: 'nonMembers', label: 'Public visitors', checked: true},
                    {key: 'freeMembers', label: 'Free members', checked: true},
                    {key: 'paidMembers', label: 'Paid members', checked: true}
                ]
            },
            {
                label: 'Email',
                key: 'email',
                toggles: [
                    {key: 'freeMembers', label: 'Free members', checked: true},
                    {key: 'paidMembers', label: 'Paid members', checked: true}
                ]
            }
        ]);
    });

    it('removes paid options if stripe is disabled', function () {
        const options = getVisibilityOptions(undefined, {isStripeEnabled: false});

        expect(options).toEqual([
            {
                label: 'Web',
                key: 'web',
                toggles: [
                    {key: 'nonMembers', label: 'Public visitors', checked: true},
                    {key: 'freeMembers', label: 'Free members', checked: true}
                ]
            },
            {
                label: 'Email',
                key: 'email',
                toggles: [
                    {key: 'freeMembers', label: 'Free members', checked: true}
                ]
            }
        ]);
    });

    it('updates option checked values based on visibility', function () {
        const visibility = {
            web: {
                nonMember: false,
                memberSegment: 'status:free'
            },
            email: {
                memberSegment: 'status:-free'
            }
        };

        const options = getVisibilityOptions(visibility);

        expect(options).toEqual([
            {
                label: 'Web',
                key: 'web',
                toggles: [
                    {key: 'nonMembers', label: 'Public visitors', checked: false},
                    {key: 'freeMembers', label: 'Free members', checked: true},
                    {key: 'paidMembers', label: 'Paid members', checked: false}
                ]
            },
            {
                label: 'Email',
                key: 'email',
                toggles: [
                    {key: 'freeMembers', label: 'Free members', checked: false},
                    {key: 'paidMembers', label: 'Paid members', checked: true}
                ]
            }
        ]);
    });
});

describe('getVisibilityLabel', function () {
    let defaultVisibility;

    beforeEach(() => {
        defaultVisibility = {
            web: {
                nonMembers: true,
                freeMembers: true,
                paidMembers: true
            },
            email: {
                freeMembers: true,
                paidMembers: true
            }
        };
    });

    it('returns "Hidden from specific people" when any single toggle is false', function () {
        defaultVisibility.web.nonMembers = false;
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Hidden from specific people');
    });

    it('returns "Hidden on email" when email toggle is false', function () {
        defaultVisibility.email.freeMembers = false;
        defaultVisibility.email.paidMembers = false;
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Hidden in email newsletters');
    });

    it('returns "Hidden on web" when all web toggles are false', function () {
        defaultVisibility.web.nonMembers = false;
        defaultVisibility.web.freeMembers = false;
        defaultVisibility.web.paidMembers = false;
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Hidden on web');
    });

    it('returns undefined when everything is visible', function () {
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual(''); // No "hidden" state
    });

    it('returns "Hidden from specific people" when only one email toggle is false', function () {
        defaultVisibility.email.freeMembers = false;
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Hidden from specific people');
    });

    it('returns "Hidden from specific people" when mixed partial visibility on web and email', function () {
        defaultVisibility.web.freeMembers = false;
        defaultVisibility.email.paidMembers = false;
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Hidden from specific people');
    });

    it('returns "Hidden from specific people" when everything is hidden except one group', function () {
        defaultVisibility.web.nonMembers = false;
        defaultVisibility.web.freeMembers = false;
        defaultVisibility.web.paidMembers = true; // One visible
        defaultVisibility.email.freeMembers = false;
        defaultVisibility.email.paidMembers = false;
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Hidden from specific people');
    });

    it('returns "Hidden from specific people" when everything is hidden', function () {
        defaultVisibility.web.nonMembers = false;
        defaultVisibility.web.freeMembers = false;
        defaultVisibility.web.paidMembers = false;
        defaultVisibility.email.freeMembers = false;
        defaultVisibility.email.paidMembers = false;
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Hidden from specific people');
    });

    it('returns "Hidden in email and for members on web" when card is a signup card', function () {
        const label = getVisibilityLabel({}, 'signup');
        expect(label).toEqual('Hidden in email and for members on web');
    });

    it('returns "Hidden on web" when card is an email card', function () {
        const label = getVisibilityLabel({}, 'email');
        expect(label).toEqual('Hidden on web');
    });
});
