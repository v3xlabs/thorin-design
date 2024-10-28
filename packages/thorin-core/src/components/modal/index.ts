import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { customElement } from '../../internal/component';

@customElement('thorin-modal')
export class ThorinModal extends LitElement {
    @property({ type: Boolean, reflect: true })
    open = false;

    @property({ type: String })
    modalTitle = '';

    @property({ type: Boolean })
    closeOnRequest = true;

    static override styles = css`
        :host {
            display: none;
            position: fixed;
            inset: 0;
            background: color-mix(
                in srgb,
                var(--thorin-grey-active) 20%,
                transparent
            );
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(14px);
            display: none; /* Initially hidden */
        }
        :host([open]) {
            display: flex; /* Show modal when open */
        }
        .modal-container {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            max-width: 100%;
            outline: none;
            border: none;
            background: transparent;
            color: var(--thorin-text-primary);
        }
        .modal {
            transition: all 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
            background: var(--thorin-background-primary);
            border-radius: var(--thorin-radius-modal);
            max-width: 100vw;

            width: var(--max-width);
            height: var(--max-height);
            box-sizing: border-box;
            overflow: hidden;
            position: relative;

            max-width: var(--max-width);
            max-height: var(--max-height);
        }
        .content {
            max-height: 100vh;
            overflow: visible;
            width: fit-content;
            height: fit-content;
            min-width: 360px; /** Modal Min Width */

            padding: var(--thorin-spacing-6);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            box-sizing: border-box;
        }
        .title {
            text-align: center;
            font-weight: bold;
            font-size: 20px;
            padding-bottom: var(--thorin-spacing-4);
        }
        dialog::backdrop {
            background-image: linear-gradient(
                45deg,
                magenta,
                rebeccapurple,
                dodgerblue,
                green
            );
            opacity: 0.75;
        }
        .close {
            position: absolute;
            top: 0;
            right: 0;
            padding: var(--thorin-spacing-2);
            margin: var(--thorin-spacing-2);
            border-radius: 50%;
            cursor: pointer;
            background: none;
            border: none;
            font-size: 20px;
            color: var(--thorin-text-secondary);
        }
        .close:hover {
            background: var(--thorin-background-secondary);
        }
        .close-icon {
            width: 16px;
            height: 16px;
            display: block;
        }
        /* Modal Breakpoint */
        @media (max-width: 576px) {
            .modal-container {
                padding: var(--thorin-spacing-2);
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                transform: unset;
                height: auto;
                align-items: flex-end;
                width: calc(100% - var(--thorin-spacing-4));
                overflow-y: auto;
                max-height: calc(100vh - var(--thorin-spacing-4));
            }
            .modal {
                /* max-height: 100vh; */
                width: 100%;

                max-width: 100%;
                max-height: var(--max-height);
            }
            .content {
                width: 100%;
                min-width: 0;
                max-width: calc(
                    calc(100% - var(--thorin-spacing-2)) -
                        var(--thorin-spacing-4)
                );
            }
        }
    `;

    override render() {
        return html`
            <dialog open="${this.open}" class="modal-container" @close="${() =>
            console.log('onClose')}" @click="${(event: any) => {
            console.log('click', event);
        }}">
                    <div class="modal">
                        <div class="content">
                            <div class="title">${this.modalTitle}</div>
                            ${
                                this.closeOnRequest
                                    ? html`<button
                                          @click="${() => {
                                              this.close();
                                          }}"
                                          class="close"
                                      >
                                          <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="currentColor"
                                              viewBox="0 0 96 96"
                                              width="1em"
                                              height="1em"
                                              focusable="false"
                                              shape-rendering="geometricPrecision"
                                              class="close-icon"
                                          >
                                              <path
                                                  fill="currentColor"
                                                  d="M17.757 26.243a6 6 0 1 1 8.486-8.486L48 39.515l21.757-21.758a6 6 0 1 1 8.486 8.486L56.485 48l21.758 21.757a6 6 0 1 1-8.486 8.486L48 56.485 26.243 78.243a6 6 0 1 1-8.486-8.486L39.515 48 17.757 26.243Z"
                                              ></path>
                                          </svg>
                                      </button>`
                                    : ''
                            }
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </dialog>
        `;
    }

    close() {
        this.dispatchEvent(new CustomEvent('onClose'));
    }

    override firstUpdated() {
        const modal = this.shadowRoot?.querySelector('.modal');
        const modalContent = this.shadowRoot?.querySelector('.content');
        const resizeObserver = new ResizeObserver((entries) => {
            const padding = 24;

            for (const entry of entries) {
                const { height, width } = entry.contentRect;

                console.log('Resize observed', height, width);

                if (height == 0 && width == 0) return;

                modal?.setAttribute(
                    'style',
                    `--max-height: ${height + padding * 2}px; --max-width: ${
                        width + padding * 2
                    }px`
                );
            }
        });

        if (modalContent) {
            resizeObserver.observe(modalContent);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-modal': ThorinModal;
    }
}
