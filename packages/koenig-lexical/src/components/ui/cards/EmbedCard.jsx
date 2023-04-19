import '@tryghost/kg-simplemde/dist/simplemde.min.css';
import PropTypes from 'prop-types';
import React from 'react';
import {CardCaptionEditor} from '../CardCaptionEditor';
import {UrlInput} from '../UrlInput';

export function EmbedCard({captionEditor, captionEditorInitialState, html, isSelected, urlInputValue, urlPlaceholder, urlError, isLoading, handleUrlChange, handleUrlSubmit, handleRetry, handlePasteAsLink, handleClose}) {
    if (html) {
        return (
            <>
                <EmbedIframe dataTestId="embed-iframe" html={html} />
                <CardCaptionEditor
                    captionEditor={captionEditor}
                    captionEditorInitialState={captionEditorInitialState}
                    captionPlaceholder="Type caption for embed (optional)"
                    dataTestId="embed-caption"
                    isSelected={isSelected}
                />
                <div className="absolute inset-0 z-50 mt-0"></div>
            </>
        );
    }
    return (
        <UrlInput
            dataTestId="embed-url"
            handleClose={handleClose}
            handlePasteAsLink={handlePasteAsLink}
            handleRetry={handleRetry}
            handleUrlChange={handleUrlChange}
            handleUrlSubmit={handleUrlSubmit}
            hasError={urlError}
            isLoading={isLoading}
            placeholder={urlPlaceholder}
            value={urlInputValue}
        />
    );
}

function EmbedIframe({dataTestId, html}) {
    // const [width, setWidth] = React.useState();
    // const [height, setHeight] = React.useState();
    const iframeRef = React.useRef(null);

    const handleResize = () => {
        iframeRef.current.style.height = null;

        // NOTE: this does not load the embedded iframe content quickly enough... we may need to make
        // this a promise and wait for the iframe to load before we can get the ratio

        // get ratio from nested iframe if present (eg, Vimeo)
        const firstElement = iframeRef.current.contentDocument.body.firstChild;
        console.log(`firstElement`, firstElement);
        if (firstElement.tagName === 'IFRAME') {
            const widthAttr = firstElement.getAttribute('width');

            if (widthAttr.indexOf('%') === -1) {
                const width = parseInt(firstElement.getAttribute('width'));
                const height = parseInt(firstElement.getAttribute('height'));
                if (width && height) {
                    const ratio = width / height;
                    const newHeight = iframeRef.current.offsetWidth / ratio;
                    firstElement.style.height = `${newHeight}px`;
                    iframeRef.current.style.height = `${newHeight}px`;
                    return;
                }
            }

            const heightAttr = firstElement.getAttribute('height');
            if (heightAttr.indexOf('%') === -1) {
                const height = parseInt(firstElement.getAttribute('height'));
                iframeRef.current.style.height = `${height}px`;
                return;
            }
        }
    };

    React.useEffect(() => {
        const resizeObserver = new ResizeObserver(handleResize);
        console.log(`observing`, iframeRef.current);
        resizeObserver.observe(iframeRef.current);

        return function cleanup() {
            resizeObserver.disconnect();
        };
    }, []);

    return <iframe ref={iframeRef} className="bn miw-100" data-testid={dataTestId} srcDoc={html} title="embed-card-iframe"></iframe>;
}

EmbedCard.propTypes = {
    html: PropTypes.string
};
