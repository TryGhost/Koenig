import React, {Component} from 'react';

function guidFor() {
    // create unique id
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0;
        let v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default class MovablePlugin extends Component{
    moveThreshold = 3;

    active = false;
    currentX = undefined;
    currentY = undefined;
    initialX = undefined;
    initialY = undefined;
    xOffset = 0;
    yOffset = 0;
    constructor({children, adjustOnResize}) {
        super();
        this.elementRef = React.createRef();
        this.children = children;
        this.adjustOnResize = adjustOnResize;
        this._dragStart = this.dragStart.bind(this);
        this._dragEnd = this.dragEnd.bind(this);
        this._drag = this.drag.bind(this);
        this.guid = guidFor();
    }

    componentDidMount() {
        this.elem = this.elementRef.current;
        this.elem.classList.add('kg-card-movable');

        this.addStartEventListeners();

        if (this.adjustOnResize) {
            this._resizeObserver = new ResizeObserver(() => {
                if (this.currentX === undefined || this.currentY === undefined) {
                    return;
                }

                const {x, y} = this.adjustOnResize(this.elem, {x: this.currentX, y: this.currentY});

                if (x === this.currentX && y === this.currentY) {
                    return;
                }

                this.currentX = x;
                this.initialX = x;
                this.xOffset = x;

                this.currentY = y;
                this.initialY = y;
                this.yOffset = y;

                this.setTranslate(x, y);
            });
            this._resizeObserver.observe(this.elem);
        }
    }

    // component unmount
    componentWillUnmount() {
        this.removeEventListeners();
        this.removeResizeObserver();
        this.enableSelection();
    }

    render() {
        return (
            <div ref={this.elementRef} id='movable-thing' draggable>
                {this.children}
            </div>
        );
    }

    addStartEventListeners() {
        this.elem.addEventListener('touchstart', this._dragStart, false);
        this.elem.addEventListener('mousedown', this._dragStart, false);
    }

    removeStartEventListeners() {
        this.elem.removeEventListener('touchstart', this._dragEnd, false);
        this.elem.removeEventListener('mousedown', this._dragEnd, false);
    }

    addActiveEventListeners() {
        window.addEventListener('touchend', this._dragEnd, {capture: true, passive: false});
        window.addEventListener('touchmove', this._dragEnd, {capture: true, passive: false});
        window.addEventListener('mouseup', this._dragEnd, {capture: true, passive: false});
        window.addEventListener('mousemove', this._drag, {capture: true, passive: false});
    }

    removeActiveEventListeners() {
        window.removeEventListener('touchend', this._dragEnd, {capture: true, passive: false});
        window.removeEventListener('touchmove', this._drag, {capture: true, passive: false});
        window.removeEventListener('mouseup', this._dragEnd, {capture: true, passive: false});
        window.removeEventListener('mousemove', this._drag, {capture: true, passive: false});

        // Removing this immediately results in the click event behind re-enabled in the same
        // event loop meaning that it doesn't have the desired effect when dragging out of the canvas.
        // Putting in the next tick stops the immediate click event firing when finishing drag
        setTimeout(() => {
            window.removeEventListener('click', this.cancelClick.bind(this), {capture: true, passive: false});
        }, 1);
    }

    removeEventListeners() {
        this.removeStartEventListeners();
        this.removeActiveEventListeners();
    }

    removeResizeObserver() {
        this._resizeObserver?.disconnect();
    }

    dragStart(e) {
        if (e.type === 'touchstart' || e.button === 0) {
            if (e.type === 'touchstart') {
                this.initialX = e.touches[0].clientX - (this.xOffset || 0);
                this.initialY = e.touches[0].clientY - (this.yOffset || 0);
            } else {
                this.initialX = e.clientX - (this.xOffset || 0);
                this.initialY = e.clientY - (this.yOffset || 0);
            }

            for (const elem of (e.path || e.composedPath())) {
                if (elem?.matches?.('input, .ember-basic-dropdown-trigger')) {
                    break;
                }

                if (elem === this.elem) {
                    this.addActiveEventListeners();
                    break;
                }
            }
        }
    }

    drag(e) {
        e.preventDefault();

        let eventX, eventY;

        if (e.type === 'touchmove') {
            eventX = e.touches[0].clientX;
            eventY = e.touches[0].clientY;
        } else {
            eventX = e.clientX;
            eventY = e.clientY;
        }

        if (!this.active) {
            if (
                Math.abs(Math.abs(this.initialX - eventX) - Math.abs(this.xOffset)) > this.moveThreshold ||
                Math.abs(Math.abs(this.initialY - eventY) - Math.abs(this.yOffset)) > this.moveThreshold
            ) {
                // this.dropdown.closeDropdowns();
                this.disableScroll();
                this.disableSelection();
                this.disablePointerEvents();
                this.active = true;
            }
        }

        if (this.active) {
            this.currentX = eventX - this.initialX;
            this.currentY = eventY - this.initialY;
            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.setTranslate(this.currentX, this.currentY);
        }
    }

    dragEnd(e) {
        e.preventDefault();
        e.stopPropagation();

        this.active = false;

        this.initialX = this.currentX;
        this.initialY = this.currentY;

        this.removeActiveEventListeners();
        this.enableScroll();
        this.enableSelection();

        // timeout required so immediate events blocked until the dragEnd has fully realised
        setTimeout(() => {
            this.enablePointerEvents();
        }, 5);
    }

    cancelClick(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    setTranslate(xPos, yPos) {
        this.elem.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    disableScroll() {
        this.originalOverflow = this.elem.style.overflow;
        this.elem.style.overflow = 'hidden';
    }

    enableScroll() {
        this.elem.style.overflow = this.originalOverflow;
    }

    disableSelection() {
        window.getSelection().removeAllRanges();

        const stylesheet = document.createElement('style');
        stylesheet.id = `stylesheet-${this.guid}`;

        document.head.appendChild(stylesheet);

        stylesheet.sheet.insertRule('* { user-select: none !important; }', 0);
    }

    enableSelection() {
        const stylesheet = document.getElementById(`stylesheet-${this.guid}`);
        stylesheet?.remove();
    }

    // disabling pointer events prevents inputs being activated when drag finishes,
    // preventing clicks stops any event handlers that may otherwise result in the
    // movable element being closed when the drag finishes
    disablePointerEvents() {
        this.elem.style.pointerEvents = 'none';
        window.addEventListener('click', this.cancelClick, {capture: true, passive: false});
    }

    enablePointerEvents() {
        this.elem.style.pointerEvents = '';
        window.removeEventListener('click', this.cancelClick, {capture: true, passive: false});
    }
}