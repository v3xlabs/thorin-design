/* eslint-disable unicorn/template-indent */
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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
            border-radius: var(--thorin-radius-button);
            padding: 10px 20px;
        }
        button.full {
            width: 100%;
        }
        button:hover,
        button:active {
            background: var(--thorin-blue-bright);
            color: var(--thorin-text-accent);
            cursor: pointer;
            transform: translateY(-1px);
        }
        button:focus {
            box-shadow: 0 0 0 2px var(--thorin-blue-bright);
        }
    `;

    @property({ type: String })
    width: 'auto' | 'full' = 'auto';

    render() {
        return html`
            <button @click="${this._onClick}" class="${this.computeClass}">
                <slot></slot>
            </button>
        `;
    }

    private get computeClass() {
        return this.width === 'full' ? 'full' : '';
    }

    private _onClick(event: PointerEvent) {
        console.log('Button clicked', event);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-button': ThorinButton;
    }
}
