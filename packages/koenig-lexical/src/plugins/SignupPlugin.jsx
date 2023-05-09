import React from 'react';
import {COMMAND_PRIORITY_HIGH} from 'lexical';
import {INSERT_SIGNUP_COMMAND, SignupNode} from '../nodes/SignupNode';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export const SignupPlugin = () => {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        if (!editor.hasNodes([SignupNode])){
            console.error('SignupPlugin: SignupNode not registered'); // eslint-disable-line no-console
            return;
        }
        return mergeRegister(
            editor.registerCommand(
                INSERT_SIGNUP_COMMAND,
                async (dataset) => {
                    return true;
                },
                COMMAND_PRIORITY_HIGH
            )
        );
    }, [editor]);

    return null;
};

export default SignupPlugin;
