export default function SuccessIcon(props: { class: string }) {
    return (
        <svg class={props.class} viewBox="0 0 16 16">
            <title>Success</title>
            <path
                d="M6.53 9.02 4.58 7.07l-.88.89 2.83 2.83.88-.89 4.78-4.77-.89-.88-4.77 4.77z"
            />
            <path
                d="M8 .5A7.77 7.77 0 0 0 0 8a7.77 7.77 0 0 0 8 7.5A7.77 7.77 0 0 0 16 8 7.77 7.77 0 0 0 8 .5zm0 13.75A6.52 6.52 0 0 1 1.25 8 6.52 6.52 0 0 1 8 1.75 6.52 6.52 0 0 1 14.75 8 6.52 6.52 0 0 1 8 14.25z"
            />
        </svg>
    );
}
