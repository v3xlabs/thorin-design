import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('thorin-modal')
export class ThorinModal extends LitElement {
    @property({ type: Boolean, reflect: true })
    open = false;

    static styles = css`
        :host {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(4px);
            display: none; /* Initially hidden */
        }
        :host([open]) {
            display: flex; /* Show modal when open */
        }
        .modal {
            transition: all 250ms ease-out;
            /* overflow: hidden; Smooth resizing */
            background: var(--thorin-background-primary);
            padding: 16px;
            border-radius: 24px;
            max-width: 100vw;

            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            max-width: 100%;
            width: auto;
            box-sizing: border-box;
            overflow: hidden;
        }
        @media (max-width: 768px) {
            .modal {
                top: auto;
                bottom: 0;
                transform: translate(-50%, 0%);
                height: auto;
                max-height: 100vh;
                overflow-y: auto;
            }
        }
        .content {
            max-height: 100vh;
            overflow: visible;
            width: fit-content;
            height: fit-content;
        }
    `;

    render() {
        return html`
            <div class="modal">
                <div class="content">
                    <slot></slot>
                    <thorin-button width="full">Close</thorin-button>
                </div>
            </div>
        `;
    }

    firstUpdated() {
        const modal = this.shadowRoot?.querySelector('.modal');
        const modalContent = this.shadowRoot?.querySelector('.content');
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { height, width } = entry.contentRect;

                console.log('Resize observed', height, width);
                modal?.setAttribute(
                    'style',
                    `max-height: ${height + 32}px; max-width: ${width + 32}px`
                );
                // modalContent?.setAttribute(
                //     'style',
                //     `max-height: ${height}px; max-width: ${width}px`
                // );
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
