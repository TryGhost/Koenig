import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext.jsx';
import React from 'react';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar';
import {EDIT_CARD_COMMAND} from '../plugins/KoenigBehaviourPlugin';
import {PaywallCard} from '../components/ui/cards/PaywallCard';
import {ToolbarMenu, ToolbarMenuItem} from '../components/ui/ToolbarMenu';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function PaywallNodeComponent({nodeKey, gate, heading, description, buttonText, emailButtonText, offerId}) {
    const [editor] = useLexicalComposerContext();
    const {isEditing, isSelected} = React.useContext(CardContext);
    const {cardConfig} = React.useContext(KoenigComposerContext);
    const [offers, setOffers] = React.useState([]);

    React.useEffect(() => {
        if (isEditing && cardConfig?.fetchOffers) {
            cardConfig.fetchOffers().then(setOffers).catch(() => setOffers([]));
        }
    }, [isEditing, cardConfig]);

    const handleToolbarEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        editor.dispatchCommand(EDIT_CARD_COMMAND, {cardKey: nodeKey, focusEditor: false});
    };

    const updateProperty = propertyName => (event) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node[propertyName] = event.target.value;
        });
    };

    const updateOfferId = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.offerId = value;
        });
    };

    const updateGate = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.gate = value;
        });
    };

    const selectedOffer = offers.find(offer => offer.id === offerId);
    const isTiersPost = cardConfig?.post?.visibility === 'tiers';

    return (
        <>
            <PaywallCard
                buttonText={buttonText}
                description={description}
                emailButtonText={emailButtonText}
                gate={gate}
                heading={heading}
                isEditing={isEditing}
                isTiersPost={isTiersPost}
                offerId={offerId}
                offers={offers}
                selectedOfferName={selectedOffer?.name}
                sitePaywallCopy={cardConfig?.sitePaywallCopy}
                updateButtonText={updateProperty('buttonText')}
                updateDescription={updateProperty('description')}
                updateEmailButtonText={updateProperty('emailButtonText')}
                updateGate={updateGate}
                updateHeading={updateProperty('heading')}
                updateOfferId={updateOfferId}
            />

            <ActionToolbar
                data-kg-card-toolbar="paywall"
                isVisible={isSelected && !isEditing}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem dataTestId="edit-paywall-cta" icon="edit" isActive={false} label="Edit paywall" onClick={handleToolbarEdit} />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}
