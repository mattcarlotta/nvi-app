import type { JSXElement } from "solid-js"
import { createSignal, onCleanup, onMount } from "solid-js"

export const ACCESSIBLE_ELEMENTS = ["a[href]", "button:not(:disabled)", "input", "[tabindex]"];

export function isFocusable(element: AccessibleElement) {
    const { disabled, href, nodeName, rel, type, tabIndex } = element;

    if (typeof tabIndex === "number") return tabIndex >= 0;
    if (disabled) return false;

    switch (nodeName) {
        case "A":
            return !!href && rel !== "ignore";
        case "INPUT":
            return type !== "hidden";
        case "BUTTON":
            return true;
        default:
            return false;
    }
}

export interface AccessibleElement extends HTMLElement {
    readonly type?: string;
    readonly href?: string;
    readonly disabled?: boolean;
    readonly rel?: string;
}

export type FocusTrapperProps = {
    class?: string;
    onEscapePress: () => void;
    children: JSXElement | Element;
}

export default function FocusTrapper(props: FocusTrapperProps) {
    let tabbableItems: Array<HTMLElement> = [];
    let lastActiveElement: HTMLElement | undefined;
    let focusTrapRef!: HTMLDivElement;
    const [tabIndex, setTabIndex] = createSignal(-1);

    const handleClick = (event: MouseEvent) => {
        const tabbableItemIndex =
            tabbableItems?.findIndex((node) => node.isEqualNode(event.target as HTMLElement)) || 0;

        setTabIndex(tabbableItemIndex >= 0 ? tabbableItemIndex : 0);
    }

    const handleFocusTrap = (event: KeyboardEvent) => {
        const { key, shiftKey } = event;
        const tabPress = key === "Tab";
        const escKey = key === "Escape" || key === "Esc";
        const tabItemsLength = tabbableItems.length - 1;

        if (shiftKey && tabPress) {
            event.preventDefault();
            const prevIndex = tabIndex() - 1;
            const currentIndex = prevIndex < 0 ? tabItemsLength : prevIndex;
            setTabIndex(currentIndex);
            tabbableItems[currentIndex]?.focus();
        } else if (tabPress) {
            event.preventDefault()
            const nextIndex = tabIndex() + 1;
            const currentIndex = nextIndex > tabItemsLength ? 0 : nextIndex;
            setTabIndex(currentIndex);
            tabbableItems[currentIndex]?.focus();
        } else if (escKey) {
            event.stopPropagation();
            props.onEscapePress();
        }
    }

    onMount(() => {
        lastActiveElement = document.activeElement as HTMLElement

        tabbableItems = Array.from(
            focusTrapRef.querySelectorAll(ACCESSIBLE_ELEMENTS.join(","))
        ).filter((element) => isFocusable(element as AccessibleElement)) as HTMLElement[];

        if (tabbableItems.length) {
            setTabIndex(0);
        }
    });

    onCleanup(() => {
        lastActiveElement?.focus();
    });

    return (
        <div
            role="presentation"
            class={props.class}
            ref={focusTrapRef}
            onKeyDown={handleFocusTrap}
            onClick={handleClick}
        >
            {props.children}
        </div>
    );
}
