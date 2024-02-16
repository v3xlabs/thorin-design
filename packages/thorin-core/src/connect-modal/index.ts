/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable unicorn/no-nested-ternary */
import { walletConnect } from '@wagmi/connectors';
import {
    type Config,
    type Connector,
    createConfig,
    getConnectors,
    http,
} from '@wagmi/core';
import { mainnet } from '@wagmi/core/chains';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const wagmiConfig = createConfig({
    chains: [mainnet],
    transports: {
        [mainnet.id]: http(),
    },
});

@customElement('thorin-connect-modal')
export class ThorinConnectModal extends LitElement {
    @property({ type: Boolean, reflect: true })
    open = false;

    @property({})
    wagmiConfig: Config = wagmiConfig;

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
    connecting: boolean = false;

    @state()
    activeConnector: Connector | undefined = undefined;

    @state()
    myAddress: string | undefined = undefined;

    @state()
    connectors: Connector[] = [];

    @state()
    showQR: string | undefined = undefined;

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
                    if (data.type === 'display_uri') {
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
        };
        const x = wc({ chains: [mainnet], emitter } as any) as any;

        this.connectors = [...getConnectors(this.wagmiConfig), x];
    }

    override render() {
        if (!this.myAddress && this.activeConnector) {
            console.log('computing account');
            this.activeConnector.getAccounts().then((accounts) => {
                console.log('computing success');
                // eslint-disable-next-line prefer-destructuring
                this.myAddress = accounts[0];
            });
        }

        return html`
            <thorin-modal
                ?open="${this.open}"
                modalTitle="${this.activeConnector && !this.connecting
                    ? 'Wallet Settings'
                    : 'Connect Wallet'}"
                .onClose="${() => {
                    this.open = false;
                }}"
            >
                <div class="space-y-2">
                    ${this.activeConnector && !this.connecting
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
                    ${this.activeConnector && this.connecting
                        ? html`<div class="space-y-2">
                              <div class="connecting-to">
                                  ${this.activeConnector.type == 'walletConnect'
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
                                              this.activeConnector.icon
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
                                                  ${this.activeConnector.name}
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
                    ${!this.connecting && !this.activeConnector
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

    _connect(connector: Connector) {
        this.connecting = true;
        this.activeConnector = connector;
        console.log(connector);
        connector
            .connect()
            .catch((error) => {
                console.log('failed to connect', error);
                this.disconnect();
            })
            .finally(() => {
                this.connecting = false;
                // this.disconnect();
                // this.open = false;
            });
    }

    disconnect() {
        this.activeConnector?.disconnect();
        this.activeConnector = undefined;
        this.connecting = false;
        this.showQR = undefined;
        this.myAddress = undefined;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-connect-modal': ThorinConnectModal;
    }
}
