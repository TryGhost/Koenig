import React from 'react';
import {FORMAT_TEXT_COMMAND} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const Toolbar = () => {
    const [editor] = useLexicalComposerContext();

    const onClick = (event) => {
        event.preventDefault();
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, event.target.dataset.cmd);
    };

    return (
        <div className="flex">
            <ul>
                <button onClick={onClick} className='bold cursor-pointer rounded py-2 px-4 font-bold' data-cmd='bold'>Bold</button>
                <button onClick={onClick} className='bold cursor-pointer rounded py-2 px-4 font-bold' data-cmd='italic'>Italic</button>
            </ul>
        </div>
    );
};

export default Toolbar;
