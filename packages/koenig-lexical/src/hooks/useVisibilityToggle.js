import {$getNodeByKey} from 'lexical';
import {useState} from 'react';

export const useVisibilityToggle = (editor, nodeKey, initialVisibility) => {
    const [emailVisibility, setEmailVisibility] = useState(initialVisibility.showOnEmail);
    const [webVisibility, setWebVisibility] = useState(initialVisibility.showOnWeb);
    const [segment, setSegment] = useState(initialVisibility.segment);

    const toggleEmail = (e) => {
        editor.update(() => {
            setEmailVisibility(e.target.checked);
            const node = $getNodeByKey(nodeKey);
            node.visibility = {...node.visibility, showOnEmail: e.target.checked};
        });
    };

    const toggleWeb = (e) => {
        editor.update(() => {
            setWebVisibility(e.target.checked);
            const node = $getNodeByKey(nodeKey);
            node.visibility = {...node.visibility, showOnWeb: e.target.checked};
        });
    };

    const toggleSegment = (name) => {
        editor.update(() => {
            setSegment(name);
            const node = $getNodeByKey(nodeKey);
            node.visibility = {...node.visibility, segment: name};
        });
    };

    const dropdownOptions = [{
        label: 'All subscribers',
        name: ''
    }, {
        label: 'Free subscribers',
        name: 'status:free'
    }, {
        label: 'Paid subscribers',
        name: 'status:-free'
    }];

    return [toggleEmail, toggleSegment, toggleWeb, segment, emailVisibility, webVisibility, dropdownOptions];
};
