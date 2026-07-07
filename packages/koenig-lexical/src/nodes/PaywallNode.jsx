import DividerCardIcon from '../assets/icons/kg-card-type-preview.svg?react';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {PaywallNode as BasePaywallNode} from '@tryghost/kg-default-nodes';
import {PaywallNodeComponent} from './PaywallNodeComponent';
import {createCommand} from 'lexical';

export const INSERT_PAYWALL_COMMAND = createCommand();

export class PaywallNode extends BasePaywallNode {
    static kgMenu = {
        label: 'Paywall',
        desc: 'Free preview above, members or paid-only below — grows your list or sells subscriptions',
        Icon: DividerCardIcon,
        insertCommand: INSERT_PAYWALL_COMMAND,
        matches: ['paywall', 'wall', 'public preview', 'preview', 'public intro', 'members only', 'upgrade', 'premium', 'gate', 'paid', 'signup', 'sign up', 'free signup'],
        priority: 6,
        shortcut: '/paywall'
    };

    getIcon() {
        return DividerCardIcon;
    }

    decorate() {
        return (
            <KoenigCardWrapper className="inline-block" nodeKey={this.getKey()}>
                <PaywallNodeComponent
                    buttonText={this.buttonText}
                    description={this.description}
                    emailButtonText={this.emailButtonText}
                    emailDescription={this.emailDescription}
                    emailHeading={this.emailHeading}
                    gate={this.gate}
                    heading={this.heading}
                    nodeKey={this.getKey()}
                    offerId={this.offerId}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createPaywallNode(dataset) {
    return new PaywallNode(dataset);
}

export function $isPaywallNode(node) {
    return node instanceof PaywallNode;
}
