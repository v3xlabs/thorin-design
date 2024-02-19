import { hello, setupConfig } from '@ens-tools/thorin-core';
import '@ens-tools/thorin-core/style.css';
import 'webcomponent-qr-code';
import { mainnet, sepolia } from 'wagmi/chains';
import { createConfig, http } from '@wagmi/core'


hello();

const config = createConfig(
    {
        chains: [mainnet],
        // connectors: [
        //     injected() as any
        // ],
        transports: {
            [mainnet.id]: http(),
            [sepolia.id]: http(),
        },
    }
)

setupConfig(config);

