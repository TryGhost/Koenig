import React from 'react';
import ReactDOM from 'react-dom';

const cardRenderer = component => (env, options, payload) => {
    const {didRender, onTeardown} = env;
    const targetNode = document.createElement('div');

    didRender(() => {
        payload = {...payload}; // de-reference - TODO: deep de-reference?
        const {cardProps} = options;

        const element = React.createElement(component, {
            ...env,
            ...cardProps,
            payload
        });

        ReactDOM.render(element, targetNode);
    });

    onTeardown(() => ReactDOM.unmountComponentAtNode(targetNode));

    return targetNode;
};

export default cardRenderer;
