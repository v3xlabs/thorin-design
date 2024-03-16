import { ThorinAvatar as Webcomponent } from '@ens-tools/thorin-core';
import { createComponent } from '@lit/react';
import React from 'react';

export interface ThorinAvatarProperties {
    children?: React.ReactNode;
    name: string;
}

// Create the component with the defined properties
export const ThorinAvatar: React.FC<ThorinAvatarProperties> = createComponent({
    tagName: 'thorin-avatar',
    elementClass: Webcomponent,
    react: React,
    events: {},
});
