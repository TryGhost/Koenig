import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext';
import React from 'react';
import {$getNodeByKey, CLICK_COMMAND, COMMAND_PRIORITY_LOW} from 'lexical';
import {CardWrapper} from './ui/CardWrapper';
import {EDIT_CARD_COMMAND, SELECT_CARD_COMMAND} from '../plugins/KoenigBehaviourPlugin';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const KoenigCardWrapperComponent = ({nodeKey, width, wrapperStyle, IndicatorIcon, openInEditMode = false, children}) => {
    const [editor] = useLexicalComposerContext();
    const [cardType, setCardType] = React.useState(null);
    const [captionHasFocus, setCaptionHasFocus] = React.useState(null);
    const [cardWidth, setCardWidth] = React.useState(width || 'regular');
    const containerRef = React.useRef(null);

    const {selectedCardKey, isEditingCard} = React.useContext(KoenigComposerContext);

    const isSelected = selectedCardKey === nodeKey;
    const isEditing = isSelected && isEditingCard;

    React.useLayoutEffect(() => {
        editor.getEditorState().read(() => {
            const cardNode = $getNodeByKey(nodeKey);
            setCardType(cardNode.getType());
        });

        // We only do this for init
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        return mergeRegister(
            // we register a click command at the editor level rather than the React level
            // so that we can prevent the editor's default click behaviour without also
            // preventing the click behaviour of other React components inside the card
            editor.registerCommand(
                CLICK_COMMAND,
                (event) => {
                    if (containerRef.current.contains(event.target)) {
                        if (isSelected && !isEditing) {
                            editor.dispatchCommand(EDIT_CARD_COMMAND, {cardKey: nodeKey});
                        } else if (!isSelected) {
                            editor.dispatchCommand(SELECT_CARD_COMMAND, {cardKey: nodeKey});
                        }

                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    });

    const setEditing = (shouldEdit) => {
        if (shouldEdit) {
            editor.dispatchCommand(EDIT_CARD_COMMAND, {cardKey: nodeKey});
        } else if (!isSelected) {
            editor.dispatchCommand(SELECT_CARD_COMMAND, {cardKey: nodeKey});
        }
    };

    return (
        <CardContext.Provider value={{
            isSelected,
            captionHasFocus,
            isEditing,
            cardWidth,
            setCardWidth,
            setCaptionHasFocus,
            setEditing,
            nodeKey,
            cardContainerRef: containerRef
        }}>
            <CardWrapper
                ref={containerRef}
                cardType={cardType}
                cardWidth={cardWidth}
                IndicatorIcon={IndicatorIcon}
                isEditing={isEditing}
                isSelected={isSelected}
                wrapperStyle={wrapperStyle}
            >
                {children}
            </CardWrapper>
        </CardContext.Provider>
    );
};

export default KoenigCardWrapperComponent;
