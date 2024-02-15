/* eslint-disable unicorn/template-indent */
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type ButtonVariant = ButtonActionVariant | ButtonColorVariant;
type ButtonActionVariant =
    | 'primary'
    | 'secondary'
    | 'error'
    | 'error-secondary'
    | 'subtle'
    | 'disabled';
type ButtonColorVariant =
    | 'blue'
    | 'indigo'
    | 'purple'
    | 'pink'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'grey';

@customElement('thorin-button')
export class ThorinButton extends LitElement {
    static styles = css`
        button.secondary {
            --bg: var(--thorin-blue-surface);
            --bg-hover: var(--thorin-blue-light);
            --color: var(--thorin-blue-dim);
            --color-hover: var(--thorin-blue-dim);
            --outline: var(--thorin-blue-light);
        }
        button.error-secondary {
            --bg: var(--thorin-red-surface);
            --bg-hover: var(--thorin-red-light);
            --color: var(--thorin-red-dim);
            --color-hover: var(--thorin-red-dim);
            --outline: var(--thorin-red-light);
        }
        button.subtle {
            --bg: var(--thorin-background-primary);
            --bg-hover: var(--thorin-background-secondary);
            --color: var(--thorin-text-secondary);
            --color-hover: var(--thorin-text-secondary);
            --outline: var(--thorin-border);
            --border: 1px solid var(--thorin-border);
        }
        button.disabled {
            --bg: var(--thorin-background-disabled);
            --bg-hover: var(--thorin-background-disabled);
            --color: var(--thorin-text-secondary);
            --color-hover: var(--thorin-text-secondary);
            --outline: transparent;
        }
        button.blue {
            --bg: var(--thorin-blue-primary);
            --bg-hover: var(--thorin-blue-bright);
            --color: var(--thorin-text-accent);
            --color-hover: var(--thorin-text-accent);
            --outline: var(--thorin-blue-bright);
        }
        button.indigo {
            --bg: var(--thorin-indigo-primary);
            --bg-hover: var(--thorin-indigo-bright);
            --color: var(--thorin-text-accent);
            --color-hover: var(--thorin-text-accent);
            --outline: var(--thorin-indigo-bright);
        }
        button.indigo {
            --bg: var(--thorin-indigo-primary);
            --bg-hover: var(--thorin-indigo-bright);
            --color: var(--thorin-text-accent);
            --color-hover: var(--thorin-text-accent);
            --outline: var(--thorin-indigo-bright);
        }
        button.purple {
            --bg: var(--thorin-purple-primary);
            --bg-hover: var(--thorin-purple-bright);
            --color: var(--thorin-text-accent);
            --color-hover: var(--thorin-text-accent);
            --outline: var(--thorin-purple-bright);
        }
        button.pink {
            --bg: var(--thorin-pink-primary);
            --bg-hover: var(--thorin-pink-bright);
            --color: var(--thorin-text-accent);
            --color-hover: var(--thorin-text-accent);
            --outline: var(--thorin-pink-bright);
        }
        button.red {
            --bg: var(--thorin-red-primary);
            --bg-hover: var(--thorin-red-bright);
            --color: var(--thorin-text-accent);
            --color-hover: var(--thorin-text-accent);
            --outline: var(--thorin-red-bright);
        }
        button.orange {
            --bg: var(--thorin-orange-primary);
            --bg-hover: var(--thorin-orange-bright);
            --color: var(--thorin-text-accent);
            --color-hover: var(--thorin-text-accent);
            --outline: var(--thorin-orange-bright);
        }
        button.yellow {
            --bg: var(--thorin-yellow-primary);
            --bg-hover: var(--thorin-yellow-bright);
            --color: var(--thorin-text-accent);
            --color-hover: var(--thorin-text-accent);
            --outline: var(--thorin-yellow-bright);
        }
        button.green {
            --bg: var(--thorin-green-primary);
            --bg-hover: var(--thorin-green-bright);
            --color: var(--thorin-text-accent);
            --color-hover: var(--thorin-text-accent);
            --outline: var(--thorin-green-bright);
        }
        button.grey {
            --bg: var(--thorin-grey-primary);
            --bg-hover: var(--thorin-grey-bright);
            --color: var(--thorin-text-accent);
            --color-hover: var(--thorin-text-accent);
            --outline: var(--thorin-grey-bright);
        }
        button {
            background: var(--bg);
            color: var(--color);
            display: inline-flex;
            justify-content: center;
            gap: 4px;
            overflow: hidden;
            appearance: none;
            border: var(--border);
            outline: none;
            border-radius: var(--thorin-radius-button);
            padding: 14px 16px;
            font-weight: bold;
        }
        button.full {
            width: 100%;
        }
        button:hover,
        button:active {
            background: var(--bg-hover);
            color: var(--color-hover);
            cursor: pointer;
            transform: translateY(-1px);
        }
        button:focus {
            box-shadow: 0 0 0 2px var(--outline);
        }
    `;

    @property({ type: String })
    variant: ButtonVariant = 'blue';

    @property({ type: String })
    width: 'auto' | 'full' = 'auto';

    @property({ attribute: false })
    onclick: (_event: PointerEvent) => void = () => {};

    render() {
        return html`
            <button @click="${this._onClick}" class="${this.computeClass}">
                <slot></slot>
            </button>
        `;
    }

    private get computeClass() {
        return (
            [this.width === 'full' ? 'full' : '', this.computeVariant()]
                .join(' ')
                .trim() || undefined
        );
    }

    private computeVariant() {
        if (this.variant === 'primary') {
            return 'blue';
        }

        if (this.variant === 'error') {
            return 'red';
        }

        return this.variant;
    }

    private _onClick(event: PointerEvent) {
        if (this.onclick) {
            this.onclick(event);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-button': ThorinButton;
    }
}
