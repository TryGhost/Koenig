import ButtonCardIcon from '../assets/icons/kg-card-type-button.svg?react';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {ButtonNode as BaseButtonNode} from '@tryghost/kg-default-nodes';
import {ButtonNodeComponent} from './ButtonNodeComponent';
import {createCommand} from 'lexical';

export const INSERT_BUTTON_COMMAND = createCommand();

export class ButtonNode extends BaseButtonNode {
    static kgMenu = {
        label: 'Button',
        desc: 'Add a button to your post',
        Icon: ButtonCardIcon,
        insertCommand: INSERT_BUTTON_COMMAND,
        matches: ['button'],
        priority: 3,
        shortcut: '/button'
    };

    static getType() {
        return 'button';
    }

    getIcon() {
        return ButtonCardIcon;
    }

    decorate() {
        return (
            <KoenigCardWrapper
                nodeKey={this.getKey()}
                wrapperStyle="wide"
            >
                <ButtonNodeComponent
                    alignment={this.alignment as string}
                    buttonText={this.buttonText as string}
                    buttonUrl={this.buttonUrl as string}
                    nodeKey={this.getKey()}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createButtonNode(dataset: Record<string, unknown>) {
    return new ButtonNode(dataset);
}

export function $isButtonNode(node: unknown): node is ButtonNode {
    return node instanceof ButtonNode;
}
