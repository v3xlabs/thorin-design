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
                gap: var(--thorin-spacing-2);
                font-size: 1rem;
            }
            .connector {
                padding: var(--thorin-spacing-2);
                border: 1px solid var(--thorin-border);
                border-radius: var(--thorin-radius-card);
                gap: var(--thorin-spacing-2);
                display: flex;
                align-items: center;
                flex-direction: column;
            }
            .connector-internal {
                display: flex;
                align-items: center;
                gap: var(--thorin-spacing-2);
            }
            .disconnect-btn {
                width: 100%;
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
                padding: var(--thorin-spacing-2);
                display: flex;
                flex-direction: column;
                gap: var(--thorin-spacing-2);
            }
            .profile .row-1 {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: var(--thorin-spacing-2);
                font-size: 1.1em;
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
            }
        `,
    ];

    @property({ type: Object })
    connector: Connector;

    @property({ type: Function })
    requestDisconnect: () => void;

    @state()
    ensdata: ENSData | undefined;

    override updated() {
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
                            Connected via <b>${this.connector?.name}</b>
                        </span>
                    </div>
                    <div class="disconnect-btn">
                        <thorin-button
                            variant="subtle"
                            width="full"
                            .onClick="${() => {
                                this.requestDisconnect();
                            }}"
                            >Disconnect</thorin-button
                        >
                    </div>
                </div>

                <div class="space-y-2 max-w-xl">
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
                                    >X</a
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async _fetchENS(address: Address | undefined) {
        if (!address || this.ensdata?.address == address) return;

        const data = await fetch('https://enstate.rs/a/' + address);
        const json = await data.json();

        console.log(json);
        this.ensdata = json;
    }
}

declare global {
    // eslint-disable-next-line unused-imports/no-unused-vars
    interface HTMLElementTagNameMap {
        'thorin-connect-modal-connected': ThorinConnectModalConnected;
    }
}
