import React from 'react';
import {$createPluginCardNode, PluginCardNode} from '../nodes/PluginCardNode';
import {INSERT_PLUGIN_CARD_COMMAND} from '../commands/pluginCardCommands';
import {COMMAND_PRIORITY_LOW} from 'lexical';
import {INSERT_CARD_COMMAND} from './KoenigBehaviourPlugin';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const PluginCardPluginInner = () => {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        if (!editor.hasNodes([PluginCardNode])){
            console.error('PluginCardPlugin: PluginCardNode not registered');
            return;
        }
        return mergeRegister(
            editor.registerCommand(
                INSERT_PLUGIN_CARD_COMMAND,
                (dataset) => {
                    const cardNode = $createPluginCardNode(dataset);
                    editor.dispatchCommand(INSERT_CARD_COMMAND, {cardNode, openInEditMode: true});
                    return true;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor]);

    return null;
};

// PluginCardProvider wraps CardMenuPlugin + PluginCardPlugin in AllDefaultPlugins
export const PluginCardPlugin = PluginCardPluginInner;

export default PluginCardPlugin;
