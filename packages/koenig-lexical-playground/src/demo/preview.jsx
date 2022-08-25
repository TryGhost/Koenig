import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$generateHtmlFromNodes} from '@lexical/html';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import React from 'react';

const Preview = () => {
    const [editor] = useLexicalComposerContext();
    const [html, setHtml] = React.useState(`This will update when you start typing`);
    const onChange = () => {
        editor.update(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            setHtml(htmlString);
        });
    };
    return (
        <div className='koenig-react mt-6'>
            <hr/>
            <div className='kg-prose' dangerouslySetInnerHTML={{__html: html}}></div>
            <OnChangePlugin onChange={onChange} />
        </div>
    );
};

export default Preview;
