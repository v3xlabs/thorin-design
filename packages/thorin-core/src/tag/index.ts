/* eslint-disable unicorn/template-indent */
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type TagColorVariant =
    | 'blue'
    // | 'indigo'
    // | 'purple'
    // | 'pink'
    | 'red'
    // | 'orange'
    | 'yellow'
    | 'green'
    | 'grey';

@customElement('thorin-tag')
export class ThorinTag extends LitElement {
    static styles = css`
        .tag.blue {
            --bg: var(--thorin-blue-surface);
            --color: var(--thorin-blue-primary);
        }
        .tag.red {
            --bg: var(--thorin-red-surface);
            --color: var(--thorin-red-primary);
        }
        .tag.yellow {
            --bg: var(--thorin-yellow-surface);
            --color: var(--thorin-yellow-active);
        }
        .tag.green {
            --bg: var(--thorin-green-surface);
            --color: var(--thorin-green-primary);
        }
        .tag.grey {
            --bg: var(--thorin-grey-surface);
            --color: var(--thorin-text-secondary);
        }
        .tag {
            background: var(--bg);
            color: var(--color);
            display: inline-flex;
            justify-content: center;
            gap: 4px;
            overflow: hidden;
            appearance: none;
            border: var(--border);
            outline: none;
            border-radius: var(--thorin-radius-tag);
            padding: 2px 8px;
            font-weight: bold;
        }
    `;

    @property({ type: String })
    variant: TagColorVariant = 'blue';

    render() {
        return html`
            <span class="${this.computeClass}">
                <slot></slot>
            </span>
        `;
    }

    private get computeClass() {
        return ['tag', this.variant].join(' ').trim() || undefined;
    }

    private _onClick(event: PointerEvent) {
        if (this.onclick) {
            this.onclick(event);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-tag': ThorinTag;
    }
}
