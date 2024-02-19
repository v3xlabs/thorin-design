/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable unicorn/no-nested-ternary */
import { walletConnect } from '@wagmi/connectors';
import {
    type Config,
    type Connection,
    type Connector,
    type GetAccountReturnType,
    connect,
    disconnect,
    getAccount,
    getConnections,
    getConnectors,
} from '@wagmi/core';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

let wagmiConfig = {} as Config;

export const setupConfig = (config: Config) => {
    wagmiConfig = config;
};

@customElement('thorin-connect-modal')
export class ThorinConnectModal extends LitElement {
    @property({ type: Boolean, reflect: true })
    open = false;

    static override styles = css`
        .button-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .connecting-to {
            aspect-ratio: 1/1;
            width: 100%;
            background: var(--thorin-background-secondary);
            border-radius: var(--thorin-radius-card);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4px;
        }
        .connecting-to img {
            width: 48px;
            height: 48px;
            border-radius: 4px;
        }
        .connector-name {
            font-weight: 600;
        }
        .qr {
            display: flex;
            justify-content: center;
            align-items: center;
            aspect-ratio: 1/1;
            width: 280px;

            border-radius: var(--thorin-radius-card);
            overflow: hidden;
        }
        .connected {
            padding: var(--thorin-spacing-4);
            background: var(--thorin-green-surface);
            color: var(--thorin-text-primary);
        }
        .space-y-2 > *:last-child {
            margin-top: var(--thorin-spacing-2);
        }
        .connector {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
        }
        .connector-icon {
            width: 24px;
            height: 24px;
            border-radius: 4px;
        }
    `;

    @state()
    connectors: Connector[] = [];

    @state()
    connections: Connection[] = [];

    @state()
    showQR: string | undefined = undefined;

    @state()
    currentAccount: GetAccountReturnType | undefined = undefined;

    @state()
    connecting: boolean = false;

    @state()
    activeConnector: Connector | undefined = undefined;

    override firstUpdated() {
        const wc = walletConnect({
            projectId: 'b451d5ff25d61b3fde7b30f167a5a957',
            metadata: {
                name: 'Thorin Design System',
                description: 'Connect to Thorin Design System',
                url: 'https://thorin.design',
                icons: [],
            },
            showQrModal: false,
        });

        const connectors = getConnectors(wagmiConfig);

        this.connectors = [...connectors, wc as any];
    }

    override render() {
        const account = getAccount(wagmiConfig);

        const isSignedIn: boolean = account?.address !== undefined;
        const isLoading = this.currentAccount?.isConnecting;
        const isFailing = this.currentAccount?.isDisconnected;

        return html`
            <thorin-modal
                ?open="${this.open}"
                modalTitle="${'Connect Wallet'}"
                @onClose="${() => {
                    this.close();
                }}"
            >
                <div class="space-y-2 max-w-xl">
                    <div>State: ${this.activeConnector?.name}</div>
                    <div>loading: ${isLoading}</div>
                    <div>isDisconnected": ${isFailing}</div>
                    <div>isSignedIn: ${isSignedIn}</div>

                    ${!this.connecting
                        ? html` <div class="button-list">
                              ${this.connectors.map(
                                  (connector) =>
                                      html`
                                          <thorin-button
                                              variant="subtle"
                                              width="full"
                                              .onClick=${() =>
                                                  this._connect(connector)}
                                          >
                                              <div class="connector">
                                                  ${connector.icon
                                                      ? html`<img
                                                            src="${connector.icon}"
                                                            alt="${connector.name}"
                                                            class="connector-icon"
                                                        />`
                                                      : ''}
                                                  <span>${connector.name}</span>
                                              </div>
                                          </thorin-button>
                                      `
                              )}
                          </div>`
                        : ''}
                    ${this.currentAccount
                        ? html`
                              <div class="connected">
                                  <div class="connector-name">
                                      ${JSON.stringify(this.currentAccount)}
                                  </div>
                                  <div></div>
                              </div>
                          `
                        : ''}

                    <div>
                        <thorin-button
                            variant="subtle"
                            width="full"
                            .onClick="${() => {
                                console.log('FF2');
                                this.disconnect();
                            }}"
                            >Back</thorin-button
                        >
                        <thorin-button
                            variant="subtle"
                            width="full"
                            .onClick="${() => {
                                this.updateWagmiState();
                            }}"
                            >Reload</thorin-button
                        >
                    </div>
                </div>
            </thorin-modal>
        `;
    }

    close() {
        this.dispatchEvent(new CustomEvent('onClose'));
    }

    _connect(connector: Connector) {
        console.log(connector);
        this.connecting = true;

        if (connector.type === 'walletConnect') {
            connector
                .connect()
                .catch((error) => {
                    console.log('failed to connect', error);
                    // this.disconnect();
                })
                .finally(() => {
                    this.connecting = false;
                    this.updateWagmiState();
                });

            connector.emitter.on('message', (message) => {
                console.log('BRRR', message);
            });
        } else {
            console.log('Starting connection with ' + connector.name);
            this.activeConnector = connector;
            connect(wagmiConfig, { connector })
                .catch((error) => {
                    console.log('failed to connect', error);
                    // this.disconnect();
                    this.activeConnector = undefined;
                })
                .finally(() => {
                    this.connecting = false;
                    // this.disconnect();
                    // this.open = false;
                    this.updateWagmiState();
                    // this.activeConnector?.getAccounts()?.then((accounts) => {
                    //     console.log({ accounts });
                    //     this.myAddress = accounts[0];
                    // });
                });
        }
    }

    disconnect() {
        this.showQR = undefined;
        this.activeConnector = undefined;

        disconnect(wagmiConfig).finally(() => {
            console.log('disconnected wagmi');
            this.activeConnector = undefined;
            this.updateWagmiState();
        });

        // const connections = getConnections(wagmiConfig);

        // connections.map((connection) => {
        //     disconnect(wagmiConfig, { connector: connection.connector }).catch(
        //         (error) => {
        //             console.log('failed to disconnect', error);
        //         }
        //     );
        // });

        this.updateWagmiState();

        // this.updateWagmiState();
    }

    async updateWagmiState() {
        // const _active = getClient(wagmiConfig);
        const abc = getAccount(wagmiConfig);

        this.currentAccount = abc;

        if (
            !wagmiConfig ||
            wagmiConfig.state?.connections?.size === 0 ||
            wagmiConfig.connectors?.length === 0
        ) {
            return;
        }

        const connections = getConnections(wagmiConfig);

        console.log({ connections });

        // if (!this.connecting) {
        //     this.activeConnector = connections[0]?.connector;
        // }

        console.log({ status: wagmiConfig?.state?.status });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-connect-modal': ThorinConnectModal;
    }
}
