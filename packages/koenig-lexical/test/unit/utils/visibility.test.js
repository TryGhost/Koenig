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

    it('returns "Visible to all" only when everything is visible', function () {
        // When everything is true, it should be "Visible to all"
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Visible to all');

        // If any toggle is false, it should be "Hidden from specific people"
        defaultVisibility.web.paidMembers = false;
        const labelWithOneFalse = getVisibilityLabel(defaultVisibility);
        expect(labelWithOneFalse).toEqual('Hidden from specific people');
    });

    it('returns "Hidden from specific people" when any toggle is false', function () {
        defaultVisibility.web.nonMembers = false;
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Hidden from specific people');
    });

    it('returns correct visibility label when hidden on web (stripe enabled)', function () {
        defaultVisibility.web.nonMembers = false;
        defaultVisibility.web.freeMembers = false;
        defaultVisibility.web.paidMembers = false;
        const label = getVisibilityLabel(defaultVisibility);

        expect(label).toEqual('Hidden on web');
    });

    it('returns correct visibility label when hidden on web (stripe disabled)', function () {
        defaultVisibility.web.nonMembers = false;
        const label = getVisibilityLabel(defaultVisibility, {isStripeEnabled: false});

        expect(label).toEqual('Hidden on web');
    });

    it('return correct visibility label when hidden from specific people', function () {
        defaultVisibility.web.freeMembers = true;
        defaultVisibility.web.paidMembers = false;
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Hidden from specific people');
    });

    it('return correct visibility label when hidden from free members', function () {
        defaultVisibility.web.freeMembers = false;
        const label = getVisibilityLabel(defaultVisibility);
        expect(label).toEqual('Hidden from specific people');
    });

    it('return correct visibility label when hidden from specific people', function () {
        defaultVisibility.web.nonMembers = false;
        const label = getVisibilityLabel(defaultVisibility, {isStripeEnabled: false});
        expect(label).toEqual('Hidden from specific people');
    });

    describe('Web visibility combinations (Stripe enabled)', () => {
        it('returns "Hidden from specific people" when only public visitors can see', function () {
            defaultVisibility.web.nonMembers = true;
            defaultVisibility.web.freeMembers = false;
            defaultVisibility.web.paidMembers = false;
            const label = getVisibilityLabel(defaultVisibility);
            expect(label).toEqual('Hidden from specific people');
        });

        it('returns "Hidden from specific people" when only free members can see', function () {
            defaultVisibility.web.nonMembers = false;
            defaultVisibility.web.freeMembers = true;
            defaultVisibility.web.paidMembers = false;
            const label = getVisibilityLabel(defaultVisibility);
            expect(label).toEqual('Hidden from specific people');
        });

        it('returns "Hidden from specific people" when only paid members can see', function () {
            defaultVisibility.web.nonMembers = false;
            defaultVisibility.web.freeMembers = false;
            defaultVisibility.web.paidMembers = true;
            const label = getVisibilityLabel(defaultVisibility);
            expect(label).toEqual('Hidden from specific people');
        });
    });

    describe('Web visibility combinations (Stripe disabled)', () => {
        it('returns "Hidden from specific people" when only public visitors can see (Stripe disabled)', function () {
            defaultVisibility.web.nonMembers = true;
            defaultVisibility.web.freeMembers = false;
            defaultVisibility.web.paidMembers = false;
            const label = getVisibilityLabel(defaultVisibility, {isStripeEnabled: false});
            expect(label).toEqual('Hidden from specific people');
        });

        it('returns "Hidden from specific people" when only free members can see (Stripe disabled)', function () {
            defaultVisibility.web.nonMembers = false;
            defaultVisibility.web.freeMembers = true;
            defaultVisibility.web.paidMembers = false;
            const label = getVisibilityLabel(defaultVisibility, {isStripeEnabled: false});
            expect(label).toEqual('Hidden from specific people');
        });
    });

    // it('returns correct visibility label when hidden in email', function () {
    //     defaultVisibility.email.freeMembers = false;
    //     defaultVisibility.email.paidMembers = false;
    //     const label = getVisibilityLabel(defaultVisibility);

    //     expect(label).toEqual('Hidden in email newsletter');
    // });
});