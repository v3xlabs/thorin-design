/* eslint-disable unicorn/template-indent */
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { customElement } from '../../internal/component';

type LabelVariant = 'default' | 'active' | 'helper';

@customElement('thorin-label')
export class ThorinLabel extends LitElement {
    static override styles = css`
        .label.default {
            --color: var(--thorin-text-secondary);
            --border: 1px solid var(--thorin-border);
        }
        .label.active {
            --bg: var(--thorin-blue-surface);
            --color: var(--thorin-blue-primary);
            --border: 1px solid var(--thorin-blue-surface);
        }
        .label.helper {
            --color: var(--thorin-indigo-primary);
            --border: 1px solid var(--thorin-border);
            text-decoration: underline;
        }
        .label {
            background: var(--bg);
            color: var(--color);
            display: inline-flex;
            justify-content: center;
            gap: 4px;
            overflow: hidden;
            appearance: none;
            border: var(--border);
            outline: none;
            border-radius: var(--thorin-radius-label);
            padding: 4px 8px;
            font-weight: bold;
        }
    `;

    @property({ type: String })
    variant: LabelVariant = 'default';

    override render() {
        return html`
            <span class="${this.computeClass}">
                <slot></slot>
            </span>
        `;
    }

    private get computeClass() {
        return ['label', this.variant].join(' ').trim() || '';
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'thorin-label': ThorinLabel;
    }
}
