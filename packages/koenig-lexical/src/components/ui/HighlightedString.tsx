import escapeRegExp from 'lodash/escapeRegExp';

interface HighlightedStringProps {
    string: string;
    highlightString?: string;
    shouldHighlight?: boolean;
}

export function HighlightedString({string, highlightString, shouldHighlight = true}: HighlightedStringProps) {
    if (!highlightString || shouldHighlight === false) {
        return string;
    }

    const parts = string.split(new RegExp(`(${escapeRegExp(highlightString)})`, 'gi'));

    return (
        <>
            {parts.map((part, index) => {
                if (part.toLowerCase() === highlightString.toLowerCase()) {
                    return <span key={index} className="font-bold">{part}</span>;
                }

                return part;
            })}
        </>
    );
}
