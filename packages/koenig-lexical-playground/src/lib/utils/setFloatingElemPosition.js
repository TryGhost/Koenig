/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const VERTICAL_GAP = 10;
const HORIZONTAL_OFFSET = 5;

export function setFloatingElemPosition(
    targetRect,
    floatingElem,
    anchorElem,
    verticalGap = VERTICAL_GAP,
    horizontalOffset = HORIZONTAL_OFFSET,
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
    let left = targetRect.left - horizontalOffset;

    if (top < editorScrollerRect.top) {
        top += floatingElemRect.height + targetRect.height + verticalGap * 2;
    }

    if (left + floatingElemRect.width > editorScrollerRect.right) {
        left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
    }

    top -= anchorElementRect.top;
    left -= anchorElementRect.left;

    floatingElem.style.opacity = '1';
    floatingElem.style.top = `${top}px`;
    floatingElem.style.left = `${left}px`;
}
