import React from 'react';
import {AtLinkPlugin} from './AtLinkPlugin.jsx';
import {AudioPlugin} from '../plugins/AudioPlugin';
import {BookmarkPlugin} from '../plugins/BookmarkPlugin';
import {ButtonPlugin} from '../plugins/ButtonPlugin';
import {CalloutPlugin} from '../plugins/CalloutPlugin';
import {CardMenuPlugin} from '../plugins/CardMenuPlugin';
import {CollectionPlugin} from '../plugins/CollectionPlugin';
import {EmEnDashPlugin} from '../plugins/EmEnDashPlugin';
import {EmailCtaPlugin} from '../plugins/EmailCtaPlugin';
import {EmailPlugin} from '../plugins/EmailPlugin';
import {EmbedPlugin} from '../plugins/EmbedPlugin';
import {EmojiPickerPlugin} from './EmojiPickerPlugin';
import {FilePlugin} from '../plugins/FilePlugin';
import {GalleryPlugin} from '../plugins/GalleryPlugin';
import {HeaderPlugin} from '../plugins/HeaderPlugin';
import {HorizontalRulePlugin} from '../plugins/HorizontalRulePlugin';
import {HtmlPlugin} from './HtmlPlugin';
import {ImagePlugin} from '../plugins/ImagePlugin';
import {KoenigSelectorPlugin} from './KoenigSelectorPlugin.jsx';
import {KoenigSnippetPlugin} from '../plugins/KoenigSnippetPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {MarkdownPlugin} from '../plugins/MarkdownPlugin';
import {PaywallPlugin} from '../plugins/PaywallPlugin';
import {ProductPlugin} from '../plugins/ProductPlugin';
import {SignupPlugin} from '../plugins/SignupPlugin';
import {TogglePlugin} from '../plugins/TogglePlugin';
import {VideoPlugin} from '../plugins/VideoPlugin';

export const AllDefaultPlugins = () => {
    return (
        <>
            {/* Lexical Plugins */}
            <ListPlugin /> {/* adds indent/outdent/remove etc support */}
            {/* <TabIndentationPlugin /> tab/shift+tab triggers indent/outdent */}

            {/* Koenig Plugins */}
            <CardMenuPlugin />
            <EmojiPickerPlugin />
            <AtLinkPlugin />

            {/* Card Plugins */}
            <AudioPlugin />
            <ImagePlugin />
            <GalleryPlugin />
            <VideoPlugin />
            <MarkdownPlugin />
            <EmEnDashPlugin />
            <HorizontalRulePlugin />
            <CalloutPlugin />
            <HtmlPlugin />
            <FilePlugin />
            <ButtonPlugin />
            <TogglePlugin />
            <HeaderPlugin />
            <BookmarkPlugin />
            <PaywallPlugin />
            <KoenigSelectorPlugin />
            <ProductPlugin />
            <EmailCtaPlugin />
            <EmailPlugin />
            <EmbedPlugin />
            <SignupPlugin />
            <CollectionPlugin />

            {/* Snippet Plugins */}
            <KoenigSnippetPlugin />
        </>
    );
};

export default AllDefaultPlugins;
