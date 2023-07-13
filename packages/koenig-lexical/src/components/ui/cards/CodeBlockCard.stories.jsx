import React from 'react';
import populateEditor from '../../../utils/storybook/populate-storybook-editor';
import {CardWrapper} from './../CardWrapper';
import {CodeBlockCard} from './CodeBlockCard';
import {MINIMAL_NODES} from '../../../index.js';
import {createEditor} from 'lexical';

const displayOptions = {
    Default: {isSelected: false, isEditing: false},
    Selected: {isSelected: true, isEditing: false},
    Editing: {isSelected: true, isEditing: true}
};

const story = {
    title: 'Primary cards/Code card',
    component: CodeBlockCard,
    subcomponent: {CardWrapper},
    argTypes: {
        display: {
            options: Object.keys(displayOptions),
            mapping: displayOptions,
            control: {
                type: 'radio',
                labels: {
                    Default: 'Default',
                    Selected: 'Selected',
                    Editing: 'Editing'
                },
                defaultValue: displayOptions.Default
            }
        }
    },
    parameters: {
        status: {
            type: 'functional'
        }
    }
};
export default story;

const Template = ({display, caption, ...args}) => {
    const captionEditor = createEditor({nodes: MINIMAL_NODES});
    populateEditor({editor: captionEditor, initialHtml: `<p>${caption}</p>`});

    return (
        <div className="kg-prose">
            <div className="mx-auto my-8 min-w-[initial] max-w-[740px]">
                <CardWrapper wrapperStyle='code-card' {...display} {...args}>
                    <CodeBlockCard captionEditor={captionEditor} updateCode={() => {}} {...display} {...args} />
                </CardWrapper>
            </div>
        </div>
    );
};

export const Empty = Template.bind({});
Empty.args = {
    display: 'Editing',
    code: '',
    language: '',
    caption: ''
};

export const Populated = Template.bind({});
Populated.args = {
    display: 'Editing',
    code: '<script></script>',
    language: 'html',
    caption: 'A code example'
};
