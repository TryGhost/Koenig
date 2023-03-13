function toggleCardTemplate({node}) {
    const content = node.getContent();
    const contentPlaceholder = node.getContentPlaceholder();
    const header = node.getHeader();
    const headerPlaceholder = node.getHeaderPlaceholder();

    return (
        `
        <div class="kg-toggle-card">
            <div class="kg-toggle-card-header">
                <div class="kg-toggle-card-heading" data-kg-has-link-toolbar="true"
                    data-koenig-dnd-disabled="true">
                    <div class="koenig-basic-html-input__editor-wrappper" style="cursor: text">
                        <div class="koenig-basic-html-input__editor __mobiledoc-editor __has-no-content" data-kg="editor"
                            data-kg-allow-clickthrough="" data-placeholder="${headerPlaceholder}" spellcheck="true"
                            contenteditable="true">
                            <h4>${header}</h4>
                        </div>
                    </div>
                </div>
                <div class="kg-toggle-card-arrow-container">
                    <div class="kg-toggle-card-arrow">
                        <svg viewBox="0 0 24 24">
                            <title>arrow-down-1</title>
                            <path d="M23.25 7.311L12.53 18.03a.749.749 0 01-1.06 0L.75 7.311" fill="none" stroke="currentColor"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" fill-rule="evenodd"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="w-100 bn bg-transparent kg-toggle-card-content" data-kg-has-link-toolbar="true"
                data-koenig-dnd-disabled="true">
                <div class="koenig-basic-html-textarea__editor-wrappper" style="cursor: text">
                    <div class="koenig-basic-html-textarea__editor __mobiledoc-editor" data-kg="editor"
                        data-kg-allow-clickthrough="" data-placeholder="${contentPlaceholder}" spellcheck="true"
                        contenteditable="true">
                        <p>${content}</p>
                    </div>
                </div>
            </div>
        </div>
        `
    );
}

export function renderToggleNodeToDOM(node, options = {}) {
    /* c8 ignore start */
    if (!options.createDocument) {
        let document = typeof window !== 'undefined' && window.document;

        if (!document) {
            throw new Error('renderToggleNodeToDOM() must be passed a `createDocument` function as an option when used in a non-browser environment'); // eslint-disable-line
        }

        options.createDocument = function () {
            return document;
        };
    }
    /* c8 ignore stop */

    const document = options.createDocument();

    const htmlString = toggleCardTemplate({node});

    const element = document.createElement('div');
    element.innerHTML = htmlString.trim();

    return element.firstElementChild;
}