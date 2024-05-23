const defaultTheme = {
    paragraph: undefined,
    heading: {
        h1: undefined,
        h2: undefined,
        h3: undefined,
        h4: undefined,
        h5: undefined,
        h6: undefined
    },
    quote: undefined,
    aside: undefined,
    list: {
        nested: {
            listitem: '!list-none'
        },
        ol: undefined,
        ul: undefined,
        listitem: undefined
    },
    link: undefined,
    text: {
        bold: undefined,
        italic: 'italic',
        overflowed: undefined,
        hashtag: undefined,
        underline: 'underline',
        strikethrough: 'line-through',
        underlinestrikethrough: undefined,
        code: undefined
    },
    code: undefined,
    tkHighlighted: 'bg-lime-500 dark:bg-lime-800 py-1',
    atLink: 'inline-block bg-grey-200 dark:bg-grey-800 px-1',
    atLinkSearch: 'after:content-[attr(data-placeholder)] after:text-grey-500 min-w-[5px]'
};

export default defaultTheme;
