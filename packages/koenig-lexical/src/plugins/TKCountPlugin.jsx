import React from 'react';
import {useTKContext} from '../context/TkContext';

export default function TKCountPlugin({onChange}) {
    const {tkCount} = useTKContext();

    React.useEffect(() => {
        if (!onChange) {
            return;
        }

        onChange(tkCount);
    }, [onChange, tkCount]);
}
