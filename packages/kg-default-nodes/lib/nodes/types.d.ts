// fix cleanBasicHtml import
declare module '@tryghost/kg-clean-basic-html' {
    export default function cleanBasicHtml(html: string, options: {
        createDocument: (htmlString: string) => Document;
    }): string;
}