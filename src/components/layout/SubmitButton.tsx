import type { JSX } from "solid-js";
import clsx from "../../utils/clsx";

type SubmitButtonProps = {
    class?: string;
    children: JSX.Element;
    containerClass?: string;
    disabled?: boolean;
    isSubmitting: boolean;
    onClick?: (e: Event) => void;
    title?: string
    type?: "submit" | "reset" | "button"
}

export default function SubmitButton(props: SubmitButtonProps) {
    return (
        <div class={clsx(props.containerClass, "my-2")}>
            <button
                class={clsx(
                    props.class,
                    props.isSubmitting ? 'text-gray' : 'text-black',
                    props.disabled && "bg-gray-900 placeholder:text-gray-600",
                    'w-full rounded bg-white p-2'
                )}
                disabled={props.disabled || props.isSubmitting}
                onClick={props.onClick}
                title={props.title}
                type={props.type || "submit"}
            >
                {props.children}
            </button>
        </div>
    );
};

