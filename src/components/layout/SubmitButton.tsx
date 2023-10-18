import type { JSX } from "solid-js";
import clsx from "../../utils/clsx";

type SubmitButtonProps = {
    class?: string;
    children: JSX.Element;
    containerClass?: string;
    disabled?: boolean;
    isSubmitting: boolean;
    onClick?: (e: Event) => void;
    primary?: boolean;
    secondary?: boolean;
    title?: string
    type?: "submit" | "reset" | "button"
}

export default function SubmitButton(props: SubmitButtonProps) {
    return (
        <div class={clsx(props.containerClass, "my-2")}>
            <button
                class={clsx(
                    props.class,
                    props.primary && !props.isSubmitting && "bg-gray-100 border border-gray-100 text-black fill-black hover:bg-gray-300",
                    props.primary && (props.isSubmitting || props.disabled) && "bg-gray-400 border text-black border-gray-400",
                    props.secondary && !props.isSubmitting && "bg-gray-900 border border-gray-600 text-gray-200 fill-gray-200 hover:bg-gray-800",
                    props.secondary && (props.isSubmitting || props.disabled) && "bg-gray-700 text-gray-200 border border-gray-600",
                    props.isSubmitting && "cursor-not-allowed",
                    'w-full rounded p-2 transition'
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

