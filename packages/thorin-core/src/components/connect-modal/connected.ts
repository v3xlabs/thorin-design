import { formatAddress } from '@ens-tools/format';
import type { Connector } from '@wagmi/core';
import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { match, P } from 'ts-pattern';
import type { Address } from 'viem';

import { customElement } from '../../internal/component';
import { styles } from '../../styles';

type ENSData = {
    avatar?: string;
    name: string;
    address: Address;
    records: Record<string, string>;
};

type ENSDataError = {
    address: Address;
};

@customElement('thorin-connect-modal-connected')
export class ThorinConnectModalConnected extends LitElement {
    @property({ type: String, reflect: true })
    address: Address | undefined = undefined;

    static override styles = [
        styles.base,
        css`
            .connected {
                display: flex;
                flex-direction: column;
                gap: var(--thorin-spacing-4);
                font-size: 1rem;
            }
            .connector {
                padding: var(--thorin-spacing-4);
                border: 1px solid var(--thorin-border);
                border-radius: var(--thorin-radius-card);
                gap: var(--thorin-spacing-2);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .connector-internal {
                display: flex;
                align-items: center;
                gap: var(--thorin-spacing-2);
            }
            .disconnect-btn {
            }
            .connector-image {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .connector-image img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .profile {
                border: 1px solid var(--thorin-border);
                border-radius: var(--thorin-radius-card);
                padding: var(--thorin-spacing-4);
                display: flex;
                flex-direction: column;
                gap: var(--thorin-spacing-4);
            }
            .profile .row-1 {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: var(--thorin-spacing-4);
                font-size: 1.1em;
                line-height: 1.3;
            }
            .profile .row-1 .left {
                display: flex;
                align-items: center;
                gap: var(--thorin-spacing-2);
            }
            .profile .row-1 .links {
                height: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: start;
                gap: var(--thorin-spacing-2);
                flex-grow: 1;
            }
            .profile .row-1 .subtext {
                color: var(--thorin-text-secondary);
                font-size: 0.75em;
                line-height: 1.1;
            }
            .external-link-icon {
                width: 16px;
                height: 16px;
                display: block;
                color: var(--thorin-text-secondary);
            }
            .external-link-icon:hover {
                color: var(--thorin-blue-primary);
            }
        `,
    ];

    @property({ type: Object })
    connector: Connector;

    @property({ type: Function })
    requestDisconnect: () => void;

    @state()
    ensdata: ENSData | undefined;

    @state()
    ensdata_error: ENSDataError | undefined;

    override updated() {
        if (!this.address) return;

        if (this.ensdata && this.ensdata.address === this.address) return;

        if (this.ensdata_error && this.ensdata_error.address === this.address)
            return;

        this._fetchENS(this.address);
    }

    override render() {
        // hi

        return html`
            <div class="connected">
                <div class="connector">
                    <div class="connector-internal">
                        ${this.connector?.icon &&
                        html` <div class="connector-image">
                            <img
                                src="${this.connector?.icon}"
                                alt="${this.connector?.name}"
                            />
                        </div>`}
                        <span>
                            <b>${this.connector?.name}</b>
                        </span>
                    </div>
                    <div class="disconnect-btn">
                        <thorin-button
                            variant="subtle"
                            width="auto"
                            .onClick="${() => {
                                this.requestDisconnect();
                            }}"
                        >
                            Disconnect
                        </thorin-button>
                    </div>
                </div>

                <div class="max-w-xl">
                    <div class="profile">
                        <div class="row-1">
                            <div class="left">
                                ${this.ensdata?.avatar &&
                                html`<thorin-avatar
                                    .name=${this.ensdata.name}
                                ></thorin-avatar>`}
                                ${match(this.ensdata)
                                    .with(
                                        { name: P.string },
                                        () => html`<div>
                                            <div>${this.ensdata.name}</div>
                                            <div class="subtext">
                                                ${formatAddress(this.address)}
                                            </div>
                                        </div>`
                                    )
                                    .otherwise(
                                        () => html`<div>
                                            <div>
                                                ${formatAddress(this.address)}
                                            </div>
                                        </div>`
                                    )}
                            </div>
                            <div class="links">
                                <a
                                    target="_blank"
                                    href="https://etherscan.io/address/${this
                                        .address}"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 96 96"
                                        width="1em"
                                        height="1em"
                                        focusable="false"
                                        shape-rendering="geometricPrecision"
                                        class="external-link-icon"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M50 4a6 6 0 0 0 0 12h21.515L33.757 53.757a6 6 0 1 0 8.486 8.486L80 24.485V46a6 6 0 0 0 12 0V10a6 6 0 0 0-6-6H50Z"
                                        ></path>
                                        <path
                                            fill="currentColor"
                                            d="M16 42a6 6 0 0 1 6-6h8a6 6 0 0 0 0-12h-8c-9.941 0-18 8.059-18 18v32c0 9.941 8.059 18 18 18h32c9.941 0 18-8.059 18-18v-8a6 6 0 0 0-12 0v8a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V42Z"
                                        ></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async _fetchENS(address: Address | undefined) {
        if (!address || this.ensdata?.address == address) return;

        try {
            const data = await fetch('https://enstate.rs/a/' + address);
            const json = await data.json();

            console.log(json);
            this.ensdata = json;
        } catch (error) {
            console.log('Failed to fetch ens data for', error);
            this.ensdata_error = { address };
        }
    }
}

declare global {
    // eslint-disable-next-line unused-imports/no-unused-vars
    interface HTMLElementTagNameMap {
        'thorin-connect-modal-connected': ThorinConnectModalConnected;
    }
}
