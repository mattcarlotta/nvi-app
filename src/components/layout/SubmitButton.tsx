import type { JSX } from "solid-js";
import clsx from "../../utils/clsx";

type SubmitButtonProps = {
    children: JSX.Element
    isSubmitting: boolean;
    onClick?: (e: Event) => void;
    title?: string
    type?: "submit" | "reset" | "button"
}

export default function SubmitButton(props: SubmitButtonProps) {
    return (
        <div class="my-2">
            <button
                class={clsx(
                    props.isSubmitting ? 'text-gray' : 'text-black',
                    'w-full rounded bg-white p-2'
                )}
                disabled={props.isSubmitting}
                onClick={props.onClick}
                title={props.title}
                type={props.type || "submit"}
            >
                {props.children}
            </button>
        </div>
    );
};

