import {$getNodeByKey} from 'lexical';

export const useVisibilityToggle = (editor, nodeKey, cardConfig) => {
    const isStripeEnabled = cardConfig?.stripeEnabled;

    const dropdownOptions = () => {
        if (isStripeEnabled) {
            return [{
                label: 'All subscribers',
                name: ''
            }, {
                label: 'Free subscribers',
                name: 'status:free'
            }, {
                label: 'Paid subscribers',
                name: 'status:-free'
            }];
        }
    };

    let isVisibilityActive = false;
    let showOnWeb = true;
    let showOnEmail = true;
    let segment = '';
    let message = '';

    editor.getEditorState().read(() => {
        const htmlNode = $getNodeByKey(nodeKey);
        const visibility = htmlNode.visibility;

        isVisibilityActive = htmlNode.getIsVisibilityActive();
        showOnWeb = visibility.showOnWeb;
        showOnEmail = visibility.showOnEmail;
        segment = visibility.segment;
    });

    if (isVisibilityActive) {
        let segmentLabel = '';

        if (segment === 'status:free') {
            segmentLabel = 'free subscribers';
        } else if (segment === 'status:-free') {
            segmentLabel = 'paid subscribers';
        }

        if (!showOnWeb && !showOnEmail) {
            message = 'Hidden from both email and web';
        } else if (showOnWeb && !showOnEmail) {
            message = 'Only shown on web';
        } else if (showOnWeb && showOnEmail && segmentLabel) {
            message = `Shown on web, and to ${segmentLabel} in email`;
        } else if (!showOnWeb && showOnEmail && !segmentLabel) {
            message = 'Only shown in email';
        } else if (!showOnWeb && showOnEmail && segmentLabel) {
            message = `Only shown to ${segmentLabel} in email`;
        }
    }

    const toggleEmail = (e) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.visibility = {...node.visibility, showOnEmail: e.target.checked};
        });
    };

    const toggleWeb = (e) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.visibility = {...node.visibility, showOnWeb: e.target.checked};
        });
    };

    const toggleSegment = (name) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.visibility = {...node.visibility, segment: name};
        });
    };

    return [toggleEmail, toggleSegment, toggleWeb, segment, showOnEmail, showOnWeb, dropdownOptions(), message];
};
