import KoenigCardWrapper from '../components/KoenigCardWrapper';
import TransistorIcon from '../assets/icons/kg-card-type-transistor.svg?react';
import {TransistorNode as BaseTransistorNode} from '@tryghost/kg-default-nodes';
import {TransistorNodeComponent} from './TransistorNodeComponent';
import {createCommand} from 'lexical';

export const INSERT_TRANSISTOR_COMMAND = createCommand();

export class TransistorNode extends BaseTransistorNode {
    static kgMenu = [{
        section: 'Embeds',
        label: 'Transistor',
        desc: 'Embed a Transistor podcast player',
        Icon: TransistorIcon,
        insertCommand: INSERT_TRANSISTOR_COMMAND,
        matches: ['transistor', 'podcast'],
        priority: 2,
        shortcut: '/transistor',
        isHidden: ({config}: {config?: Record<string, unknown>}) => {
            return !((config?.feature as Record<string, unknown> | undefined)?.transistor === true);
        }
    }];

    constructor(dataset: Record<string, unknown> = {}, key?: string) {
        super(dataset, key);
    }

    getIcon() {
        return TransistorIcon;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()} wrapperStyle="regular">
                <TransistorNodeComponent
                    accentColor={this.accentColor as string}
                    backgroundColor={this.backgroundColor as string}
                    nodeKey={this.getKey()}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createTransistorNode(dataset: Record<string, unknown>) {
    return new TransistorNode(dataset);
}

export function $isTransistorNode(node: unknown): node is TransistorNode {
    return node instanceof TransistorNode;
}
