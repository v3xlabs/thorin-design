import { ThorinTag as Webcomponent } from '@ens-tools/thorin-core';
import { createComponent } from '@lit/react';
import React from 'react';

export interface ThorinTagProperties {
    children?: React.ReactNode;
    variant: 'blue' | 'red' | 'yellow' | 'green' | 'grey';
}

// Create the component with the defined properties
export const ThorinTag: React.FC<ThorinTagProperties> = createComponent({
    tagName: 'thorin-tag',
    elementClass: Webcomponent,
    react: React,
    events: {},
});
