import '../styles/index.css';
import HorizontalRulePlugin from '../plugins/HorizontalRulePlugin';
import KoenigComposableEditor from './KoenigComposableEditor';
import React from 'react';
import ReplacementStringsPlugin from '../plugins/ReplacementStringsPlugin';
import {ButtonPlugin} from '../plugins/ButtonPlugin';
import {CalloutPlugin} from '../plugins/CalloutPlugin';
import {EMAIL_TRANSFORMERS} from '../plugins/MarkdownShortcutPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';

const KoenigEmailEditor = ({
    children,
    ...props
}) => {
    return (
        <KoenigComposableEditor
            isSnippetsEnabled={false}
            markdownTransformers={EMAIL_TRANSFORMERS}
            {...props}
        >
            <ListPlugin />
            <ReplacementStringsPlugin />
            <ButtonPlugin />
            <CalloutPlugin />
            <HorizontalRulePlugin />
            {children}
        </KoenigComposableEditor>
    );
};

export default KoenigEmailEditor;
