import {$getNodeByKey} from 'lexical';
import {useEffect, useState} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export const useVisibilityToggle = (nodeKey, initialVisibility) => {
    const [editor] = useLexicalComposerContext();
    const [visibility, setVisibility] = useState(initialVisibility);

    useEffect(() => {
        setVisibility(initialVisibility);
    }, [initialVisibility]);

    const toggleVisibility = (key) => {
        setVisibility(prevVisibility => ({
            ...prevVisibility,
            [key]: !prevVisibility[key]
        }));

        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.visibility[key] = !node.visibility[key];
        });
    };

    return [visibility, toggleVisibility];
};

