/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable unicorn/no-nested-ternary */
import { walletConnect } from '@wagmi/connectors';
import { Connector, createConfig, getConnectors, http } from '@wagmi/core';
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

    static styles = css`
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
    `;

    @state()
    connecting: boolean = false;

    @state()
    activeConnector: Connector | undefined = undefined;

    @state()
    connectors: Connector[] = [];

    @state()
    showQR: string | undefined = undefined;

    firstUpdated() {
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

        this.connectors = [...getConnectors(wagmiConfig), x];
    }

    render() {
        return html`
            <thorin-modal
                ?open="${this.open}"
                modalTitle="${this.activeConnector && !this.connecting
                    ? 'Wallet Settings'
                    : 'Connect Wallet'}"
            >
                <div class="space-y-2">
                    ${this.activeConnector && !this.connecting
                        ? html`<div class="space-y-2">
                              <div class="connected">Connected</div>
                              <div>
                                  <thorin-button
                                      variant="subtle"
                                      width="full"
                                      .onClick="${() => {
                                          this.activeConnector?.disconnect();
                                          this.activeConnector = undefined;
                                          this.connecting = false;
                                          this.showQR = undefined;
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
                                          this.activeConnector?.disconnect();
                                          this.activeConnector = undefined;
                                          this.connecting = false;
                                          this.showQR = undefined;
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
                                              width="full"
                                              .onClick=${() =>
                                                  this._connect(connector)}
                                              >${connector.name}</thorin-button
                                          >
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
            })
            .finally(() => {
                this.connecting = false;
                // this.open = false;
            });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-connect-modal': ThorinConnectModal;
    }
}
