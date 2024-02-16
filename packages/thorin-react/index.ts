export * from './src/button';
export * from './src/tag';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'thorin-tag': Pick<{ variant: string }, 'variant'>;
        }
    }
}
