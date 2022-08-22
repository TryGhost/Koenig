import React from 'react';
import {FORMAT_TEXT_COMMAND, $getRoot} from 'lexical';
import {$createParagraphNode} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$createImageNode} from '../nodes/ImageNode';

const Toolbar = ({instance}) => {
    const [editor] = useLexicalComposerContext();
    const onClick = (event) => {
        event.preventDefault();
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, event.target.dataset.cmd);
    };

    // React.useEffect(() => {
    //     instance?.read(() => {
    //         const selection = $getSelection();
    //         const root = $getRoot(selection);
    //     });
    // }, [instance]);

    const handleImageClick = (event) => {
        event.preventDefault();
        editor.update(() => {
            const root = $getRoot();
            const paragraphNode = $createParagraphNode();
            const imageNode = $createImageNode();
            paragraphNode.append(imageNode);
            root.append(paragraphNode);
        });
    };

    return (
        <div className="flex">
            <ul>
                <button onClick={onClick} className='cursor-pointer rounded py-2 px-4' data-cmd='bold'>Bold</button>
                <button onClick={onClick} className='cursor-pointer rounded py-2 px-4' data-cmd='italic'>Italic</button>
                <button onClick={handleImageClick} className='cursor-pointer rounded py-2 px-4'>Insert Image</button>
            </ul>
        </div>
    );
};

export default Toolbar;
