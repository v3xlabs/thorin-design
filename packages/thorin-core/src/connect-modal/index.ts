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
    `;

    @state()
    connecting: boolean = false;

    @state()
    activeConnector: Connector | undefined = undefined;

    render() {
        const connectors = getConnectors(wagmiConfig);

        return html`
            <thorin-modal ?open="${this.open}" title="Connect Wallet">
                ${this.connecting ? html`<div>connecting...</div>` : ''}
                ${this.activeConnector && this.connecting
                    ? html`
                          <div class="connecting-to">
                              ${this.activeConnector.icon
                                  ? html` <img
                                        src="${this.activeConnector.icon}"
                                        alt="${this.activeConnector.name}"
                                    />`
                                  : ''}
                              <div>
                                  Connecting to
                                  <span class="connector-name">
                                      ${this.activeConnector.name}
                                  </span>
                              </div>
                          </div>
                      `
                    : ''}
                ${!this.connecting
                    ? html` <div class="button-list">
                          ${connectors.map(
                              (connector) =>
                                  html`
                                      <thorin-button
                                          width="full"
                                          @click=${() => {
                                              this.connecting = true;
                                              this.activeConnector = connector;
                                              connector
                                                  .connect()
                                                  .finally(() => {
                                                      this.connecting = false;
                                                      // this.open = false;
                                                  });
                                          }}
                                          >${connector.name}</thorin-button
                                      >
                                  `
                          )}
                      </div>`
                    : ''}
            </thorin-modal>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-connect-modal': ThorinConnectModal;
    }
}
