import {NodeKey} from 'lexical';

// see Ghost/ghost/core/core/server/lib/lexical.js
export type RendererOptions = {
    createDocument?: () => Document;
    target?: 'email', // for rendering to email
    dom: import('jsdom').JSDOM;
    postUrl?: string, // used by email renderer
    // NOTE: Leave this as any for now until we have a better understanding of how we will use the dynamic data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderData?: Map<NodeKey, any>; // for rendering of data that requires external (dynamic) data
    getCollectionPosts?: (collection: string, postCount: number) => Promise<[]>,
    siteUrl?: string, // used for content/media
    // TODO: imageOptimization comes from Ghost config but we don't have any type for it now and it would create more
    //  trouble to define what we do have here than to leave it open ended.
    imageOptimization?: object,
    canTransformImage?: boolean,
};