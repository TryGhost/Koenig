import {ElementNode, $createParagraphNode, LexicalEditor, LexicalNode, Klass} from 'lexical';

export type CreateNodeFn<T extends LexicalNode> = (originalNode: T) => T;

export function denestTransform<T extends ElementNode>(node: T, createNode: CreateNodeFn<T>) {
    const children = node.getChildren();

    const hasInvalidChild = children.some((child: LexicalNode) => {
        return child.isInline && !child.isInline();
    });

    if (!hasInvalidChild) {
        return;
    }

    // we need a temporary detached node to hold any moved nodes otherwise
    // we can trigger an infinite loop with the transform continually
    // re-running on each child move
    const tempParagraph = $createParagraphNode();

    // we need a new node of the current node type to collect inline
    // children so we can maintain order when moving the non-inline children
    // out. Will be appended and replaced with a new node each time we
    // find a non-inline child
    let currentElementNode = createNode(node);

    // pull out any non-inline children as we don't support nested element nodes
    children.forEach((child: LexicalNode) => {
        if (child.isInline && !child.isInline()) {
            if (currentElementNode.getChildrenSize() > 0) {
                tempParagraph.append(currentElementNode);
                currentElementNode = createNode(node);
            }
            tempParagraph.append(child);
        } else {
            currentElementNode.append(child);
        }
    });

    // append any remaining text nodes
    if (currentElementNode.getChildrenSize() > 0) {
        tempParagraph.append(currentElementNode);
    }

    // reverse because we can only insertAfter the current paragraph
    // so we need to insert the first child last to maintain order
    tempParagraph.getChildren().reverse().forEach((child) => {
        node.insertAfter(child);
    });

    // remove the original paragraph
    node.remove();

    // clean up the temporary paragraph immediately, although it should be
    // cleaned up by the reconciler's garbage collection of detached nodes
    tempParagraph.remove();
}

export function registerDenestTransform<T extends ElementNode>(editor: LexicalEditor, klass: Klass<T>, createNode: CreateNodeFn<T>): () => void {
    if (editor.hasNodes([klass])) {
        return editor.registerNodeTransform(klass, (node) => {
            denestTransform(node, createNode);
        });
    }

    return () => {};
}
