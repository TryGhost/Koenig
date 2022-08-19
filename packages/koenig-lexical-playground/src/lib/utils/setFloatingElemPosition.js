const VERTICAL_GAP = 10;

export function setFloatingElemPosition(
    targetRect,
    floatingElem,
    anchorElem,
    verticalGap = VERTICAL_GAP,
) {
    const scrollerElem = anchorElem.parentElement;

    if (targetRect === null || !scrollerElem) {
        floatingElem.style.opacity = '0';
        floatingElem.style.top = '-10000px';
        floatingElem.style.left = '-10000px';

        return;
    }

    const floatingElemRect = floatingElem.getBoundingClientRect();
    const anchorElementRect = anchorElem.getBoundingClientRect();
    const editorScrollerRect = scrollerElem.getBoundingClientRect();

    let top = targetRect.top - floatingElemRect.height - verticalGap;
    let left = targetRect.left + targetRect.width / 2 - floatingElemRect.width / 2;

    if (left + floatingElemRect.width > editorScrollerRect.right) {
        left = editorScrollerRect.right - floatingElemRect.width;
    }

    top -= anchorElementRect.top;
    left -= anchorElementRect.left;

    floatingElem.style.opacity = '1';
    floatingElem.style.top = `${top}px`;
    floatingElem.style.left = `${left}px`;
}
