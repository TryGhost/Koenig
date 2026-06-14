import GifSelector, {type GifSelectorProps} from './GifSelector';
import KoenigComposerContext from '../../context/KoenigComposerContext.jsx';
import React from 'react';
import {DELETE_CARD_COMMAND} from '../../plugins/KoenigBehaviourPlugin.jsx';
import {INSERT_FROM_GIF_COMMAND} from '../../plugins/KoenigSelectorPlugin.jsx';
import {getGifProviderConfig, useGif} from '../../utils/services/gif.js';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

interface GifPluginProps {
    nodeKey: string;
}

const GifPlugin = ({nodeKey}: GifPluginProps) => {
    const {cardConfig} = React.useContext(KoenigComposerContext);
    const providerConfig = getGifProviderConfig(cardConfig);
    const gifHook = useGif({config: providerConfig!});
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                editor.dispatchCommand(DELETE_CARD_COMMAND, {cardKey: nodeKey});
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

        // We only do this for init
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickOutside = () => {
        editor.dispatchCommand(DELETE_CARD_COMMAND, {cardKey: nodeKey});
    };

    const insertImageToNode = async (image: unknown) => {
        editor.dispatchCommand(INSERT_FROM_GIF_COMMAND, image);
    };

    return (
        <GifSelector
            provider={providerConfig?.provider}
            onClickOutside={onClickOutside}
            onGifInsert={insertImageToNode as GifSelectorProps['onGifInsert']}
            {...gifHook as unknown as Omit<GifSelectorProps, 'onGifInsert' | 'onClickOutside'>}
        />
    );
};

export default GifPlugin;
