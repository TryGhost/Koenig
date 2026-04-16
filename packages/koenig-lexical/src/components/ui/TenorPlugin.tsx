import KoenigComposerContext from '../../context/KoenigComposerContext.jsx';
import React from 'react';
import TenorSelector, {type TenorSelectorProps} from './TenorSelector';
import {DELETE_CARD_COMMAND} from '../../plugins/KoenigBehaviourPlugin.jsx';
import {INSERT_FROM_TENOR_COMMAND} from '../../plugins/KoenigSelectorPlugin.jsx';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useTenor} from '../../utils/services/tenor.js';

interface TenorPluginProps {
    nodeKey: string;
}

const TenorPlugin = ({nodeKey}: TenorPluginProps) => {
    const {cardConfig} = React.useContext(KoenigComposerContext);
    const tenorHook = useTenor({config: cardConfig.tenor!});
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
        editor.dispatchCommand(INSERT_FROM_TENOR_COMMAND, image);
    };

    return (
        <TenorSelector
            onClickOutside={onClickOutside}
            onGifInsert={insertImageToNode as TenorSelectorProps['onGifInsert']}
            {...tenorHook as unknown as Omit<TenorSelectorProps, 'onGifInsert' | 'onClickOutside'>}
        />
    );
};

export default TenorPlugin;
