import { ThorinModal as Webcomponent } from '@ens-tools/thorin-core';
import { createComponent } from '@lit/react';
import React from 'react';

export interface ThorinModalProperties {
    children?: React.ReactNode;
    modalTitle?: string;
    closeOnRequest?: boolean;
    open: boolean;
    onClose?: (_event: PointerEvent) => void;
}

// Create the component with the defined properties
export const ThorinModal: React.FC<ThorinModalProperties> = createComponent({
    tagName: 'thorin-modal',
    elementClass: Webcomponent,
    react: React,
    events: {
        onClose: 'onClose',
    },
});
