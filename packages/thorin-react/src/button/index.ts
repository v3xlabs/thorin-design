import { ThorinButton as Webcomponent } from '@ens-tools/thorin-core';
import { createComponent } from '@lit/react';
import React from 'react';

type ButtonActionVariant =
    | 'primary'
    | 'secondary'
    | 'error'
    | 'error-secondary'
    | 'subtle'
    | 'disabled';
type ButtonColorVariant =
    | 'blue'
    | 'indigo'
    | 'purple'
    | 'pink'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'grey';
type ButtonVariant = ButtonActionVariant | ButtonColorVariant;

export interface ThorinButtonProperties {
    variant?: ButtonVariant;
    children?: React.ReactNode;
    width?: 'auto' | 'full';
    onClick?: (_event: PointerEvent) => void;
    href?: string | undefined;
    target?: string | undefined;
}

// Create the component with the defined properties
export const ThorinButton: React.FC<ThorinButtonProperties> = createComponent({
    tagName: 'thorin-button',
    elementClass: Webcomponent,
    react: React,
    events: {
        onClick: 'click',
    },
});
