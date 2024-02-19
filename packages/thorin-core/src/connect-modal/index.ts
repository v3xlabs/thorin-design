/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable unicorn/no-nested-ternary */
import { walletConnect } from '@wagmi/connectors';
import {
    type Config,
    type Connector,
    connect,
    disconnect,
    getConnections,
    getConnectors,
} from '@wagmi/core';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

let wagmiConfig = {} as Partial<Config>;

export const setupConfig = (config: Partial<Config>) => {
    wagmiConfig = config;
};

// const wagmiConfig = createConfig({
//     chains: [mainnet],
//     transports: {
//         [mainnet.id]: http(),
//     },
// });

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
    status: string | undefined = undefined;

    @state()
    activeConnector: Connector | undefined = undefined;

    @state()
    myAddress: string | undefined = undefined;

    @state()
    connectors: Connector[] = [];

    @state()
    showQR: string | undefined = undefined;

    @state()
    connecting: boolean = false;

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
        const emitter = {
            emit: (topic: string, data: any) => {
                console.log('emitting', topic);

                if (topic == 'message') {
                    if (data?.type === 'display_uri') {
                        this.showQR = data.data;
                    } else {
                        console.log('Encountered New Packet from WC:');
                        console.log(data);
                    }
                } else {
                    console.log('Encountered New Topic from WC:');
                    console.log(topic, data);
                }
            },
        } as any;
        const x = wc({ chains: wagmiConfig.chains, emitter }) as any;

        this.connectors = [...getConnectors(wagmiConfig as Config), x];

        this.updateWagmiState();
    }

    override render() {
        this.updateWagmiState();

        return html`
            <thorin-modal
                ?open="${this.open}"
                modalTitle="${this.status == 'connected'
                    ? 'Wallet Settings'
                    : 'Connect Wallet'}"
                @onClose="${() => {
                    this.close();
                }}"
            >
                <div class="space-y-2">
                    ${this.status == 'connected'
                        ? html`<div class="space-y-2">
                              <div class="connected">
                                  Connected as ${this.myAddress}
                              </div>
                              <div>
                                  <thorin-button
                                      variant="subtle"
                                      width="full"
                                      .onClick="${() => {
                                          console.log('FF');
                                          this.disconnect();
                                      }}"
                                      >Disconnect</thorin-button
                                  >
                              </div>
                          </div>`
                        : ''}
                    ${this.status == 'connecting' || this.connecting
                        ? html`<div class="space-y-2">
                              <div class="connecting-to">
                                  ${this.activeConnector?.type ==
                                  'walletConnect'
                                      ? html`
                                    ${
                                        this.showQR
                                            ? html`<div class="qr">
                                                  <qr-code
                                                      data="${this.showQR}"
                                                  ></qr-code>
                                              </div>`
                                            : ''
                                    }
                              </div>`
                                      : html`
                                          ${
                                              this.activeConnector?.icon
                                                  ? html` <img
                                                        src="${this
                                                            .activeConnector
                                                            .icon}"
                                                        alt="${this
                                                            .activeConnector
                                                            .name}"
                                                    />`
                                                  : ''
                                          }
                                          <div>
                                              Connecting to
                                              <span class="connector-name">
                                                  ${this.activeConnector?.name}
                                              </span>
                                          </div>
                                      </div>
                              `}
                              </div>

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
                              </div>
                          </div>`
                        : ''}
                    ${this.status == 'disconnected'
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
                </div>
            </thorin-modal>
        `;
    }

    close() {
        this.dispatchEvent(new CustomEvent('onClose'));
    }

    _connect(connector: Connector) {
        // this.activeConnector = connector;
        console.log(connector);
        this.connecting = true;
        this.activeConnector = connector;

        connect(wagmiConfig as Config, { connector })
            .catch((error) => {
                console.log('failed to connect', error);
                // this.disconnect();
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

    disconnect() {
        this.connecting = false;
        this.activeConnector = undefined;
        this.showQR = undefined;
        this.myAddress = undefined;
        disconnect(wagmiConfig as Config).finally(() => {
            console.log('disconnected wagmi');
        });
        this.activeConnector?.disconnect().finally(() => {
            console.log('disconnected activeConnector');
        });

        this.updateWagmiState();
    }

    async updateWagmiState() {
        const connections = getConnections(wagmiConfig as Config);

        console.log({ connections });

        if (!this.connecting) {
            this.activeConnector = connections[0]?.connector;
        }

        this.status = wagmiConfig?.state?.status;

        const accounts = await this.activeConnector?.getAccounts();

        console.log({ status: this.status, accounts });
        this.myAddress = accounts?.[0];
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-connect-modal': ThorinConnectModal;
    }
}
