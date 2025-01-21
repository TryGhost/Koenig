import CalloutCardIcon from '../assets/icons/kg-card-type-callout.svg?react';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {CallToActionNode as BaseCallToActionNode} from '@tryghost/kg-default-nodes';
import {CallToActionNodeComponent} from './CallToActionNodeComponent';
import {createCommand} from 'lexical';

export const INSERT_CTA_COMMAND = createCommand();

export class CallToActionNode extends BaseCallToActionNode {
    // TODO: Improve the copy of the menu item
    static kgMenu = {
        label: 'Call to Action',
        desc: 'Add a call to action to your post',
        Icon: CalloutCardIcon, // TODO: Replace with correct icon
        insertCommand: INSERT_CTA_COMMAND,
        matches: ['cta'],
        priority: 10,
        shortcut: '/cta'
    };

    static getType() {
        return 'call-to-action';
    }

    getIcon() {
        // TODO: replace with correct icon
        return CalloutCardIcon;
    }

    decorate() {
        return (
            <KoenigCardWrapper
                nodeKey={this.getKey()}
                wrapperStyle="wide"
            >
                <CallToActionNodeComponent
                    backgroundColor={this.backgroundColor}
                    buttonText={this.buttonText}
                    buttonUrl={this.buttonUrl}
                    hasBackground={this.hasBackground}
                    hasImage={this.hasImage}
                    hasSponsorLabel={this.hasSponsorLabel}
                    imageUrl={this.imageUrl}
                    layout={this.layout}
                    nodeKey={this.getKey()}
                    showButton={this.showButton}
                    textValue={this.textValue}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createCallToActionNode(dataset) {
    return new CallToActionNode(dataset);
}

export function $isCallToActionNode(node) {
    return node instanceof CallToActionNode;
}
