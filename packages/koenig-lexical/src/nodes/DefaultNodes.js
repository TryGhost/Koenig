import {
    AtLinkNode,
    AtLinkSearchNode,
    ExtendedHeadingNode,
    ExtendedQuoteNode,
    ExtendedTextNode,
    TKNode,
    ZWNJNode,
    extendedHeadingNodeReplacement,
    extendedQuoteNodeReplacement,
    extendedTextNodeReplacement
} from '@tryghost/kg-default-nodes';

import {AsideNode} from './AsideNode';
import {AudioNode} from './AudioNode';
import {BookmarkNode} from './BookmarkNode';
import {ButtonNode} from './ButtonNode';
import {CallToActionNode} from './CallToActionNode';
import {CalloutNode} from './CalloutNode';
import {CodeBlockNode} from './CodeBlockNode';
import {EmailCtaNode} from './EmailCtaNode';
import {EmailNode} from './EmailNode';
import {EmbedNode} from './EmbedNode';
import {FileNode} from './FileNode';
import {GalleryNode} from './GalleryNode';
import {HeaderNode} from './HeaderNode';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {HorizontalRuleNode} from './HorizontalRuleNode';
import {HtmlNode} from './HtmlNode';
import {ImageNode} from './ImageNode';
import {LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';
import {MarkdownNode} from './MarkdownNode';
import {PaywallNode} from './PaywallNode';
import {ProductNode} from './ProductNode';
import {SignupNode} from './SignupNode';
import {ToggleNode} from './ToggleNode';
import {VideoNode} from './VideoNode';

const DEFAULT_NODES = [
    ExtendedTextNode,
    extendedTextNodeReplacement,
    HeadingNode,
    ExtendedHeadingNode,
    extendedHeadingNodeReplacement,
    QuoteNode,
    ExtendedQuoteNode,
    extendedQuoteNodeReplacement,
    ListNode,
    ListItemNode,
    AsideNode,
    LinkNode,
    CodeBlockNode,
    HorizontalRuleNode,
    ImageNode,
    MarkdownNode,
    AudioNode,
    VideoNode,
    CalloutNode,
    HtmlNode,
    FileNode,
    ButtonNode,
    CallToActionNode,
    ToggleNode,
    HeaderNode,
    BookmarkNode,
    PaywallNode,
    ProductNode,
    EmailNode,
    EmailCtaNode,
    EmbedNode,
    GalleryNode,
    SignupNode,
    TKNode,
    AtLinkNode,
    AtLinkSearchNode,
    ZWNJNode
];

export default DEFAULT_NODES;
