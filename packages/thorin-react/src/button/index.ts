import type { ThorinButton } from '@ens-tools/thorin-core';
import type { DOMAttributes } from 'react';

// export const ThorinButton = createComponent({
//     tagName: 'thorin-button',
//     elementClass: ThorinButtonX,
//     react: React,
//     events: {
//         onclick: 'click',
//     },
// });

type CustomEvents<K extends string> = {
    [key in K]: (event: CustomEvent) => void;
};

type CustomElement<T, K extends string> = Partial<
    T & DOMAttributes<T> & { children: any } & CustomEvents<`on${K}`>
>;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['thorin-button']: CustomElement<typeof ThorinButton, 'onClick'>;
        }
    }
}
