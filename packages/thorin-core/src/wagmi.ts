import type { Config } from '@wagmi/core';

const globalThing: {
    config: Config | undefined;
} = {
    config: undefined,
};

export const getWagmiConfig = () => {
    return globalThing.config;
};

export const THORIN_CONNECT_PREFIX = '%c[Thorin Connect]';

export const setupConfig = (config: Config | (() => Config)) => {
    console.log(
        THORIN_CONNECT_PREFIX,
        'color: #3396ff',
        'Setting up config',
        config
    );
    globalThing.config = typeof config === 'function' ? config() : config;
    window.dispatchEvent(
        new CustomEvent('wagmiConfigChangedThorin', {
            detail: globalThing.config,
        })
    );
};
