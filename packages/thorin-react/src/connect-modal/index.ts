import { ThorinConnectModal as Webcomponent } from '@ens-tools/thorin-core';
import { createComponent } from '@lit/react';
import React from 'react';

export interface ThorinConnectModalProperties {
    children?: React.ReactNode;
    open: boolean;
    onClose?: (_event: PointerEvent) => void;
}

// Create the component with the defined properties
export const ThorinConnectModal: React.FC<ThorinConnectModalProperties> =
    createComponent({
        tagName: 'thorin-connect-modal',
        elementClass: Webcomponent,
        react: React,
        events: {
            onClose: 'onClose',
        },
    });
