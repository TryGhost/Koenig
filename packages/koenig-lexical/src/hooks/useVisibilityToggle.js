import {$getNodeByKey} from 'lexical';
import {getVisibilityOptions, parseVisibilityToToggles, serializeOptionsToVisibility} from '../utils/visibility';

export const useVisibilityToggle = (editor, nodeKey, cardConfig) => {
    const isStripeEnabled = cardConfig?.stripeEnabled;
    const showWeb = cardConfig?.visibilitySettings?.showWeb ?? true;
    const showEmail = cardConfig?.visibilitySettings?.showEmail ?? true;

    let currentVisibility;

    editor.getEditorState().read(() => {
        const htmlNode = $getNodeByKey(nodeKey);
        currentVisibility = htmlNode.visibility;
    });

    const visibilityData = parseVisibilityToToggles(currentVisibility);
    const visibilityOptions = getVisibilityOptions(currentVisibility, {isStripeEnabled, showWeb, showEmail});

    return {
        visibilityData,
        visibilityOptions,
        toggleVisibility: (type, key, value) => {
            editor.update(() => {
                const node = $getNodeByKey(nodeKey);
                if (!node) {
                    return;
                }
                const newVisibilityOptions = structuredClone(getVisibilityOptions(node.visibility, {isStripeEnabled, showWeb, showEmail}));
                const toggle = newVisibilityOptions.find(g => g.key === type)?.toggles.find(t => t.key === key);
                if (!toggle) {
                    return;
                }

                toggle.checked = value;
                node.visibility = serializeOptionsToVisibility(newVisibilityOptions, node.visibility);
            });
        }
    };
};
