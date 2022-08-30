const {
    $getRoot,
    $isElementNode,
    $isLineBreakNode,
    $isTextNode
} = require('lexical');
const {
    $isLinkNode
} = require('@lexical/link');
const {
    elementTransformers
    // textTransformers
} = require('./transformers');

function $convertToHtmlString(/*transformers, options*/) {
    const output = [];
    const children = $getRoot().getChildren();

    for (const child of children) {
        const result = exportTopLevelElementOrDecorator(child);

        if (result !== null) {
            output.push(result);
        }
    }

    return output.join('\n');
}

function exportTopLevelElementOrDecorator(node) {
    for (const transformer of elementTransformers) {
        if (transformer.export !== null) {
            const result = transformer.export(node, _node => exportChildren(_node));

            if (result !== null) {
                return result;
            }
        }
    }

    return $isElementNode(node) ? exportChildren(node) : null;
}

function exportChildren(node) {
    const output = [];
    const children = node.getChildren();

    for (const child of children) {
        if ($isLineBreakNode(child)) {
            output.push('<br>');
        } else if ($isTextNode(child)) {
            output.push(exportTextNode(child, child.getTextContent(), node));
        } else if ($isLinkNode(child)) {
            output.push('TODO: add link rendering');
        } else if ($isElementNode(child)) {
            output.push(exportChildren(child));
        }
    }

    return output.join('');
}

function exportTextNode(node, textContent/*, parentNode*/) {
    let output = textContent;

    // TODO: render formats

    return output;
}

module.exports = {
    $convertToHtmlString
};
