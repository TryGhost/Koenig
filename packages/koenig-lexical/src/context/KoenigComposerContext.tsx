import React from 'react';
import type {Doc} from 'yjs';

export interface FileTypeConfig {
    mimeTypes: string[];
}

export interface FileUploadResult {
    isLoading: boolean;
    upload: (files: File[] | FileList, options?: Record<string, unknown>) => Promise<{url: string}[] | null>;
    progress: number;
    errors: {message: string}[];
    filesNumber: number;
    [key: string]: unknown;
}

export interface FileUploader {
    useFileUpload: (type: string) => FileUploadResult;
    fileTypes: Record<string, FileTypeConfig>;
    [key: string]: unknown;
}

export interface PinturaConfig {
    jsUrl?: string;
    cssUrl?: string;
}

export interface EmbedResponse {
    url?: string;
    title?: string;
    description?: string;
    icon?: string;
    thumbnail?: string;
    author?: string;
    publisher?: string;
    type?: string;
    html?: string;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface CardConfig {
    createSnippet?: (...args: unknown[]) => void;
    fetchEmbed?: (url: string, options: Record<string, unknown>) => Promise<EmbedResponse>;
    fetchLabels?: () => Promise<string[]>;
    fetchAutocompleteLinks?: () => Promise<{value: string; label: string}[]>;
    searchLinks?: (term?: string) => Promise<unknown>;
    siteUrl?: string;
    tenor?: {googleApiKey: string; contentFilter?: string};
    unsplash?: unknown;
    pinturaConfig?: PinturaConfig;
    renderLabels?: boolean;
    image?: {allowedWidths?: string[]};
    feature?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface KoenigComposerContextType {
    fileUploader: FileUploader;
    editorContainerRef: React.RefObject<HTMLElement | null>;
    cardConfig: CardConfig;
    darkMode: boolean;
    enableMultiplayer: boolean;
    isTKEnabled?: boolean;
    multiplayerEndpoint?: string;
    multiplayerDocId?: string;
    multiplayerUsername?: string;
    createWebsocketProvider: (id: string, yjsDocMap: Map<string, Doc>) => unknown;
    onWordCountChangeRef: React.RefObject<((counts: unknown) => void) | null>;
    onError?: (error: Error) => void;
    dragDropHandler?: unknown;
    [key: string]: unknown;
}

const KoenigComposerContext = React.createContext<KoenigComposerContextType>({} as KoenigComposerContextType);

export default KoenigComposerContext;
