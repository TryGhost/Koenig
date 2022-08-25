import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$generateHtmlFromNodes} from '@lexical/html';
import React from 'react';

const Preview = () => {
    const [editor] = useLexicalComposerContext();
    const [html, setHtml] = React.useState('');
    const onClick = () => {
        editor.update(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            setHtml(htmlString);
        });
    };

    return (
        <div className='koenig-react mt-6'>
            <hr/>
            <button className='button mt-6 cursor-pointer text-lg' onClick={onClick}>Click to Preview</button>
            <div className='kg-prose' dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    );
};

export default Preview;
