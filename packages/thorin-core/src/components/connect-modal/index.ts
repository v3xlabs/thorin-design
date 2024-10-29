/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable unicorn/no-nested-ternary */
import 'webcomponent-qr-code';
import './connected';

import {
    type Config,
    type Connection,
    type Connector,
    type ConnectorEventMap,
    type GetAccountReturnType,
    connect,
    disconnect,
    getAccount,
    getConnections,
    getConnectors,
} from '@wagmi/core';
import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

import { customElement } from '../../internal/component';
import { styles } from '../../styles';
import { getWagmiConfig } from '../../wagmi.js';

const wcLog = (event: string, ...data: (string | object)[]) => {
    console.log(
        '%c[WC]',
        'color: #3396ff',
        event,
        data
            .map((d) => (typeof d === 'string' ? d : JSON.stringify(d)))
            .join(' ')
    );
};

@customElement('thorin-connect-modal')
export class ThorinConnectModal extends LitElement {
    @property({ type: Boolean, reflect: true })
    open = false;

    static override styles = [
        styles.base,
        css`
            .button-list {
                display: grid;
                // auto height make everything equal height
                grid-template-columns: 1fr; /* One column */
                grid-auto-rows: minmax(
                    min-content,
                    max-content
                ); /* Automatically size rows */
                gap: var(--thorin-spacing-2);
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
                gap: var(--thorin-spacing-2);
            }
            .connecting-to img {
                width: 48px;
                height: 48px;
                border-radius: 4px;
                object-fit: contain;
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
                margin: 0 auto;

                border-radius: var(--thorin-radius-card);
                overflow: hidden;
            }
            .connected {
                padding: var(--thorin-spacing-4);
                background: var(--thorin-green-surface);
                color: var(--thorin-text-primary);
                max-width: 300px;
                text-overflow: unset;
                white-space: normal;
            }
            .space-y-2 > *:last-child {
                margin-top: var(--thorin-spacing-2);
            }
            .space-y-2 > *:first-child {
                margin-top: 0;
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
            .max-w-xl {
                max-width: 360px;
            }
            @media (max-width: 576px) {
                .max-w-xl {
                    max-width: 100%;
                }
            }
            .connecting {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                aspect-ratio: 1/1;
                width: 100%;
                max-width: 360px;
                margin: 0 auto;
                background: var(--thorin-background-secondary);
                border-radius: var(--thorin-radius-card);
                padding: var(--thorin-spacing-4);
                box-sizing: border-box;
            }
            @media (max-width: 576px) {
                .connecting {
                    max-width: 100%;
                }
            }
            .connecting .box {
                width: 32px;
                height: 32px;
                border-radius: 4px;
                background: var(--thorin-background-secondary);
                overflow: hidden;
            }
            .connecting .box img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .name {
                font-weight: 600;
            }
            .qr {
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        `,
    ];

    @state()
    connections: Connection[] = [];

    @state()
    showQR: string | undefined = undefined;

    @state()
    currentAccount: GetAccountReturnType | undefined = undefined;

    @state()
    activeConnector: Connector | undefined = undefined;

    @state()
    status:
        | 'connecting'
        | 'connected'
        | 'disconnected'
        | 'errored'
        | 'reconnecting' = 'disconnected';

    override updated() {
        // this.updateWagmiState();
        console.log('updated', { acc: this.currentAccount });
    }

    override firstUpdated() {
        window.addEventListener(
            'wagmiConfigChangedThorin',
            ({ detail }: CustomEvent<Config>) => {
                this.updateWagmiState(detail);
            }
        );
    }

    override render() {
        const wagmiConfig = getWagmiConfig();
        const account = wagmiConfig // && wagmiConfig?.state
            ? getAccount(wagmiConfig)
            : undefined;

        const isWalletConnect = this.activeConnector?.type === 'walletConnect';

        const isLoading = this.status === 'connecting';
        const isDisconnected = this.status === 'disconnected';
        const isConnected = this.status === 'connected';
        const isErrored = this.status === 'errored';
        const isReconnecting = this.status === 'reconnecting';

        const connectors = getConnectors(wagmiConfig);

        console.log({ account });

        return html`
            <thorin-modal
                ?open="${this.open}"
                modalTitle="${'Connect Wallet'}"
                @onClose="${() => {
                    this.close();
                }}"
            >
                <div class="space-y-2 max-w-xl">
                    ${isWalletConnect
                        ? html`
                              ${isConnected
                                  ? ''
                                  : html`
                                        ${this.showQR
                                            ? html`
                                                  <div class="qr">
                                                      <a
                                                          href="${this.showQR}"
                                                          target="_blank"
                                                      >
                                                          <qr-code
                                                              data="${this
                                                                  .showQR}"
                                                          ></qr-code>
                                                      </a>
                                                  </div>
                                              `
                                            : ''}
                                        <div>
                                            ${!this.showQR
                                                ? html`
                                                      <div>
                                                          Connecting to
                                                          WalletConnect...
                                                      </div>
                                                  `
                                                : ''}
                                        </div>
                                    `}
                          `
                        : html` <div>
                              ${isLoading
                                  ? html` <div class="connecting">
                                        <div class="box">
                                            ${this.activeConnector?.icon
                                                ? html`<img
                                                      src="${this
                                                          .activeConnector
                                                          ?.icon}"
                                                      alt="${this
                                                          .activeConnector
                                                          ?.name}"
                                                  />`
                                                : ''}
                                        </div>
                                        <div>
                                            Connecting to
                                            <span class="name"
                                                >${this.activeConnector
                                                    ?.name}</span
                                            >
                                        </div>
                                        <div>
                                            You may want to check your wallet to
                                            approve the connection
                                        </div>
                                    </div>`
                                  : ''}
                              ${isDisconnected
                                  ? html` <div class="button-list">
                                        ${connectors.map(
                                            (connector) =>
                                                html`
                                                    <thorin-button
                                                        variant="subtle"
                                                        width="full"
                                                        .onClick=${() =>
                                                            this._connect(
                                                                connector
                                                            )}
                                                    >
                                                        <div class="connector">
                                                            ${connector.icon
                                                                ? html`<img
                                                                      src="${connector.icon}"
                                                                      alt="${connector.name}"
                                                                      class="connector-icon"
                                                                  />`
                                                                : ''}
                                                            <span
                                                                >${connector.name}</span
                                                            >
                                                        </div>
                                                    </thorin-button>
                                                `
                                        )}
                                    </div>`
                                  : ''}
                          </div>`}
                    ${isConnected && this.activeConnector
                        ? html`
                              <thorin-connect-modal-connected
                                  .address=${account.address}
                                  .connector=${this.activeConnector}
                                  .requestDisconnect=${() => {
                                      this.disconnect();
                                  }}
                              ></thorin-connect-modal-connected>
                          `
                        : ''}
                    ${isErrored
                        ? html`
                              <div class="connecting">
                                  Failed to connect to
                                  ${this.activeConnector?.name}
                              </div>
                          `
                        : ''}
                    ${[
                        isReconnecting,
                        isLoading,
                        isErrored,
                        isWalletConnect && !isConnected,
                    ].some(Boolean)
                        ? html`
                              <div>
                                  <thorin-button
                                      variant="subtle"
                                      width="full"
                                      .onClick="${() => {
                                          console.log('FF2');
                                          this.disconnect();
                                      }}"
                                  >
                                      ${this.status === 'connected'
                                          ? 'Disconnect'
                                          : 'Cancel'}
                                  </thorin-button>
                              </div>
                          `
                        : ''}
                </div>
            </thorin-modal>
        `;
    }

    close() {
        this.dispatchEvent(new CustomEvent('onClose'));
    }

    _connect(connector: Connector) {
        const wagmiConfig = getWagmiConfig();

        console.log(connector);
        this.status = 'connecting';

        if (connector.type === 'walletConnect') {
            wcLog('connect', 'Starting connection with walletConnect');
            this.activeConnector = connector;

            const wc_on_message = ({
                type,
                data,
            }: ConnectorEventMap['message']) => {
                if (type === 'display_uri' && data) {
                    wcLog('Display URI', data as string);
                    this.showQR = data as string;
                }
            };

            const wc_on_change = ({
                accounts,
                chainId,
            }: ConnectorEventMap['change']) => {
                wcLog('on_connect', { accounts, chainId });
                this.updateWagmiState();
            };

            this.activeConnector.emitter?.on('message', wc_on_message);
            this.activeConnector.emitter?.on('change', wc_on_change);

            this.activeConnector.emitter.once('disconnect', () => {
                wcLog('disconnect');
                connector.emitter.off('message', wc_on_message);
                connector.emitter.off('change', wc_on_change);
                this.disconnect();
            });

            connect(wagmiConfig, { connector })
                .then((value) => {
                    wcLog('connected', value);
                    this.status = 'connected';
                })
                .catch((error) => {
                    if (this.currentAccount.isConnected) {
                        wcLog('Silently erroring out', error);

                        return;
                    }

                    wcLog('failed to connect', error);
                    this.status = 'errored';
                })
                .finally(() => {
                    wcLog('finally');
                    this.updateWagmiState();
                });
        } else {
            console.log('Starting connection with ' + connector.name);
            this.activeConnector = connector;
            connect(wagmiConfig, { connector })
                .then((value) => {
                    console.log('connected', value);
                    this.status = 'connected';
                })
                .catch((error) => {
                    if (this.currentAccount.isConnected) {
                        console.log('Silently erroring out', error);

                        return;
                    }

                    console.log('failed to connect', error);
                    this.status = 'errored';
                })
                .finally(() => {
                    console.log('finally');
                    this.updateWagmiState();
                });
        }
    }

    disconnect() {
        const wagmiConfig = getWagmiConfig();

        console.log('Disconnect Requested!');
        this.showQR = undefined;
        this.activeConnector = undefined;
        this.currentAccount = undefined;
        this.status = 'disconnected';

        const connections = getConnections(wagmiConfig);

        for (const connection of connections) {
            const { connector } = connection;

            disconnect(wagmiConfig, { connector })
                .then(() => {
                    console.log('disconnected');
                })
                .catch((error) => {
                    console.log('failed to disconnect', error);
                })
                .finally(() => {
                    console.log('disconnected wagmi');
                });
        }
    }

    async updateWagmiState(config?: Config) {
        const wagmiConfig = config || getWagmiConfig();

        if (!this.open) return;

        const account = getAccount(wagmiConfig);

        this.currentAccount = account;

        console.log('updating wagmi state', account?.status);

        if (
            account?.status != this.status &&
            !['errored'].includes(this.status)
        ) {
            this.status = account?.status;
        }

        const connections = getConnections(wagmiConfig);

        const connector = account?.connector;

        this.activeConnector = connector;

        if (connections.length > 0) {
            console.log({ connections });
        }

        // const wagmiConnectors = getConnectors(wagmiConfig);

        // if (
        //     !wagmiConfig ||
        //     wagmiConnectors?.length === 0 ||
        //     wagmiConfig.connectors?.length === 0
        // ) {
        //     //
        // }
    }
}

declare global {
    // eslint-disable-next-line unused-imports/no-unused-vars
    interface HTMLElementTagNameMap {
        'thorin-connect-modal': ThorinConnectModal;
    }
}
