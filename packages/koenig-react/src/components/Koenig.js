import * as React from 'react';
import {Container, Toolbar, Editor} from 'react-mobiledoc-editor';
import DEFAULT_ATOMS from '../atoms';
import DEFAULT_KEY_COMMANDS from '../key-commands';
import DEFAULT_TEXT_EXPANSIONS from '../text-expansions';

const Koenig = ({
    mobiledoc,
    atoms = DEFAULT_ATOMS,
    keyCommands = DEFAULT_KEY_COMMANDS,
    textExpansions = DEFAULT_TEXT_EXPANSIONS,
    didCreateEditor,
    onChange
}) => {
    const [editorInstance, setEditorInstance] = React.useState();
    const [coords, setCoords] = React.useState({x: 0, y: 0});
    const [globalCoords, setGlobalCoords] = React.useState({x: 0, y: 0}); //eslint-disable-line
    const [showToolbar, setShowToolbar] = React.useState(false);

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

        setEditorInstance(editor);
        didCreateEditor?.(editor);
    }

    React.useEffect(() => {
        if (editorInstance) {
            editorInstance.cursorDidChange(() => {
                if (!editorInstance.range.isCollapsed) {
                    return; 
                }
                let head = editorInstance?.range?.head;
                let section = head?.section;
                if (head.offset > 0) {
                    setShowToolbar(true);
                }
                if (head.offset === 0) {
                    setShowToolbar(false);
                }
                if (section?.isBlank) {
                    return; 
                }
            });
        }
    }, [editorInstance]);

    const handleMouseMove = (event) => {
        setCoords({
            x: event.clientX,
            y: event.clientY
        });
    };

    React.useEffect(() => {
        const handleWindowMouseMove = (event) => {
            setGlobalCoords({
                x: event.screenX,
                y: event.screenY
            });
        };
        window.addEventListener('mousemove', handleWindowMouseMove);
      
        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
        };
    }, [coords]);

    const positionStyle = {
        position: 'absolute',
        zIndex: '22',
        left: coords.x - 40,
        top: coords.y - 20
    };

    return (
        <Container
            className="md:mx-auto md:py-16 max-w-6xl w-full"
            mobiledoc={mobiledoc}
            atoms={atoms}
            onChange={onChange}
            didCreateEditor={_didCreateEditor}
        >   
            <Toolbar style={positionStyle} className={`toolbar-temporary ${showToolbar ? '' : 'invisible'}`} />
            <Editor
                className="prose"
                onMouseUp={handleMouseMove} />
        </Container>
    );
};

export default Koenig;
