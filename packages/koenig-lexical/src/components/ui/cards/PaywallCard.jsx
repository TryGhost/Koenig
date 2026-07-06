import PropTypes from 'prop-types';
import {DropdownSetting, InputSetting} from '../SettingsPanel';

function Divider({gate}) {
    return (
        <div className="flex h-3 items-center whitespace-pre text-center font-sans text-2xs font-semibold uppercase text-grey-500 before:mr-2 before:flex-1 before:border-t before:border-grey-300 before:content-[''] after:ml-2 after:flex-1 after:border-t after:border-grey-300 dark:text-grey-800">
            Free public preview
            <span className="mx-2 text-green">↑</span>
            /
            <span className="mx-2 text-green">↓</span>
            {gate === 'members' ? 'Only visible to members' : 'Only visible to paid members'}
        </div>
    );
}

Divider.propTypes = {
    gate: PropTypes.string
};

const NO_OFFER_OPTION = {label: 'None — default signup', name: ''};

const GATE_OPTIONS = [
    {label: 'Paid members', name: 'paid'},
    {label: 'Free members — grow your list', name: 'members'}
];

export function PaywallCard({
    isEditing,
    gate = 'paid',
    heading,
    description,
    buttonText,
    offerId,
    offers = [],
    selectedOfferName,
    updateGate,
    updateHeading,
    updateDescription,
    updateButtonText,
    updateOfferId
}) {
    const isMembersGate = gate === 'members';
    const hasCustomCta = !isMembersGate && (heading || description || buttonText || offerId);

    if (isEditing) {
        const offerOptions = [NO_OFFER_OPTION, ...offers.map(offer => ({label: offer.name, name: offer.id}))];

        return (
            <div>
                <Divider gate={gate} />
                <div className="not-kg-prose mt-3 rounded border border-grey-200 bg-grey-50 p-4 font-sans dark:border-grey-900 dark:bg-grey-950" data-testid="paywall-cta-editor">
                    <div className="flex flex-col gap-3">
                        <DropdownSetting
                            dataTestId="paywall-gate-dropdown"
                            description={isMembersGate ? 'Anyone can sign up for free to keep reading' : 'A paid subscription is required to keep reading'}
                            label="Who can read past this point?"
                            menu={GATE_OPTIONS}
                            value={gate || 'paid'}
                            onChange={updateGate}
                        />
                    </div>
                    {isMembersGate ? (
                        <div className="mt-3 border-t border-grey-200 pt-3 text-xs font-normal text-grey-600 dark:border-grey-900 dark:text-grey-500" data-testid="paywall-members-note">
                            Everyone on your email list is a member, so newsletters include the full post. On your website, visitors hit your site-wide paywall and can sign up free &mdash; customize it under Settings &rarr; Membership &rarr; Paywall.
                        </div>
                    ) : (
                        <>
                            <div className="mb-3 mt-4 flex items-baseline justify-between">
                                <span className="text-sm font-semibold text-grey-900 dark:text-grey-300">Email preview message</span>
                                <span className="text-xs font-normal text-grey-600 dark:text-grey-500">Shown to free subscribers in place of the paid content</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <InputSetting
                                    dataTestId="paywall-heading-input"
                                    label="Heading"
                                    placeholder="Upgrade to continue reading."
                                    value={heading}
                                    onChange={updateHeading}
                                />
                                <InputSetting
                                    dataTestId="paywall-description-input"
                                    label="Description"
                                    placeholder="Become a paid member to get access to all premium content."
                                    value={description}
                                    onChange={updateDescription}
                                />
                                <InputSetting
                                    dataTestId="paywall-button-input"
                                    label="Button"
                                    placeholder="Upgrade"
                                    value={buttonText}
                                    onChange={updateButtonText}
                                />
                                <DropdownSetting
                                    dataTestId="paywall-offer-dropdown"
                                    description="Send readers to an offer instead of the standard signup"
                                    label="Offer"
                                    menu={offerOptions}
                                    value={offerId || ''}
                                    onChange={updateOfferId}
                                />
                            </div>
                            <div className="mt-3 border-t border-grey-200 pt-3 text-xs font-normal text-grey-600 dark:border-grey-900 dark:text-grey-500" data-testid="paywall-web-note">
                                On your website, visitors see your site-wide paywall instead &mdash; customize it under Settings &rarr; Membership &rarr; Paywall.
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <Divider gate={gate} />
            {hasCustomCta &&
                <div className="not-kg-prose mt-3 rounded border border-grey-200 p-4 text-center font-sans dark:border-grey-900" data-testid="paywall-cta-preview">
                    <div className="mb-1 text-2xs font-semibold uppercase tracking-wide text-grey-400">Email preview &mdash; free subscribers see</div>
                    <div className="text-lg font-bold text-black dark:text-grey-100">{heading || 'Upgrade to continue reading.'}</div>
                    <div className="mt-1 text-sm text-grey-700 dark:text-grey-500">{description || 'Become a paid member to get access to all premium content.'}</div>
                    <div className="mt-3 inline-block rounded bg-green px-4 py-2 text-sm font-semibold text-white">{buttonText || 'Upgrade'}</div>
                    {offerId &&
                        <div className="mt-2 text-xs font-normal text-grey-600 dark:text-grey-500" data-testid="paywall-offer-note">Button links to offer{selectedOfferName ? `: ${selectedOfferName}` : ''}</div>
                    }
                </div>
            }
        </div>
    );
}

PaywallCard.propTypes = {
    isEditing: PropTypes.bool,
    gate: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    buttonText: PropTypes.string,
    offerId: PropTypes.string,
    offers: PropTypes.array,
    selectedOfferName: PropTypes.string,
    updateGate: PropTypes.func,
    updateHeading: PropTypes.func,
    updateDescription: PropTypes.func,
    updateButtonText: PropTypes.func,
    updateOfferId: PropTypes.func
};
