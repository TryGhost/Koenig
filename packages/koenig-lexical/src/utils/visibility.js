import {utils} from '@tryghost/kg-default-nodes';

export function parseVisibilityToToggles(visibility) {
    return {
        web: {
            nonMembers: visibility.web.nonMember,
            freeMembers: visibility.web.memberSegment.indexOf('status:free') !== -1,
            paidMembers: visibility.web.memberSegment.indexOf('status:-free') !== -1
        },
        email: {
            freeMembers: visibility.email.memberSegment.indexOf('status:free') !== -1,
            paidMembers: visibility.email.memberSegment.indexOf('status:-free') !== -1
        }
    };
}

export function serializeTogglesToVisibility(toggles) {
    const webSegments = [];
    if (toggles.web.freeMembers) {
        webSegments.push('status:free');
    }
    if (toggles.web.paidMembers) {
        webSegments.push('status:-free');
    }

    const emailSegments = [];
    if (toggles.email.freeMembers) {
        emailSegments.push('status:free');
    }
    if (toggles.email.paidMembers) {
        emailSegments.push('status:-free');
    }

    return {
        web: {
            nonMember: toggles.web.nonMembers,
            memberSegment: webSegments.join(',')
        },
        email: {
            memberSegment: emailSegments.join(',')
        }
    };
}

// used for building UI
export function getVisibilityOptions(visibility, {isStripeEnabled = true, showWeb = true, showEmail = true} = {}) {
    visibility = visibility || utils.visibility.buildDefaultVisibility();
    const toggles = parseVisibilityToToggles(visibility);

    // use arrays to ensure consistent order when using to build UI
    const options = [
        {
            label: 'Web',
            key: 'web',
            toggles: [
                {key: 'nonMembers', label: 'Public visitors', checked: toggles.web.nonMembers},
                {key: 'freeMembers', label: 'Free members', checked: toggles.web.freeMembers},
                {key: 'paidMembers', label: 'Paid members', checked: toggles.web.paidMembers}
            ]
        },
        {
            label: 'Email',
            key: 'email',
            toggles: [
                {key: 'freeMembers', label: 'Free members', checked: toggles.email.freeMembers},
                {key: 'paidMembers', label: 'Paid members', checked: toggles.email.paidMembers}
            ]
        }
    ];

    if (!isStripeEnabled) {
        options[0].toggles = options[0].toggles.filter(t => t.key !== 'paidMembers');
        options[1].toggles = options[1].toggles.filter(t => t.key !== 'paidMembers');
    }

    return options.filter((option) => {
        if (option.key === 'web') {
            return showWeb;
        }

        if (option.key === 'email') {
            return showEmail;
        }

        return true;
    });
}

export function serializeOptionsToVisibility(options, existingVisibility = utils.visibility.buildDefaultVisibility()) {
    const existingToggles = parseVisibilityToToggles(existingVisibility);
    const webToggles = options.find(group => group.key === 'web')?.toggles ?? [];
    const emailToggles = options.find(group => group.key === 'email')?.toggles ?? [];
    const isChecked = (toggles, key, fallback) => toggles.find(t => t.key === key)?.checked ?? fallback;

    const webSegments = [];
    if (isChecked(webToggles, 'freeMembers', existingToggles.web.freeMembers)) {
        webSegments.push('status:free');
    }
    if (isChecked(webToggles, 'paidMembers', existingToggles.web.paidMembers)) {
        webSegments.push('status:-free');
    }

    const emailSegments = [];
    if (isChecked(emailToggles, 'freeMembers', existingToggles.email.freeMembers)) {
        emailSegments.push('status:free');
    }
    if (isChecked(emailToggles, 'paidMembers', existingToggles.email.paidMembers)) {
        emailSegments.push('status:-free');
    }

    return {
        web: {
            nonMember: isChecked(webToggles, 'nonMembers', existingToggles.web.nonMembers),
            memberSegment: webSegments.join(',')
        },
        email: {
            memberSegment: emailSegments.join(',')
        }
    };
}
