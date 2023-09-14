import { Show, batch, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import CloseIcon from "../icons/CloseIcon";
import clsx from "../../utils/clsx";

export type ToastEvent = {
    message: string | null;
    type: "success" | "error" | "";
    timeout?: number
};

type ToastNotifcationStore = {
    show: boolean;
} & Omit<ToastEvent, "timeout">;

interface ReceivedToastEvent extends CustomEvent<ToastEvent> { }

export function dispatchToastEvent(event: ToastEvent) {
    window.dispatchEvent(
        new CustomEvent("toast", {
            detail: event
        })
    );
}

export default function Toast() {
    let timerRef: NodeJS.Timeout | null = null;
    const [toast, setToast] = createStore<ToastNotifcationStore>({
        show: false,
        message: "",
        type: "",
    });

    const setTimer = (timeOut: number) => {
        timerRef = setTimeout(() => resetToast(), timeOut);
    };

    const clearTimer = () => {
        if (timerRef) {
            clearInterval(timerRef);
            timerRef = null;
        }
    };

    const resetToast = () => {
        if (toast.show) {
            clearTimer();
            batch(() => {
                setToast("show", false);
                setToast("message", "");
                setToast("type", "");
            });
        }
    };

    const handleMouseOver = () => {
        if (toast.show) {
            clearTimer();
        }
    };

    const handleMouseLeave = () => {
        if (!timerRef && toast.show) {
            setTimer(3000);
        }
    };

    const handleToastNotification = (event: Event) => {
        const { detail } = event as ReceivedToastEvent;

        resetToast();

        setTimer(detail.timeout || 3000);

        batch(() => {
            setToast("type", detail.type);
            setToast("message", detail.message);
            setToast("show", true);
        });
    };

    onMount(() => {
        window.addEventListener("toast", handleToastNotification);

        onCleanup(() => {
            if (timerRef) clearInterval(timerRef);
            window.removeEventListener("toast", handleToastNotification);
        });
    });

    return (
        <Show when={toast.show} fallback={null}>
            <div
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                class={clsx(
                    "fixed z-50 w-full max-w-[20rem] rounded top-0 right-0 md:top-4 md:right-10",
                    toast.type === "success" && "bg-green-500",
                    toast.type === "error" && "bg-red-500"
                )}
            >
                <div class="flex space-x-3 p-4 font-bold">
                    <h1
                        class="flex-1"
                        style={{ "overflow-wrap": "break-word", "word-break": "break-word" }}
                    >
                        {toast.message}
                    </h1>
                    <button
                        class="flex-initial self-start rounded p-1 hover:bg-black hover:bg-opacity-20"
                        type="button"
                        onClick={resetToast}
                    >
                        <CloseIcon class="h-6 text-red-500" />
                    </button>
                </div>
            </div>
        </Show>
    );
}
