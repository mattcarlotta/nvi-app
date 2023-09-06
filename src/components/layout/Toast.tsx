import { Show, batch, onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import CloseIcon from '../icons/CloseIcon';
import clsx from '../../utils/clsx';

export type ToastEvent = {
    message: string;
    type: 'success' | 'error' | '';
};

type ToastNotifcationStore = {
    show: boolean;
} & ToastEvent;

interface ReceivedToastEvent extends CustomEvent<ToastEvent> { }

export function dispatchToastEvent(event: ToastEvent) {
    window.dispatchEvent(
        new CustomEvent('toast', {
            detail: event
        })
    );
}

export default function Toast() {
    let timerRef: NodeJS.Timeout | null = null;
    const [toast, setToast] = createStore<ToastNotifcationStore>({
        show: false,
        message: '',
        type: ''
    });

    const setTimer = () => {
        timerRef = setTimeout(() => resetToast(), 3000);
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
                setToast('show', false);
                setToast('message', '');
                setToast('type', '');
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
            setTimer();
        }
    };

    const handleToastNotification = (event: Event) => {
        const { detail } = event as ReceivedToastEvent;

        resetToast();

        setTimer();

        batch(() => {
            setToast('type', detail.type);
            setToast('message', detail.message);
            setToast('show', true);
        });
    };

    onMount(() => {
        window.addEventListener('toast', handleToastNotification);

        onCleanup(() => {
            if (timerRef) clearInterval(timerRef);
            window.removeEventListener('toast', handleToastNotification);
        });
    });

    return (
        <Show when={toast.show} fallback={null}>
            <div
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                class={clsx(
                    'fixed right-10 top-4 w-72 rounded',
                    toast.type === 'success' && 'bg-green-500',
                    toast.type === 'error' && 'bg-red-500'
                )}
            >
                <div class="flex space-x-3 p-4 font-bold">
                    <h1
                        class="flex-1"
                        style={{ 'overflow-wrap': 'break-word', 'word-break': 'break-word' }}
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
