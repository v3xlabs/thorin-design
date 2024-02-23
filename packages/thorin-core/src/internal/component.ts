/*
 * This was pulled AND MODIFIED from the URL below as
 * LitElements does not prevent the same element from
 * being registered more than once causing errors.
 * https://github.com/lit/lit-element/blob/master/src/lib/decorators.ts
 *
 * Idea: https://github.com/lit/lit-element/issues/207#issuecomment-1150057355
 */

interface Constructor<T> {
    new (...arguments_: any[]): T;
}

// From the TC39 Decorators proposal
interface ClassDescriptor {
    kind: 'class';
    elements: ClassElement[];
    finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
}

// From the TC39 Decorators proposal
interface ClassElement {
    kind: 'field' | 'method';
    key: PropertyKey;
    placement: 'static' | 'prototype' | 'own';
    initializer?: Function;
    extras?: ClassElement[];
    finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
    descriptor?: PropertyDescriptor;
}

const legacyCustomElement = (
    tagName: string,
    clazz: Constructor<HTMLElement>
) => {
    if (window?.customElements?.get(tagName)) {
        console.warn(
            `Custom element ${tagName} already defined. Registration skipped.`
        );

        return clazz as any;
    }

    window?.customElements?.define(tagName, clazz);

    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    return clazz as any;
};

const standardCustomElement = (
    tagName: string,
    descriptor: ClassDescriptor
) => {
    const { kind, elements } = descriptor;

    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz: Constructor<HTMLElement>) {
            if (window?.customElements?.get(tagName)) {
                console.warn(
                    `Custom element ${tagName} already defined. Registration skipped.`
                );

                return;
            }

            window?.customElements?.define(tagName, clazz);
        },
    };
};

/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```
 * @customElement('my-element')
 * class MyElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The name of the custom element to define.
 */
export const customElement =
    (tagName: string) =>
    (classOrDescriptor: Constructor<HTMLElement> | ClassDescriptor) =>
        typeof window != 'undefined'
            ? // eslint-disable-next-line unicorn/no-nested-ternary
              typeof classOrDescriptor === 'function'
                ? legacyCustomElement(tagName, classOrDescriptor)
                : standardCustomElement(tagName, classOrDescriptor)
            : undefined;
