import clsx from "../../utils/clsx";

export default function SpinnerIcon(props: { class: string }) {
    return (
        <div class={clsx(
            props.class,
            "rounded-full border-2 border-black border-b-transparent animate-spin"
        )} />
    );
}
