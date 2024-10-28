import { setupConfig } from '@ens-tools/thorin-core';
import '@ens-tools/thorin-core/style.css';
import 'webcomponent-qr-code';
import { mainnet, sepolia } from 'wagmi/chains';
import { createConfig, http, injected } from '@wagmi/core'
import { walletConnect } from '@wagmi/connectors';

const config = createConfig(
    {
        chains: [mainnet],
        connectors: [
            injected() as any,
            walletConnect({
                projectId: '3b205429cec06896f1d18c3b46dc5a68',
                // metadata: {
                // },
                showQrModal: false,
            }),
        ],
        transports: {
            [mainnet.id]: http(),
            [sepolia.id]: http(),
        },
    }
)

setupConfig(() => config);
