import CardContext from '../context/CardContext';
// import KoenigComposerContext from '../context/KoenigComposerContext.jsx';
import React from 'react';
// import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {CtaCard} from '../components/ui/cards/CtaCard';

export const CallToActionNodeComponent = ({
    nodeKey,
    backgroundColor,
    buttonText,
    buttonUrl,
    hasBackground,
    hasImage,
    hasSponsorLabel,
    imageUrl,
    layout,
    showButton,
    textValue,
    buttonColor,
    htmlEditor
}) => {
    // const [editor] = useLexicalComposerContext();
    const {isEditing, isSelected, setEditing} = React.useContext(CardContext);
    // const {cardConfig} = React.useContext(KoenigComposerContext);
    // const [showSnippetToolbar, setShowSnippetToolbar] = React.useState(false);
    return (
        <>
            <CtaCard
                buttonColor={buttonColor}
                buttonText={buttonText}
                buttonUrl={buttonUrl}
                color={backgroundColor}
                handleButtonColor={() => {}}
                handleColorChange={() => {}}
                hasBackground={hasBackground}
                hasImage={hasImage}
                hasSponsorLabel={hasSponsorLabel}
                htmlEditor={htmlEditor}
                imageSrc={imageUrl}
                isEditing={isEditing}
                isSelected={isSelected}
                layout={layout}
                setEditing={setEditing}
                showButton={showButton}
                text={textValue}
                updateButtonText={() => {}}
                updateButtonUrl={() => {}}
                updateHasSponsorLabel={() => {}}
                updateLayout={() => {}}
                updateShowButton={() => {}}

            />
        </>
    );
};
