/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable unicorn/template-indent */
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('thorin-avatar')
export class ThorinAvatar extends LitElement {
    static override styles = css`
        :host {
            display: inline-flex;
            width: 48px;
            height: 48px;
            position: relative;
            justify-content: center;
            align-items: center;
            background: var(--thorin-grey-surface);
            border-radius: 8px;
            overflow: hidden;
        }
        img {
            width: 48px;
            height: 48px;
            object-fit: cover;
            position: absolute;
            inset: 0;
        }
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #3498db;
            width: 32px;
            height: 32px;
            -webkit-animation: spin 2s linear infinite; /* Safari */
            animation: spin 2s linear infinite;
            position: absolute;
            inset: 0;
            margin: 4px;
        }
        @-webkit-keyframes spin {
            0% {
                -webkit-transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
            }
        }
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        .fallback-svg {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: #f0f0f0;
        }
    `;

    @property({ type: String })
    name: string = '';

    @state()
    private loading: boolean = true;

    @state()
    private imgError: boolean = false;

    override render() {
        const avatarUrl = `https://enstate.rs/i/${this.name}`;

        return html`
            ${this.loading ? html`<div class="spinner"></div>` : ''}
            ${this.imgError
                ? html`<svg
                      class="fallback-svg"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                      <circle cx="24" cy="24" r="24" fill="#cccccc" />
                      <text
                          x="50%"
                          y="50%"
                          dy=".3em"
                          fill="black"
                          font-size="12"
                          text-anchor="middle"
                      >
                          ?
                      </text>
                  </svg>`
                : html`<img
                      src="${avatarUrl}"
                      loading="lazy"
                      @load="${this.handleLoad}"
                      @error="${this.handleError}"
                  />`}
        `;
    }

    handleLoad() {
        this.loading = false;
        this.imgError = false;
    }

    handleError() {
        this.loading = false;
        this.imgError = true;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-avatar': ThorinAvatar;
    }
}
