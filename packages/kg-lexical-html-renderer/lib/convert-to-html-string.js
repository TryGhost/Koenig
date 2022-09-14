const {
    $getRoot,
    $isElementNode,
    $isLineBreakNode,
    $isTextNode
} = require('lexical');
const {
    elementTransformers,
    textTransformers
} = require('./transformers');

const FORWARD = false;
const BACKWARD = true;

function $convertToHtmlString(options = {}) {
    const output = [];
    const children = $getRoot().getChildren();

    for (const child of children) {
        const result = exportTopLevelElementOrDecorator(child, options);

        if (result !== null) {
            output.push(result);
        }
    }

    return output.join('\n');
}

function exportTopLevelElementOrDecorator(node, options) {
    for (const transformer of elementTransformers) {
        if (transformer.export !== null) {
            const result = transformer.export(node, options, _node => exportChildren(_node, options));

            if (result !== null) {
                return result;
            }
        }
    }

    return $isElementNode(node) ? exportChildren(node, options) : null;
}

function exportChildren(node, options) {
    const output = [];
    const children = node.getChildren();

    for (const child of children) {
        if ($isLineBreakNode(child)) {
            output.push('<br>');
        } else if ($isTextNode(child)) {
            output.push(exportTextNode(child, child.getTextContent(), node, options));
        } else if ($isElementNode(child)) {
            output.push(exportChildren(child, options));
        }
    }

    return output.join('');
}

function exportTextNode(node, textContent/*, parentNode, options*/) {
    let output = textContent;

    for (const transformer of textTransformers) {
        const {
            format,
            tag,
            tagClose
        } = transformer;

        if (
            hasFormat(node, format)
        ) {
            // Prevent adding extra wrapping tags if it's already
            // added by a previous sibling (or will be closed by the next one)
            const previousNode = getTextSibling(node, BACKWARD);

            if (!hasFormat(previousNode, format)) {
                output = tag + output;
            }

            const nextNode = getTextSibling(node, FORWARD);

            if (!hasFormat(nextNode, format)) {
                output = output + tagClose;
            }
        }
    }

    return output;
}

function getTextSibling(node, backward) {
    let sibling = backward ? node.getPreviousSibling() : node.getNextSibling();

    while (sibling) {
        if ($isLineBreakNode(sibling)) {
            sibling = backward
                ? sibling.getPreviousSibling()
                : sibling.getNextSibling();
        }

        if ($isTextNode(sibling)) {
            return sibling;
        }
    }

    return null;
}

function hasFormat(node, format) {
    return $isTextNode(node) && node.hasFormat(format);
}

module.exports = {
    $convertToHtmlString
};
