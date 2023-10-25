import { onCleanup, onMount } from "solid-js";
import { Toaster, toast } from "solid-sonner";
import { getMessageFromStatusCode } from "../../utils/errors";

export type ToastEvent = {
    message: string | null;
    type: "success" | "error";
    timeout?: number
};

interface ReceivedToastEvent extends CustomEvent<ToastEvent> { }

export function dispatchToastError(error: unknown) {
    const message = getMessageFromStatusCode(error);
    dispatchToastEvent({ type: "error", message, timeout: 3000 });
}

export function dispatchToastEvent(event: ToastEvent) {
    window.dispatchEvent(
        new CustomEvent("dispatch-toast", {
            detail: event
        })
    );
}

export default function Toast() {
    const handleToastNotification = (event: Event) => {
        const { detail } = event as ReceivedToastEvent;

        toast[detail.type](detail.message, { duration: detail.timeout || 3000 });

    };

    onMount(() => {
        window.addEventListener("dispatch-toast", handleToastNotification);

        onCleanup(() => {
            window.removeEventListener("dispatch-toast", handleToastNotification);
        });
    });

    return (
        <Toaster closeButton expand richColors position="top-right" />
    );
}
