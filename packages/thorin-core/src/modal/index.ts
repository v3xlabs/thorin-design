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
            transition: all 20ms ease-in-out;
            overflow: hidden; /* Smooth resizing */
            background: var(--thorin-background-primary);
            padding: 16px;
            border-radius: 24px;
            max-width: 100vw;
        }
        .content {
            overflow: unset;
            max-width: 100vw;
        }
    `;

    firstUpdated() {
        const modal = this.shadowRoot?.querySelector('.modal');
        const modalContent = this.shadowRoot?.querySelector('.content');
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { height, width } = entry.contentRect;
                // Apply the new height and width to the modal, if necessary
                // This is where you'd dynamically adjust based on content, similar to Framer Motion
                // For example, adjust max-height/max-width or transform scale

                console.log('Resize observed', height, width);
                modal?.setAttribute(
                    'style',
                    `max-height: ${height + 32}px; max-width: ${width + 32}px`
                );
                modalContent?.setAttribute(
                    'style',
                    `max-height: ${height}px; max-width: ${width}px`
                );
            }
        });

        if (modalContent) {
            resizeObserver.observe(modalContent);
        }
    }

    render() {
        return html`
            <div class="modal">
                <div class="content">
                    <slot></slot>
                    <thorin-button>Close</thorin-button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-modal': ThorinModal;
    }
}
