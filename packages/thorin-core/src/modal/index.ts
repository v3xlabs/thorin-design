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
            background: rgba(0, 0, 0, 0.17);
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
        .modal-container {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            max-width: 100%;
        }
        .modal {
            transition: all 250ms ease-out;
            /* overflow: hidden; Smooth resizing */
            background: var(--thorin-background-primary);
            padding: 16px;
            border-radius: 24px;
            max-width: 100vw;

            width: auto;
            box-sizing: border-box;
            overflow: hidden;

            max-width: var(--max-width);
            max-height: var(--max-height);
        }
        .content {
            max-height: 100vh;
            overflow: visible;
            width: fit-content;
            height: fit-content;
            min-width: 320px; /** Modal Min Width */
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
            }
            .modal {
                /* max-height: 100vh; */
                overflow-y: auto;
                width: 100%;

                max-width: 100%;
                max-height: var(--max-height);
            }
            .content {
                width: 100%;
                min-width: 0;
            }
        }
    `;

    render() {
        return html`
            <div class="modal-container">
                <div class="modal">
                    <div class="content">
                        <slot></slot>
                        <thorin-button width="full">Close</thorin-button>
                    </div>
                </div>
            </div>
        `;
    }

    firstUpdated() {
        const modal = this.shadowRoot?.querySelector('.modal');
        const modalContent = this.shadowRoot?.querySelector('.content');
        const resizeObserver = new ResizeObserver((entries) => {
            const padding = 16;

            for (const entry of entries) {
                const { height, width } = entry.contentRect;

                console.log('Resize observed', height, width);
                modal?.setAttribute(
                    'style',
                    `--max-height: ${height + padding * 2}px; --max-width: ${
                        width + padding * 2
                    }px`
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
