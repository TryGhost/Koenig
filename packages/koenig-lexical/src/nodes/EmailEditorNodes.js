import {AsideNode} from '../nodes/AsideNode';
import {BookmarkNode} from '../nodes/BookmarkNode';
import {ButtonNode} from '../nodes/ButtonNode';
import {CalloutNode} from '../nodes/CalloutNode';
import {EmailCtaNode} from '../nodes/EmailCtaNode';
import {
    ExtendedHeadingNode,
    ExtendedQuoteNode,
    ExtendedTextNode,
    TKNode,
    extendedHeadingNodeReplacement,
    extendedQuoteNodeReplacement,
    extendedTextNodeReplacement
} from '@tryghost/kg-default-nodes';
import {FileNode} from '../nodes/FileNode';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {HorizontalRuleNode} from '../nodes/HorizontalRuleNode';
import {HtmlNode} from '../nodes/HtmlNode';
import {ImageNode} from '../nodes/ImageNode';
import {LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';

/**
 * Node set for the email editor.
 * Includes cards appropriate for email content:
 * - Image, Button, Callout, Bookmark, Horizontal Rule, File, HTML, Email CTA
 *
 * Excludes cards that don't work in email:
 * - Video, Audio, Embeds (require JS), Toggle (interactive), Code Block (rendering issues),
 *   Gallery (complex layouts), Signup (already subscribed), Paywall (web-only),
 *   Markdown (internal), Header (complex), GIF (file size), Product
 */
const EMAIL_EDITOR_NODES = [
    // Base text nodes
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
    TKNode,

    // Cards for email
    HorizontalRuleNode,
    ImageNode,
    CalloutNode,
    HtmlNode,
    FileNode,
    ButtonNode,
    BookmarkNode,
    EmailCtaNode
];

export default EMAIL_EDITOR_NODES;
