import PropTypes from 'prop-types';
import {DropdownSetting, InputSetting} from '../SettingsPanel';

function Divider({gate, isTiersPost}) {
    let audience = 'Only visible to paid members';
    if (isTiersPost) {
        audience = 'Only visible to selected tiers';
    } else if (gate === 'members') {
        audience = 'Only visible to members';
    }

    return (
        <div className="flex h-3 items-center whitespace-pre text-center font-sans text-2xs font-semibold uppercase text-grey-500 before:mr-2 before:flex-1 before:border-t before:border-grey-300 before:content-[''] after:ml-2 after:flex-1 after:border-t after:border-grey-300 dark:text-grey-800">
            Free public preview
            <span className="mx-2 text-green">↑</span>
            /
            <span className="mx-2 text-green">↓</span>
            {audience}
        </div>
    );
}

Divider.propTypes = {
    gate: PropTypes.string,
    isTiersPost: PropTypes.bool
};

const NO_OFFER_OPTION = {label: 'None — default signup', name: ''};

const GATE_OPTIONS = [
    {label: 'Paid members', name: 'paid'},
    {label: 'Free members — grow your list', name: 'members'}
];

function SettingsLink() {
    return (
        <a className="font-medium text-green-600 hover:underline" href="#/settings/paywall" onMouseDown={e => e.stopPropagation()}>Settings &rarr; Membership &rarr; Paywall</a>
    );
}

export function PaywallCard({
    isEditing,
    isTiersPost,
    gate = 'paid',
    sitePaywallCopy,
    heading,
    description,
    buttonText,
    emailButtonText,
    offerId,
    offers = [],
    selectedOfferName,
    updateGate,
    updateHeading,
    updateDescription,
    updateButtonText,
    updateEmailButtonText,
    updateOfferId
}) {
    const isMembersGate = !isTiersPost && gate === 'members';
    const hasCustomCta = heading || description || buttonText || offerId;

    // Site-wide fallback copy for whichever wall this post renders
    const siteWall = (isMembersGate ? sitePaywallCopy?.signup : sitePaywallCopy?.payment) || {};
    // Tier walls have their own headline (the paid headline never renders
    // there); the built-in default lists the selected tier names
    const siteHeading = isTiersPost
        ? (sitePaywallCopy?.payment?.tiersHeading || 'This post is for subscribers on selected tiers only')
        : siteWall.heading;

    if (isEditing) {
        const offerOptions = [NO_OFFER_OPTION, ...offers.map(offer => ({label: offer.name, name: offer.id}))];

        return (
            <div>
                <Divider gate={gate} isTiersPost={isTiersPost} />
                <div className="not-kg-prose mt-3 rounded border border-grey-200 bg-grey-50 p-4 font-sans dark:border-grey-900 dark:bg-grey-950" data-testid="paywall-cta-editor">
                    <div className="flex flex-col gap-3">
                        {isTiersPost ? (
                            <div data-testid="paywall-tiers-gate-note">
                                <div className="text-sm font-medium tracking-normal text-grey-900 dark:text-grey-300">Who can read past this point?</div>
                                <div className="mt-1 text-sm text-grey-700 dark:text-grey-500">Members of the selected tiers &mdash; manage tiers in the post settings menu</div>
                            </div>
                        ) : (
                            <DropdownSetting
                                dataTestId="paywall-gate-dropdown"
                                description={isMembersGate ? 'Anyone can sign up for free to keep reading' : 'A paid subscription is required to keep reading'}
                                label="Who can read past this point?"
                                menu={GATE_OPTIONS}
                                value={gate || 'paid'}
                                onChange={updateGate}
                            />
                        )}
                    </div>
                    {isMembersGate ? (
                        <div data-testid="paywall-members-note">
                            <div className="mb-3 mt-4 flex items-baseline justify-between">
                                <span className="text-sm font-semibold text-grey-900 dark:text-grey-300">Sign-up message</span>
                                <span className="text-xs font-normal text-grey-600 dark:text-grey-500">Shown to visitors on your site &mdash; your email list already has full access</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <InputSetting
                                    dataTestId="paywall-heading-input"
                                    label="Heading"
                                    placeholder={siteHeading || 'This post is for subscribers only'}
                                    value={heading}
                                    onChange={updateHeading}
                                />
                                <InputSetting
                                    dataTestId="paywall-description-input"
                                    label="Description"
                                    placeholder={siteWall.description || 'Optional supporting line'}
                                    value={description}
                                    onChange={updateDescription}
                                />
                                <InputSetting
                                    dataTestId="paywall-button-input"
                                    label="Button"
                                    placeholder={siteWall.buttonText || 'Subscribe now'}
                                    value={buttonText}
                                    onChange={updateButtonText}
                                />
                            </div>
                            <div className="mt-3 border-t border-grey-200 pt-3 text-xs font-normal text-grey-600 dark:border-grey-900 dark:text-grey-500">
                                Blank fields use your site-wide sign-up wall message &mdash; edit it in <SettingsLink />.
                                {offerId ? <span className="mt-1 block" data-testid="paywall-inactive-offer-note">The attached offer{selectedOfferName ? ` (${selectedOfferName})` : ''} doesn&rsquo;t apply to sign-up walls &mdash; the button is a plain free signup. It returns if you switch back to paid.</span> : null}
                                {sitePaywallCopy?.isCustomised && (heading || description || buttonText) ? <span className="mt-1 block font-medium text-yellow-600" data-testid="paywall-override-warning">This post&rsquo;s message replaces your site-wide paywall message.</span> : null}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-3 mt-4 flex items-baseline justify-between">
                                <span className="text-sm font-semibold text-grey-900 dark:text-grey-300">Upgrade message</span>
                                <span className="text-xs font-normal text-grey-600 dark:text-grey-500">Shown wherever readers hit this paywall &mdash; on your site and in email</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <InputSetting
                                    dataTestId="paywall-heading-input"
                                    label="Heading"
                                    placeholder={siteHeading || 'Upgrade to continue reading.'}
                                    value={heading}
                                    onChange={updateHeading}
                                />
                                <InputSetting
                                    dataTestId="paywall-description-input"
                                    label="Description"
                                    placeholder={siteWall.description || 'Become a paid member to get access to all premium content.'}
                                    value={description}
                                    onChange={updateDescription}
                                />
                                <InputSetting
                                    dataTestId="paywall-button-input"
                                    label="Button"
                                    placeholder={siteWall.buttonText || 'Upgrade'}
                                    value={buttonText}
                                    onChange={updateButtonText}
                                />
                                <InputSetting
                                    dataTestId="paywall-email-button-input"
                                    description="Email readers are already free members — an upgrade-flavoured CTA usually converts better there. Blank uses the button above."
                                    label="Button — email"
                                    placeholder={buttonText || siteWall.emailButtonText || siteWall.buttonText || 'Upgrade'}
                                    value={emailButtonText}
                                    onChange={updateEmailButtonText}
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
                                Blank fields use your site-wide payment wall message &mdash; edit it in <SettingsLink />. The offer applies wherever this message shows, on your site and in email.
                                {sitePaywallCopy?.campaign && offerId ? <span className="mt-1 block font-medium text-yellow-600" data-testid="paywall-campaign-takeover-warning">Your site-wide campaign offer is currently shown on this wall instead of {selectedOfferName ? `"${selectedOfferName}"` : 'this post\u2019s offer'} &mdash; it returns when the campaign ends.</span> : null}
                                {sitePaywallCopy?.isCustomised && (heading || description || buttonText) ? <span className="mt-1 block font-medium text-yellow-600" data-testid="paywall-override-warning">This post&rsquo;s message replaces your site-wide paywall message.</span> : null}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <Divider gate={gate} isTiersPost={isTiersPost} />
            {hasCustomCta &&
                <div className="not-kg-prose mt-3 rounded border border-grey-200 p-4 text-center font-sans dark:border-grey-900" data-testid="paywall-cta-preview">
                    <div className="mb-1 text-2xs font-semibold uppercase tracking-wide text-grey-400">{isMembersGate ? 'Sign-up message — site visitors see' : 'Upgrade message — shown at the paywall (site & email)'}</div>
                    <div className="text-lg font-bold text-black dark:text-grey-100">{heading || siteHeading}</div>
                    {(description || siteWall.description) && <div className="mt-1 text-sm text-grey-700 dark:text-grey-500">{description || siteWall.description}</div>}
                    <div className="mt-3 inline-block rounded bg-green px-4 py-2 text-sm font-semibold text-white">{buttonText || siteWall.buttonText}</div>
                    {emailButtonText && !isMembersGate &&
                        <div className="mt-2 text-xs font-normal text-grey-600 dark:text-grey-500" data-testid="paywall-email-button-note">Email button: &ldquo;{emailButtonText}&rdquo;</div>
                    }
                    {offerId && !isMembersGate && !sitePaywallCopy?.campaign &&
                        <div className="mt-2 text-xs font-normal text-grey-600 dark:text-grey-500" data-testid="paywall-offer-note">Button links to offer{selectedOfferName ? `: ${selectedOfferName}` : ''}</div>
                    }
                    {offerId && !isMembersGate && sitePaywallCopy?.campaign &&
                        <div className="mt-2 text-xs font-normal text-yellow-600" data-testid="paywall-campaign-takeover-note">Site-wide campaign offer showing instead of {selectedOfferName ? `"${selectedOfferName}"` : 'this post\u2019s offer'}</div>
                    }
                    {offerId && isMembersGate &&
                        <div className="mt-2 text-xs font-normal text-grey-500" data-testid="paywall-dormant-offer-note">An attached offer{selectedOfferName ? ` (${selectedOfferName})` : ''} is dormant &mdash; sign-up walls don&rsquo;t use offers; it returns if the gate switches back to paid</div>
                    }
                    {sitePaywallCopy?.isCustomised && (heading || description || buttonText) ?
                        <div className="mt-2 text-xs font-normal text-grey-500" data-testid="paywall-override-note">Replaces your site-wide paywall message</div> : null
                    }
                </div>
            }
        </div>
    );
}

PaywallCard.propTypes = {
    isEditing: PropTypes.bool,
    isTiersPost: PropTypes.bool,
    gate: PropTypes.string,
    sitePaywallCopy: PropTypes.object,
    heading: PropTypes.string,
    description: PropTypes.string,
    buttonText: PropTypes.string,
    emailButtonText: PropTypes.string,
    offerId: PropTypes.string,
    offers: PropTypes.array,
    selectedOfferName: PropTypes.string,
    updateGate: PropTypes.func,
    updateHeading: PropTypes.func,
    updateDescription: PropTypes.func,
    updateButtonText: PropTypes.func,
    updateEmailButtonText: PropTypes.func,
    updateOfferId: PropTypes.func
};
