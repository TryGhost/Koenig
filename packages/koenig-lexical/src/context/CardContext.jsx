import React from 'react';

const CardContext = React.createContext({});

export default CardContext;

export const useCardContext = () => React.useContext(CardContext);
