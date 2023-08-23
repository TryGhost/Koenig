import KoenigComposerContext from '../../../context/KoenigComposerContext.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import {SettingsPanel} from '../SettingsPanel';

export function HorizontalRuleCard({
    alignment,
    handleAlignmentChange,
    isEditing
}) {
    const {darkMode} = React.useContext(KoenigComposerContext);
    
    return (
        <>
            <div className="inline-block w-full">
                <hr className="m-0 block h-[1px] border-0 border-t border-grey-300" />
            </div>
            <SettingsPanel
                darkMode={darkMode}
            >
            </SettingsPanel>
        </>
    );
}

HorizontalRuleCard.propTypes = {
    alignment: PropTypes.string,
    handleAlignmentChange: PropTypes.func,
    isEditing: PropTypes.bool,
};

