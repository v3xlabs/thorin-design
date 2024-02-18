import { ThorinLabel as Webcomponent } from '@ens-tools/thorin-core';
import { createComponent } from '@lit/react';
import React from 'react';

export interface ThorinLabelProperties {
    children?: React.ReactNode;
    variant: 'default' | 'active' | 'helper';
}

// Create the component with the defined properties
export const ThorinLabel: React.FC<ThorinLabelProperties> = createComponent({
    tagName: 'thorin-label',
    elementClass: Webcomponent,
    react: React,
    events: {},
});
