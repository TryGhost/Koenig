/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
    readonly VITE_TEST?: string;
}

declare const __APP_VERSION__: string;

declare module '@tryghost/kg-simplemde';
declare module 'pluralize';
declare module 'react-slider';
declare module 'react-highlight';
