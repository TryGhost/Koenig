import React from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
const AutofocusPlugin = () => {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        // Focus the editor when the effect fires!
        editor.focus();
    }, [editor]);

    return null;
};

export default AutofocusPlugin;
