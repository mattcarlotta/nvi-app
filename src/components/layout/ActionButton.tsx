import { Show, batch, createEffect } from "solid-js"
import { createStore } from "solid-js/store";
import ActionVerticalDots from "../icons/ActionVerticalDots";
import ActionHorizontalDots from "../icons/ActionHorizontalDots";
import FocusTrapper from "./FocusTrap";

type ActionButtonProps = {
    onEditClick: () => void;
    onDeleteClick: () => void;
}

type OptionsState = {
    isVisible: boolean;
    x: number;
    y: number;
}


export default function ActionButton(props: ActionButtonProps) {
    let wrapperRef: HTMLDivElement | undefined;
    const [options, setOptions] = createStore<OptionsState>({
        isVisible: false,
        x: 0,
        y: 0
    })

    const toggleVisibility = () => {
        batch(() => {
            setOptions("x", currentX => currentX === 0 ? -120 : 0);
            setOptions("y", currentY => currentY === 0 ? 4 : 0);
            setOptions("isVisible", v => !v);
        });
    }

    const handleClickOutside = (e: Event) => {
        if (options.isVisible && !wrapperRef?.contains(e.target as Node)) {
            toggleVisibility();
        }
    }

    const handleEditClick = () => {
        props.onEditClick();
        toggleVisibility();
    }

    const handleDeleteClick = () => {
        props.onDeleteClick();
        toggleVisibility();
    }

    createEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    });

    return (
        <div ref={wrapperRef}>
            <button class="hover:bg-gray-700 p-2 rounded" type="button" onClick={toggleVisibility}>
                <ActionHorizontalDots class="hidden w-6 h-6 text-white md:block" />
                <ActionVerticalDots class="w-6 h-6 text-white md:hidden" />
            </button>
            <Show when={options.isVisible}>
                <FocusTrapper onEscapePress={toggleVisibility}>
                    <ul
                        class="absolute z-10 bg-gray-950 border-2 border-gray-600 rounded p-2 min-w-[10rem]"
                        style={`transform: translate(${options.x}px,${options.y}px);box-shadow: 0px 7px 15px 5px #030712;`}
                    >
                        <li>
                            <button
                                class="w-full rounded p-2 text-left hover:bg-gray-900"
                                type="button"
                                onClick={handleEditClick}
                            >
                                Edit
                            </button>
                        </li>
                        <li>
                            <button
                                class="w-full rounded p-2 text-left text-red-600 hover:bg-gray-900"
                                type="button"
                                onClick={handleDeleteClick}
                            >
                                Remove
                            </button>
                        </li>
                    </ul>
                </FocusTrapper>
            </Show>
        </div>
    );
}
