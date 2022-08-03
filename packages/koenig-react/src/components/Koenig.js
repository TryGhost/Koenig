import * as React from 'react';
import {Container, Editor, Toolbar} from 'react-mobiledoc-editor';
import DEFAULT_ATOMS from '../atoms';
import DEFAULT_KEY_COMMANDS from '../key-commands';
import DEFAULT_TEXT_EXPANSIONS from '../text-expansions';

const Koenig = ({
    mobiledoc,
    atoms = DEFAULT_ATOMS,
    keyCommands = DEFAULT_KEY_COMMANDS,
    textExpansions = DEFAULT_TEXT_EXPANSIONS,
    didCreateEditor,
    onChange,
    TOOLBAR_MARGIN = 35,
    selectionFrame
}) => {
    const DEFAULTSTYLES = {
        top: 0,
        left: 0,
        right: 0

    };
    const editorRef = React.useRef();
    const [editorInstance, setEditorInstance] = React.useState(null); //eslint-disable-line
    const [showToolbar, setShowToolbar] = React.useState(false);
    const [toolbarPosition, setToolbarPosition] = React.useState(DEFAULTSTYLES);
    
    function _didCreateEditor(editor) {
        if (keyCommands?.length) {
            keyCommands.forEach((command) => {
                editor.registerKeyCommand({
                    str: command.str,
                    run() {
                        return command.run(editor);
                    }
                });
            });
        }

        if (textExpansions?.length) {
            textExpansions.forEach((textExpansion) => {
                textExpansion.unregister?.forEach(key => editor.unregisterTextInputHandler(key));
                textExpansion.register?.forEach(expansion => editor.onTextInput(expansion));
            });
        }

        didCreateEditor?.(editor);
        setEditorInstance(editor);
    }

    function _positionToolbar() {
        var iframe = selectionFrame.current;
        let containerRect = iframe.getBoundingClientRect();
        var contentWindow = iframe.contentWindow;
        let range = contentWindow.getSelection().getRangeAt(0);
        let rangeRect = range.getBoundingClientRect();
        let {width} = iframe.getBoundingClientRect();
        let newPosition = {};

        // // rangeRect is relative to the viewport so we need to subtract the
        // // container measurements to get a position relative to the container
        newPosition = {
            top: rangeRect.top - containerRect.top - TOOLBAR_MARGIN,
            left: rangeRect.left - containerRect.left + rangeRect.width / 2 - width / 2,
            right: null
        };

        let tickPosition = 50;
        // don't overflow left boundary
        if (newPosition.left < 0) {
            newPosition.left = 0;

            // calculate the tick percentage position
            let absTickPosition = rangeRect.left - containerRect.left + rangeRect.width / 2;
            tickPosition = absTickPosition / width * 100;
            if (tickPosition < 5) {
                tickPosition = 5;
            }
        }
        // same for right boundary
        if (newPosition.left + width > containerRect.width) {
            newPosition.left = null;
            newPosition.right = 0;

            // calculate the tick percentage position
            let absTickPosition = rangeRect.right - containerRect.right - rangeRect.width / 2;
            tickPosition = 100 + absTickPosition / width * 100;
            if (tickPosition > 95) {
                tickPosition = 95;
            }
        }
        if (contentWindow.getSelection().toString().length === 0) {
            setToolbarPosition(DEFAULTSTYLES);
            setShowToolbar(false);
            return;
        }
        setToolbarPosition(newPosition);
        setShowToolbar(true);
    }

    function useOutsideAlerter(ref) {
        React.useEffect(() => {
            function handleClickOutside() {
                setShowToolbar(false);
            }
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [ref]);
    }

    useOutsideAlerter(editorRef);

    const toolbarPositionStyles = {
        top: `${toolbarPosition.top}px`,
        left: `${toolbarPosition.left}px`,
        right: `${toolbarPosition.right}px`,
        position: `absolute`
    };

    return (
        <Container
            ref={editorRef}
            id="mobiledoc-editor"
            data-testid="mobiledoc-container"
            className="md:mx-auto md:py-16 max-w-2xl w-full"
            mobiledoc={mobiledoc}
            atoms={atoms}
            onChange={onChange}
            didCreateEditor={_didCreateEditor}
            placeholder="Begin writing your post...">  
            <div style={toolbarPositionStyles}
                className={`${showToolbar ? '' : 'hidden'}`} >
                <Toolbar className={`toolbar-temporary`} /> 
            </div>
            <Editor
                data-testid="mobiledoc-editor"
                className="prose"
                onMouseUp={_positionToolbar}/>
        </Container>
    );
};

export default Koenig;
