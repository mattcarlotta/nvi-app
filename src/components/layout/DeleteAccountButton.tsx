import { Show, batch, createEffect, createSignal, onCleanup } from "solid-js"
import { createStore } from "solid-js/store";
import SpinnerIcon from "../icons/SpinnerIcon";
import { fetchAPIDELETE } from "../../utils/fetchAPI";
import { dispatchToastError } from "./Toast";
import FocusTrapper from "./FocusTrap";

type OptionsState = {
    isVisible: boolean;
    x: number;
    y: number;
}

export default function DeleteAccountButton() {
    let wrapperRef: HTMLDivElement | undefined;
    const [isLoading, setLoading] = createSignal(false);
    const [options, setOptions] = createStore<OptionsState>({
        isVisible: false,
        x: 0,
        y: 0
    });

    const toggleVisibility = () => {
        batch(() => {
            setOptions("x", currentX => currentX === 0 ? -20 : 0);
            setOptions("y", currentY => currentY === 0 ? -140 : 0);
            setOptions("isVisible", v => !v);
        });
    }

    const handleClickOutside = (e: Event) => {
        if (options.isVisible && !wrapperRef?.contains(e.target as Node)) {
            toggleVisibility();
        }
    }

    const handleEditClick = () => {
        toggleVisibility();
    }

    const handleDeleteClick = async () => {
        toggleVisibility();
        setLoading(true);
        try {
            await fetchAPIDELETE({ url: "/delete/account" });
            window.location.replace("/thank-you/");
        } catch (error) {
            dispatchToastError(`The server encountered an unexpected error: ${String(error)}`);
        } finally {
            setLoading(false);
        }
    }

    createEffect(() => {
        document.addEventListener("click", handleClickOutside);
    });

    onCleanup(() => {
        if (typeof document !== "undefined") {
            document.removeEventListener("click", handleClickOutside);
        }
    });

    return (
        <div class="max-w-max mt-2" ref={wrapperRef}>
            <Show
                when={!isLoading()}
                fallback={
                    <div title="Loading..." class="bg-red-800 border border-red-600 p-2 rounded">
                        <SpinnerIcon class="w-6 h-6 border-white" />
                    </div>
                }
            >
                <button class="text-gray-50 bg-red-800 border border-red-600 p-2 rounded hover:bg-red-900" type="button" onClick={toggleVisibility}>
                    Delete Account
                </button>
            </Show>
            <Show when={options.isVisible}>
                <FocusTrapper onEscapePress={toggleVisibility}>
                    <div
                        class="absolute z-10 bg-gray-950 border-2 border-gray-600 rounded p-2 min-w-[11rem]"
                        style={`transform: translate(${options.x}px,${options.y}px);`}
                    >
                        <p class="text-center pb-2">Are you sure?</p>
                        <div class="flex space-x-5">
                            <button
                                class="w-full text-gray-50 bg-gray-800 border border-gray-700 rounded p-2 hover:bg-gray-700 hover:border-gray-600 md:p-1.5"
                                type="button"
                                onClick={handleEditClick}
                            >
                                Cancel
                            </button>
                            <button
                                class="w-full text-gray-50 bg-red-800 border border-red-600 rounded p-2 hover:bg-red-900 md:p-1.5"
                                type="button"
                                onClick={handleDeleteClick}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </FocusTrapper>
            </Show>
        </div>
    );
}

