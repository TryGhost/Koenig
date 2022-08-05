import {ADD_CARD_HOOK, REMOVE_CARD_HOOK} from './utils/constants';
import {Range as MobiledocRange} from 'mobiledoc-kit';
import arrayToMap from './utils/array-to-map';

class KoenigEditor {
    componentCards = [];
    mobiledocEditor = null;
    editorProps = {};

    // sets up the class and populates `editorProps` prior to mobiledoc initialisation
    constructor({
        atoms,
        cards,
        cardProps,
        keyCommands,
        textExpansions,
        onSelectedRangeChange,
        onActiveMarkupTagsChange,
        onActiveSectionTagsChange
    } = {}) {
        this.atoms = atoms;
        this.cards = cards;
        this.keyCommands = keyCommands;
        this.textExpansions = textExpansions;

        this.onSelectedRangeChange = onSelectedRangeChange;
        this.onActiveMarkupTagsChange = onActiveMarkupTagsChange;
        this.onActiveSectionTagsChange = onActiveSectionTagsChange;

        this.selectedCard = null;

        const componentHooks = {
            [ADD_CARD_HOOK]: ({env, options, payload}, koenigOptions, destinationElement) => {
                const {name, postModel} = env;

                // the payload must be copied to avoid sharing the reference.
                // `payload.files` is special because it's set by paste/drag-n-drop
                // events and can't be copied for security reasons
                // const {files} = payload;
                const payloadCopy = JSON.parse(JSON.stringify(payload || null));

                // all of the props that will be passed through to the
                // component cards when rendering
                const card = {
                    name,
                    props: {
                        env,
                        isEditing: false, // shouldn't be used - our cards handle edit mode within their components
                        isSelected: false,
                        koenigOptions,
                        mobiledocEditor: this.mobiledocEditor,
                        koenigEditor: this,
                        name,
                        options,
                        payload: payloadCopy,
                        postModel
                    },
                    destinationElement,
                    destinationElementId: destinationElement.id,
                    koenigOptions
                };

                // partially apply some prop functions for working with the card
                [
                    'scrollToCard',
                    'selectCard',
                    'deselectCard',
                    'editCard',
                    'deleteCard',
                    'moveCursorToPrevSection',
                    'moveCursorToNextSection',
                    'addParagraphAfterCard'
                ].forEach((methodName) => {
                    card.props[methodName] = () => this[methodName](card, ...arguments);
                });
                card.props.saveAsSnippet = () => this.saveCardAsSnippet(card, ...arguments);

                // we keep an array of all cards that are in the editor so this
                // class can handle card selection and empty card cleanup
                this.componentCards.push(card);

                return card;
            },

            [REMOVE_CARD_HOOK]: (card) => {
                const cardIndex = this.componentCards.indexOf(card);
                if (cardIndex > -1) {
                    this.componentCards.splice(cardIndex, 1);
                }
            }
        };

        this.editorProps = {
            atoms,
            cards,
            cardProps: Object.assign({}, cardProps, componentHooks)
        };
    }

    // used once a mobiledoc editor instance has been created, completes setup
    // of the instance by registering key commands, text expansions, and event handlers
    // which mobiledoc-kit doesn't have a way of passing in via arguments
    initMobiledocEditor(mobiledocEditor) {
        const {keyCommands, textExpansions} = this;

        this.mobiledocEditor = mobiledocEditor;

        if (keyCommands?.length) {
            keyCommands.forEach((command) => {
                this.mobiledocEditor.registerKeyCommand({
                    str: command.str,
                    run() {
                        return command.run(this.mobiledocEditor);
                    }
                });
            });
        }

        if (textExpansions?.length) {
            textExpansions.forEach((textExpansionFactory) => {
                const textExpansion = textExpansionFactory(this);
                textExpansion.unregister?.forEach(key => this.mobiledocEditor.unregisterTextInputHandler(key));
                textExpansion.register?.forEach(expansion => this.mobiledocEditor.onTextInput(expansion));
            });
        }

        this.mobiledocEditor.cursorDidChange(() => {
            this.cursorDidChange();
        });

        this.mobiledocEditor.inputModeDidChange(() => {
            this.inputModeDidChange();
        });
    }

    // API ---------------------------------------------------------------------

    /* eslint-disable no-console */

    exitCursorAtTop() {
        console.error('KoenigEditor.exitCursorAtTop not implemented');
    }

    toggleMarkup() {
        console.error('KoenigEditor.toggleMarkup not implemented');
    }

    toggleSection() {
        console.error('KoenigEditor.toggleSection not implemented');
    }

    toggleHeaderSection() {
        console.error('KoenigEditor.toggleHeaderSection not implemented');
    }

    selectCard() {
        console.error('KoenigEditor.selectCard not implemented');
    }

    deselectCard() {
        console.error('KoenigEditor.deselectCard not implemented');
    }

    editCard() {
        console.error('KoenigEditor.editCard not implemented');
    }

    deleteCard() {
        console.error('KoenigEditor.deleteCard not implemented');
    }

    scrollToCard() {
        console.error('KoenigEditor.scrollToCard not implemented');
    }

    replaceWithCardSection(cardName, range, payload) {
        const {mobiledocEditor} = this;
        const {head: {section}} = range;

        mobiledocEditor.run((postEditor) => {
            let {builder} = postEditor;
            let card = builder.createCardSection(cardName, payload);
            let nextSection = section.next;
            let needsTrailingParagraph = !nextSection;

            postEditor.replaceSection(section, card);

            // add an empty paragraph after if necessary so writing can continue
            if (needsTrailingParagraph) {
                let newSection = postEditor.builder.createMarkupSection('p');
                postEditor.insertSectionAtEnd(newSection);
                postEditor.setRange(newSection.tailPosition());
            } else {
                postEditor.setRange(nextSection.headPosition());
            }
        });

        // cards are pushed on to the `componentCards` array so we can
        // assume that the last card in the list is the one we want to
        // select. Needs to be scheduled afterRender so that the new card
        // is actually present
        const editOrSelectCard = (card) => {
            if (card.koenigOptions.hasEditMode) {
                this.editCard(card);
            } else if (card.koenigOptions.selectAfterInsert) {
                this.selectCard(card);
            }
        };

        // TODO: this requires waiting for render to complete in Ember - how does it behave in React?
        const card = this.componentCards[this.componentCards.length - 1];

        if (!card) {
            console.warn('replaceWithCardSection: card was not present'); // eslint-disable-line
        }

        editOrSelectCard(card);
    }

    getCardFromSection(section) {
        if (!section || section.type !== 'card-section') {
            return;
        }

        let cardId = section.renderNode.element.querySelector('.__mobiledoc-card').firstChild.id;

        return this.componentCards.find(card => card.destinationElementId === cardId);
    }

    getCardFromElement() {
        console.error('KoenigEditor.getCardFromElement not implemented');
    }

    getSectionFromCard() {
        console.error('KoenigEditor.getSectionFromCard not implemented');
    }

    replaceWithPost() {
        console.error('KoenigEditor.replaceWithPost not implemented');
    }

    editLink() {
        console.error('KoenigEditor.editLink not implemented');
    }

    cancelEditLink() {
        console.error('KoenigEditor.cancelEditLink not implemented');
    }

    moveCursorToNextSection() {
        console.error('KoenigEditor.moveCursorToNextSection not implemented');
    }

    moveCursorToPrevSection() {
        console.error('KoenigEditor.moveCursorToPrevSection not implemented');
    }

    moveCaretToHeadOfSection() {
        console.error('KoenigEditor.moveCaretToHeadOfSection not implemented');
    }

    moveCaretToTailOfSection() {
        console.error('KoenigEditor.moveCaretToTailOfSection not implemented');
    }

    addParagraphAfterCard() {
        console.error('KoenigEditor.addParagraphAfterCard not implemented');
    }

    addSnippet() {
        console.error('KoenigEditor.addSnippet not implemented');
    }

    cancelAddSnippet() {
        console.error('KoenigEditor.cancelAddSnippet not implemented');
    }

    saveCardAsSnippet() {
        console.error('KoenigEditor.saveCardAsSnippet not implemented');
    }

    skipNewline() {
        console.error('KoenigEditor.skipNewline not implemented');
    }

    cleanup() {
        console.error('KoenigEditor.cleanup not implemented');
    }

    // Mobiledoc event handlers ------------------------------------------------

    postDidChange() {

    }

    cursorDidChange() {
        const {mobiledocEditor: editor} = this;
        const {head, tail, direction, isCollapsed, head: {section}} = editor.range;

        // sometimes we perform a programatic edit that causes a cursor change
        // but we actually want to skip the default behaviour because we've
        // already handled it, e.g. on card insertion, manual card selection
        if (this._skipCursorChange) {
            this._skipCursorChange = false;
            this._setSelectedRange(editor.range);
            this._scrollCursorIntoView();
            return;
        }

        // ignore the cursor moving from one end to the other within a selected
        // card section, clicking and other interactions within a card can cause
        // this to happen and we don't want to select/deselect accidentally.
        // See the up/down/left/right key handlers for the card selection
        if (this.selectedCard && this.selectedCard.postModel === section) {
            return;
        }

        // select the card if the cursor is on the before/after &zwnj; char
        if (section && isCollapsed && section.type === 'card-section') {
            if (head.offset === 0 || head.offset === 1) {
                // select card after render to ensure that our componentCards
                // attr is populated
                const card = this.getCardFromSection(section);
                this.selectCard(card);
                this._setSelectedRange(editor.range);
                return;
            }
        }

        // deselect any selected card because the cursor is no longer on a card
        if (this.selectedCard && !editor.range.isBlank) {
            this.deselectCard(this.selectedCard);
        }

        // if we have `code` or ~strike~ formatting to the left but not the right
        // then toggle the formatting - these formats should only be creatable
        // through the text expansions
        // TODO: implement special formats
        // toggleSpecialFormatEditState(editor);

        // do not include the tail section if it's offset is 0
        // fixes triple-click unexpectedly selecting two sections for section-level formatting
        // https://github.com/bustle/mobiledoc-kit/issues/597
        if (direction === 1 && !isCollapsed && tail.offset === 0 && tail.section.prev) {
            const finalSection = tail.section.prev;
            const newRange = new MobiledocRange(head, finalSection.tailPosition());
            return editor.selectRange(newRange);
        }

        // pass the selected range through to the toolbar + menu components
        this._setSelectedRange(editor.range);
        this._scrollCursorIntoView();
    }

    // fired when the active section(s) or markup(s) at the current cursor
    // position or selection have changed. We use this event to update the
    // activeMarkup/section tag lists which control button states in our popup
    // toolbar
    inputModeDidChange() {
        const {mobiledocEditor: editor} = this;

        const markupTags = arrayToMap(editor.activeMarkups.map(m => m.tagName));
        // editor.activeSections are leaf sections.
        // Map parent section tag names (e.g. 'p', 'ul', 'ol') so that list buttons
        // are updated.
        // eslint-disable-next-line no-confusing-arrow
        const sectionParentTagNames = editor.activeSections.map(s => s.isNested ? s.parent.tagName : s.tagName);
        const sectionTags = arrayToMap(sectionParentTagNames);

        // On keyboard cursor movement our `cursorDidChange` toggle for special
        // formats happens before mobiledoc's readstate updates the edit states
        // so we have to re-do it here
        // TODO: can we make the event order consistent in mobiledoc-kit?
        // TODO: implement special formats
        // toggleSpecialFormatEditState(editor);

        this.onActiveMarkupTagsChange?.(markupTags);
        this.onActiveSectionTagsChange?.(sectionTags);
    }

    willHandleNewline() {

    }

    // Custom event handlers ---------------------------------------------------

    // ...

    // Internal methods --------------------------------------------------------

    // ...

    _setSelectedRange(range) {
        this.selectedRange = range;
        this.onSelectedRangeChange?.(range);
    }

    _scrollCursorIntoView() {

    }
}

export default KoenigEditor;
