import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('thorin-button')
export class ThorinButton extends LitElement {
    static styles = css`
        button {
            background: var(--thorin-blue-primary);
            color: var(--thorin-text-accent);
            display: inline-flex;
            justify-content: center;
            gap: 4px;
            overflow: hidden;
            appearance: none;
            border: none;
            outline: none;
            border-radius: 24px;
            padding: 8px 16px;
        }
        button:hover, button:active {
            background: var(--thorin-blue-bright);
            color: var(--thorin-text-accent);
            cursor: pointer;
        }
    `;

    render() {
        return html`
        <button>
            <slot></slot>
        </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-button': ThorinButton;
    }
}
