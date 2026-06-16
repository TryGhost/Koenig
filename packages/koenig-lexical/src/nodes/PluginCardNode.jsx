import PluginCardIcon from '../assets/icons/kg-card-type-html.svg?react';
import PluginCardIndicatorIcon from '../assets/icons/kg-indicator-html.svg?react';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {PluginCardNode as BasePluginCardNode} from '@tryghost/kg-default-nodes';
import {PluginCardNodeComponent} from './PluginCardNodeComponent';
import {INSERT_PLUGIN_CARD_COMMAND} from '../commands/pluginCardCommands';

export class PluginCardNode extends BasePluginCardNode {
    static kgMenu = [];

    getIcon() {
        return PluginCardIcon;
    }

    constructor(dataset = {}, key) {
        super(dataset, key);
    }

    decorate() {
        return (
            <KoenigCardWrapper
                IndicatorIcon={PluginCardIndicatorIcon}
                nodeKey={this.getKey()}
                wrapperStyle="wide"
            >
                <PluginCardNodeComponent
                    cardName={this.__cardName}
                    html={this.__html}
                    nodeKey={this.getKey()}
                    payload={this.__payload}
                    pluginName={this.__pluginName}
                />
            </KoenigCardWrapper>
        );
    }
}

export function $createPluginCardNode(dataset) {
    return new PluginCardNode(dataset);
}

export function $isPluginCardNode(node) {
    return node instanceof PluginCardNode;
}
