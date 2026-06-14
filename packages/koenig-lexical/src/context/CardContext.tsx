import React from 'react';

export interface CardContextType {
    isSelected: boolean;
    captionHasFocus: boolean | null;
    isEditing: boolean;
    cardWidth: string;
    setCardWidth: (width: string) => void;
    setCaptionHasFocus: (hasFocus: boolean | null) => void;
    setEditing: (editing: boolean) => void;
    nodeKey: string;
    cardContainerRef: React.RefObject<HTMLDivElement | null>;
}

const CardContext = React.createContext<CardContextType>({} as CardContextType);

export default CardContext;
