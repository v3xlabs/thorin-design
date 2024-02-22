/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable unicorn/no-nested-ternary */
import 'webcomponent-qr-code';

// import { walletConnect } from '@wagmi/connectors';
import {
    type Config,
    type Connection,
    type Connector,
    type ConnectorEventMap,
    type GetAccountReturnType,
    connect,
    disconnect,
    getAccount,
    getConnectors,
} from '@wagmi/core';
// import { mainnet } from '@wagmi/core/chains';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

let wagmiConfig = {} as Config;

export const setupConfig = (config: Config) => {
    wagmiConfig = config;
};

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
            max-width: 300px;
            text-overflow: unset;
            white-space: normal;
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
        .max-w-xl {
            max-width: 360px;
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
        }
        .connecting .box {
            width: 32px;
            height: 32px;
            border-radius: var(--thorin-radius-card);
            background: var(--thorin-background-secondary);
            overflow: hidden;
        }
        .connecting .box img {
            width: 100%;
            height: 100%;
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
    activeConnector: Connector | undefined = undefined;

    @state()
    status:
        | 'connecting'
        | 'connected'
        | 'disconnected'
        | 'errored'
        | 'reconnecting' = 'disconnected';

    override firstUpdated() {
        const connectors = getConnectors(wagmiConfig);

        this.connectors = [...connectors];
    }

    override updated() {
        //     // this.updateWagmiState();
        console.log('updated');
    }

    override render() {
        const account = getAccount(wagmiConfig);

        const isWalletConnect = this.activeConnector?.type === 'walletConnect';

        const isLoading = this.status === 'connecting';
        const isDisconnected = this.status === 'disconnected';
        const isConnected = this.status === 'connected';
        const isErrored = this.status === 'errored';
        const isReconnecting = this.status === 'reconnecting';

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
                                        ${this.connectors.map(
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
                    ${isConnected
                        ? html`
                              <div class="connected">
                                  <div class="connector-name">
                                      ${this.activeConnector?.name}
                                  </div>
                                  <div class="connector-name">
                                      ${JSON.stringify(account.address)}
                                  </div>
                              </div>
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
                        isConnected,
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
        console.log(connector);
        this.status == 'connecting';

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
        this.showQR = undefined;
        this.activeConnector = undefined;

        disconnect(wagmiConfig).finally(() => {
            console.log('disconnected wagmi');
            this.activeConnector = undefined;
            this.status = 'disconnected';
            this.updateWagmiState();
        });

        this.updateWagmiState();
    }

    async updateWagmiState() {
        // const _active = getClient(wagmiConfig);
        console.log({ open: this.open });

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

        if (this.activeConnector != account.connector && account.isConnected) {
            this.activeConnector = account.connector;
        }

        if (
            !wagmiConfig ||
            wagmiConfig.state?.connections?.size === 0 ||
            wagmiConfig.connectors?.length === 0
        ) {
            return;
        }

        console.log({ status: wagmiConfig?.state?.status });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-connect-modal': ThorinConnectModal;
    }
}
