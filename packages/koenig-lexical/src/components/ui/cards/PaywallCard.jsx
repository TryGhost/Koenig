import PropTypes from 'prop-types';
import {InputSetting} from '../SettingsPanel';

function Divider() {
    return (
        <div className="flex h-3 items-center whitespace-pre text-center font-sans text-2xs font-semibold uppercase text-grey-500 before:mr-2 before:flex-1 before:border-t before:border-grey-300 before:content-[''] after:ml-2 after:flex-1 after:border-t after:border-grey-300 dark:text-grey-800">
            Free public preview
            <span className="mx-2 text-green">↑</span>
            /
            <span className="mx-2 text-green">↓</span>
            Only visible to members
        </div>
    );
}

export function PaywallCard({
    isEditing,
    heading,
    description,
    buttonText,
    updateHeading,
    updateDescription,
    updateButtonText
}) {
    const hasCustomCta = heading || description || buttonText;

    if (isEditing) {
        return (
            <div>
                <Divider />
                <div className="mt-3 rounded border border-grey-200 bg-grey-50 p-4 font-sans dark:border-grey-900 dark:bg-grey-950" data-testid="paywall-cta-editor">
                    <div className="mb-3 text-2xs font-semibold uppercase tracking-wide text-grey-500">
                        Upgrade message &mdash; emailed to free subscribers in place of the paid content
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
                    </div>
                    <div className="mt-3 border-t border-grey-200 pt-3 text-xs font-normal text-grey-600 dark:border-grey-900 dark:text-grey-500" data-testid="paywall-web-note">
                        On your website, visitors see your site-wide paywall instead &mdash; customize it under Settings &rarr; Membership &rarr; Paywall.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Divider />
            {hasCustomCta &&
                <div className="mt-3 rounded border border-grey-200 p-4 text-center font-sans dark:border-grey-900" data-testid="paywall-cta-preview">
                    <div className="mb-1 text-2xs font-semibold uppercase tracking-wide text-grey-400">Free subscribers see</div>
                    <div className="text-lg font-bold text-black dark:text-grey-100">{heading || 'Upgrade to continue reading.'}</div>
                    <div className="mt-1 text-sm text-grey-700 dark:text-grey-500">{description || 'Become a paid member to get access to all premium content.'}</div>
                    <div className="mt-3 inline-block rounded bg-green px-4 py-2 text-sm font-semibold text-white">{buttonText || 'Upgrade'}</div>
                </div>
            }
        </div>
    );
}

PaywallCard.propTypes = {
    isEditing: PropTypes.bool,
    heading: PropTypes.string,
    description: PropTypes.string,
    buttonText: PropTypes.string,
    updateHeading: PropTypes.func,
    updateDescription: PropTypes.func,
    updateButtonText: PropTypes.func
};
